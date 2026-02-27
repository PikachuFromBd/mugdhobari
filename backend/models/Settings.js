const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    deliveryDhaka: { type: Number, default: 60 },
    deliveryOutside: { type: Number, default: 120 },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    returnPolicy: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
