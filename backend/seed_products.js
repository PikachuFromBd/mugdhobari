// Seed script using the project's own mongoose + models
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shahadathassan29_db_user:dTyDcxcuq8kKf65H@cluster0.izksong.mongodb.net/?appName=Cluster0';

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete products with broken images
    const all = await Product.find();
    let deleted = 0;
    for (const p of all) {
        const img = p.images?.[0] || '';
        if (!img || img.includes('workers.dev') || img.includes('unsplash') || img === '/placeholder.jpg') {
            await Product.findByIdAndDelete(p._id);
            deleted++;
        }
    }
    console.log(`Deleted ${deleted} products with broken images`);

    const products = [
        {
            name: 'Premium Red Silk Saree',
            nameBn: 'প্রিমিয়াম লাল সিল্ক শাড়ি',
            category: 'saree',
            categoryBn: 'শাড়ি',
            price: 2500,
            discountPrice: 1999,
            stock: 25,
            description: 'Beautiful handwoven red silk saree with golden border and intricate zari work.',
            descriptionBn: 'সুন্দর হাতে বোনা লাল সিল্ক শাড়ি সোনালি পাড় ও জরি কাজ সহ।',
            images: ['/uploads/saree-premium.png'],
            sizes: ['ফ্রি সাইজ'],
            colors: ['লাল', 'মেরুন'],
            trending: true,
            featured: true,
            isPublished: true
        },
        {
            name: 'Navy Blue Three-Piece Set',
            nameBn: 'নেভি ব্লু থ্রি-পিস সেট',
            category: 'three-piece',
            categoryBn: 'থ্রি-পিস',
            price: 3200,
            discountPrice: 2650,
            stock: 15,
            description: 'Elegant navy blue three-piece salwar kameez with golden embroidery.',
            descriptionBn: 'সোনালি এমব্রয়ডারি সহ এলিগ্যান্ট নেভি ব্লু থ্রি-পিস সালোয়ার কামিজ।',
            images: ['/uploads/threepiece-navy.png'],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['নেভি ব্লু', 'কালো'],
            trending: true,
            featured: true,
            isPublished: true
        },
        {
            name: 'Premium Gift Combo Set',
            nameBn: 'প্রিমিয়াম গিফট কম্বো সেট',
            category: 'combo',
            categoryBn: 'কম্বো',
            price: 4500,
            discountPrice: 3499,
            stock: 10,
            description: 'Luxury gift combo set including silk scarf, cosmetics pouch and jewelry.',
            descriptionBn: 'সিল্ক স্কার্ফ, কসমেটিক্স পাউচ ও জুয়েলারি সহ গিফট কম্বো সেট।',
            images: ['/uploads/combo-gift.png'],
            sizes: [],
            colors: [],
            trending: true,
            featured: false,
            isPublished: true
        },
        {
            name: 'Premium Cosmetics Collection',
            nameBn: 'প্রিমিয়াম কসমেটিক্স কালেকশন',
            category: 'cosmetics',
            categoryBn: 'কসমেটিক্স',
            price: 1850,
            discountPrice: 1499,
            stock: 30,
            description: 'Complete cosmetics collection with lipstick, foundation, eyeshadow and brushes.',
            descriptionBn: 'লিপস্টিক, ফাউন্ডেশন, আইশ্যাডো ও ব্রাশ সহ কসমেটিক্স কালেকশন।',
            images: ['/uploads/cosmetics-kit.png'],
            sizes: [],
            colors: [],
            trending: false,
            featured: true,
            isPublished: true
        },
        {
            name: 'Olive Green Premium T-Shirt',
            nameBn: 'অলিভ গ্রিন প্রিমিয়াম টি-শার্ট',
            category: 'tshirt',
            categoryBn: 'টি-শার্ট',
            price: 950,
            discountPrice: 750,
            stock: 50,
            description: 'Trendy olive green premium cotton t-shirt with minimal design.',
            descriptionBn: 'মিনিমাল ডিজাইনের অলিভ গ্রিন প্রিমিয়াম কটন টি-শার্ট।',
            images: ['/uploads/tshirt-olive.png'],
            sizes: ['M', 'L', 'XL', 'XXL'],
            colors: ['অলিভ', 'কালো', 'সাদা'],
            trending: true,
            featured: false,
            isPublished: true
        }
    ];

    for (const data of products) {
        try {
            const p = new Product(data);
            await p.save();
            console.log('Created: ' + data.nameBn);
        } catch (e) {
            console.log('Failed: ' + data.nameBn + ' - ' + e.message);
        }
    }

    const final = await Product.find({ isPublished: { $ne: false } });
    console.log('Total published products: ' + final.length);
    for (const p of final) {
        console.log('  ' + (p.nameBn || p.name) + ' | img: ' + (p.images?.[0] || 'NONE') + ' | trending: ' + p.trending);
    }

    await mongoose.disconnect();
    console.log('Done!');
}

seed().catch(function (e) { console.error(e); process.exit(1); });
