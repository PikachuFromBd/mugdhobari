require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shahadathassan29_db_user:dTyDcxcuq8kKf65H@cluster0.izksong.mongodb.net/?appName=Cluster0';
mongoose.connect(MONGODB_URI).then(async () => {
    const ps = await Product.find({ isPublished: { $ne: false } });
    console.log('Count:', ps.length);
    ps.forEach(p => console.log((p.nameBn || p.name), '|', p.images && p.images[0], '|', p.trending));
    await mongoose.disconnect();
});
