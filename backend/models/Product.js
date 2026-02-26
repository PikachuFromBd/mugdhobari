const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameBn: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionBn: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hoodie', 'shirt', 'tshirt', 'saree', 'three-piece', 'cosmetics', 'combo', 'shoes', 'other']
  },
  categoryBn: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  colors: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 0
  },
  trending: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

