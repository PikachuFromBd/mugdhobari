# Quick Start Guide - MugdhoBari E-commerce

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Backend (Express, MongoDB, etc.)
- Frontend (Next.js, React, etc.)

### 2. Setup Environment Variables

**Backend** - Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mugdhobari
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@mugdhobari.com
ADMIN_PASSWORD=admin123
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Copy Logo
```bash
node setup.js
```
Or manually copy `logo.png` to `frontend/public/logo.png`

### 4. Start MongoDB
Make sure MongoDB is running:
```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod

# Linux/Mac
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 5. Run the Application
```bash
npm run dev
```

This starts:
- Backend server: http://localhost:5000
- Frontend server: http://localhost:3000

### 6. Access the Website
Open your browser and go to: **http://localhost:3000**

## First-Time Admin Setup

1. Register a new account at `/signup`
2. Manually update the user role to 'admin' in MongoDB:
```javascript
// Connect to MongoDB
use mugdhobari
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use the default admin credentials from `.env`:
- Email: admin@mugdhobari.com
- Password: admin123

## Testing the Application

1. **Browse Products**: Visit homepage to see trending products
2. **View Categories**: Click on category menu items
3. **Add to Cart**: Click on any product → Add to cart
4. **Checkout**: Go to cart → Proceed to checkout
5. **Place Order**: Fill in details → Complete order
6. **Admin Panel**: Login as admin → Manage products and orders

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in backend/.env
- For MongoDB Atlas, use connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/mugdhobari`

### Port Already in Use
- Change PORT in backend/.env
- Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly

### Logo Not Showing
- Make sure logo.png exists in frontend/public/
- Run `node setup.js` to copy logo

### Dependencies Error
- Delete node_modules folders
- Run `npm run install-all` again

## Production Deployment

1. Set NODE_ENV=production
2. Update API URLs to production domain
3. Use secure JWT_SECRET
4. Configure MongoDB Atlas or production MongoDB
5. Build frontend: `cd frontend && npm run build`
6. Start backend: `cd backend && npm start`

## Support

For issues or questions, check the main README.md file.

