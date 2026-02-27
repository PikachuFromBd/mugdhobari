const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: { type: Date, default: Date.now },
  changedBy: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    area: { type: String, default: '' }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true },
    size: String,
    color: String,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  courierName: { type: String, default: '' },
  trackingId: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
