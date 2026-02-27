const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Banner = require('../models/Banner');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Ensure admin
const ensureAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Configure multer — save to frontend/public/uploads so Next.js serves them as static files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../frontend/public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});
const upload = multer({ storage });

router.use(auth);
router.use(ensureAdmin);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayOrders,
      pendingOrders,
      monthOrders,
      allOrders,
      lowStockProducts,
      topProducts
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ status: 'pending' }),
      Order.find({ createdAt: { $gte: startOfMonth } }),
      Order.find({ createdAt: { $gte: startOfToday } }),
      Product.find({ stock: { $lt: 5 }, isPublished: { $ne: false } }).select('name nameBn stock images').limit(10),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', totalQty: { $sum: '$items.quantity' }, totalRev: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { totalRev: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: { totalQty: 1, totalRev: 1, 'product.nameBn': 1, 'product.images': 1 } }
      ])
    ]);

    const todaySales = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const monthSales = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate('items.product', 'nameBn');

    res.json({
      todayOrders,
      pendingOrders,
      todaySales,
      monthSales,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      topProducts,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { search, category, stock, published } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { nameBn: new RegExp(search, 'i') }];
    if (category) filter.category = category;
    if (stock === 'low') filter.stock = { $gt: 0, $lt: 5 };
    if (stock === 'out') filter.stock = 0;
    if (stock === 'in') filter.stock = { $gte: 5 };
    if (published === 'false') filter.isPublished = false;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', upload.array('images', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.colors) data.colors = JSON.parse(data.colors);
    if (data.variants) data.variants = JSON.parse(data.variants);
    data.price = parseFloat(data.price);
    if (data.discountPrice) data.discountPrice = parseFloat(data.discountPrice);
    if (data.stock) data.stock = parseInt(data.stock);
    data.trending = data.trending === 'true';
    data.featured = data.featured === 'true';
    data.isNew = data.isNew === 'true';
    data.isPublished = data.isPublished !== 'false';
    const product = new Product({ ...data, images });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    if (updateData.sizes) updateData.sizes = JSON.parse(updateData.sizes);
    if (updateData.colors) updateData.colors = JSON.parse(updateData.colors);
    if (updateData.variants) updateData.variants = JSON.parse(updateData.variants);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.discountPrice) updateData.discountPrice = parseFloat(updateData.discountPrice);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
    if (updateData.trending !== undefined) updateData.trending = updateData.trending === 'true';
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true';
    if (updateData.isNew !== undefined) updateData.isNew = updateData.isNew === 'true';
    if (updateData.isPublished !== undefined) updateData.isPublished = updateData.isPublished !== 'false';
    Object.assign(product, updateData);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Duplicate product
router.post('/products/:id/duplicate', async (req, res) => {
  try {
    const original = await Product.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ error: 'Product not found' });
    delete original._id;
    delete original.slug;
    delete original.createdAt;
    original.name = original.name + ' (Copy)';
    original.nameBn = original.nameBn + ' (কপি)';
    const copy = new Product(original);
    await copy.save();
    res.status(201).json(copy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stock adjustment
router.patch('/products/:id/stock', async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.stock = Math.max(0, product.stock + parseInt(adjustment));
    await product.save();
    res.json({ stock: product.stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { status, payment, city, search, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (payment) filter.paymentMethod = payment;
    if (city) filter['customer.city'] = new RegExp(city, 'i');
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59');
    }
    if (search) {
      filter.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'customer.name': new RegExp(search, 'i') },
        { 'customer.phone': new RegExp(search, 'i') }
      ];
    }
    const orders = await Order.find(filter)
      .populate('items.product', 'nameBn images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      {
        status,
        $push: { statusHistory: { status, changedAt: new Date() } }
      },
      { new: true }
    ).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/orders/:orderId', async (req, res) => {
  try {
    const { courierName, trackingId, notes, deliveryCharge, discount, paymentMethod } = req.body;
    const update = {};
    if (courierName !== undefined) update.courierName = courierName;
    if (trackingId !== undefined) update.trackingId = trackingId;
    if (notes !== undefined) update.notes = notes;
    if (deliveryCharge !== undefined) update.deliveryCharge = parseFloat(deliveryCharge);
    if (discount !== undefined) update.discount = parseFloat(discount);
    if (paymentMethod !== undefined) update.paymentMethod = paymentMethod;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      update,
      { new: true }
    ).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk status update
router.post('/orders/bulk-status', async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    await Order.updateMany(
      { orderId: { $in: orderIds } },
      { status, $push: { statusHistory: { status, changedAt: new Date() } } }
    );
    res.json({ updated: orderIds.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── INVENTORY ────────────────────────────────────────────────────────────────
router.get('/inventory', async (req, res) => {
  try {
    const lowStock = await Product.find({ stock: { $lt: 10 }, isPublished: { $ne: false } })
      .select('name nameBn stock images category price')
      .sort({ stock: 1 });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$customer.email',
          name: { $first: '$customer.name' },
          phone: { $first: '$customer.phone' },
          email: { $first: '$customer.email' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/customers/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const orders = await Order.find({ 'customer.email': email })
      .populate('items.product', 'nameBn images')
      .sort({ createdAt: -1 });
    if (!orders.length) return res.status(404).json({ error: 'Customer not found' });
    const customer = orders[0].customer;
    const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
    res.json({ customer, orders, totalSpent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── BANNERS ──────────────────────────────────────────────────────────────────
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/banners', upload.single('image'), async (req, res) => {
  try {
    const { link, title, active, order } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const image = `/uploads/${req.file.filename}`;
    const banner = new Banner({ image, link, title, active: active !== 'false', order: parseInt(order) || 0 });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/banners/:id', upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    const { link, title, active, order } = req.body;
    if (req.file) banner.image = `/uploads/${req.file.filename}`;
    if (link !== undefined) banner.link = link;
    if (title !== undefined) banner.title = title;
    if (active !== undefined) banner.active = active !== 'false';
    if (order !== undefined) banner.order = parseInt(order);
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      settings = await Settings.create({ key: 'global' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: new Date() };
    delete update.key;
    const settings = await Settings.findOneAndUpdate(
      { key: 'global' },
      update,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
