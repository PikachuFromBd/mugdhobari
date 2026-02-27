const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBn: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  descriptionBn: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['hoodie', 'shirt', 'tshirt', 'saree', 'three-piece', 'cosmetics', 'combo', 'shoes', 'other']
  },
  categoryBn: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  images: [{ type: String }],
  // Legacy flat arrays (kept for backward compatibility)
  sizes: [{ type: String }],
  colors: [{ type: String }],
  // New per-variant stock
  variants: [variantSchema],
  stock: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug from name if not provided
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
