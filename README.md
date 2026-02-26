# MugdhoBari - E-commerce Website

A complete e-commerce website for MugdhoBari clothing store in Bangladesh. Built with Next.js (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- 🛍️ **Product Management**: Browse products by category (Hoodie, Shirt, T-Shirt, Saree, Three-Piece, Shoes)
- 🔥 **Trending Products**: Auto-rotating carousel showcasing trending items
- 🛒 **Shopping Cart**: Add products to cart with size and color selection
- 📦 **Order Management**: Complete order placement with customer details
- ✅ **Order Tracking**: Order success page with unique order ID
- 👤 **User Authentication**: Login and Signup functionality
- 🔐 **Admin Panel**: Manage products and view orders
- 🌐 **Bangla Language Support**: 70% content in Bangla with proper fonts
- 📱 **Responsive Design**: Works on all devices
- 🔗 **Social Sharing**: Share products and orders on Facebook, WhatsApp, Twitter

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Swiper.js (for carousel)
- React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "e commerc"
```

2. **Run setup script** (copies logo to public folder)
```bash
node setup.js
```

3. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/mugdhobari
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@mugdhobari.com
ADMIN_PASSWORD=admin123
```

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Run the application**
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Product images
│   └── server.js        # Express server
├── frontend/
│   ├── app/             # Next.js app directory
│   ├── components/     # React components
│   └── public/         # Static files
└── logo.png            # Store logo
```

## Usage

### For Customers
1. Browse products on the homepage
2. View trending products in the carousel
3. Click on any product to see details
4. Add products to cart
5. Proceed to checkout
6. Fill in order details (name, email, phone, address)
7. Complete order and receive order ID
8. Share order on social media

### For Admin
1. Login with admin credentials
2. Access admin panel
3. Add/Edit/Delete products
4. View all orders
5. Update order status

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/trending/all` - Get trending products
- `GET /api/products/category/:category` - Get products by category

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order by ID

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:orderId/status` - Update order status

## Categories

- Hoodie (হুডি)
- Shirt (শার্ট)
- T-Shirt (টি-শার্ট)
- Saree (শাড়ি)
- Three-Piece (থ্রি-পিস)
- Shoes (জুতা)
- Other (অন্যান্য)

## Fonts

The website uses:
- Noto Sans Bengali (Google Fonts)
- Sulaiman Lipi (if available)
- Anket Bangla (if available)

## Icons

- React Icons (Fi, Fa icons)
- Font Awesome compatible

## License

This project is proprietary software for MugdhoBari.

## Support

For support, contact:
- Email: info@mugdhobari.com
- Phone: +880 1234-567890
- Facebook: https://facebook.com/mugdhobari
- WhatsApp: https://wa.me/8801234567890

"# mugdhobari" 
