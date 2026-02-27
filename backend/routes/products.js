const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all published products
router.get('/', async (req, res) => {
  try {
    const { category, trending, featured } = req.query;
    let query = { isPublished: { $ne: false } }; // only show published products

    if (category) query.category = category;
    if (trending === 'true') query.trending = true;
    if (featured === 'true') query.featured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products (must be before /:id)
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      isPublished: { $ne: false },
      $or: [
        { name: regex },
        { nameBn: regex },
        { description: regex },
        { descriptionBn: regex },
        { category: regex },
        { categoryBn: regex },
      ]
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending products
router.get('/trending/all', async (req, res) => {
  try {
    const products = await Product.find({ trending: true, isPublished: { $ne: false } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category, isPublished: { $ne: false } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product (must be last because /:id matches anything)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
