const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

const User = require('./models/User');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await ensureAdminUser();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mugdhobari.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'MugdhoBari Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Default admin created: ${adminEmail}`);
    } else if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Admin role assigned to: ${adminEmail}`);
    } else {
      console.log(`Admin already exists: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error ensuring admin:', err.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
