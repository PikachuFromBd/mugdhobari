const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shahadathassan29_db_user:dTyDcxcuq8kKf65H@cluster0.izksong.mongodb.net/?appName=Cluster0';

const demoProducts = [
  {
    name: 'Three Piece Premium 1',
    nameBn: 'থ্রি পিস প্রিমিয়াম ১',
    description: 'Elegant three-piece set perfect for festive occasions.',
    descriptionBn: 'আড়ম্বরপূর্ণ থ্রি পিস, উৎসবের জন্য আদর্শ।',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2650,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=GBYXM2SUKNWE6ZJSHFFESQ3RHG6VY',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=KFHUE6TCIFSXOUSOKQ3FAUCCM2RES',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=GFXGM2BUPAZVIQZZLA2HAVT2MZBIC',
    ],
    stock: 8,
    sizes: ['36', '38', '40', '42'],
    colors: [],
    trending: true,
    featured: false,
  },
  {
    name: 'Three Piece Elegant',
    nameBn: 'থ্রি পিস এলিগ্যান্ট',
    description: 'Elegant three-piece for special occasions.',
    descriptionBn: 'বিশেষ অনুষ্ঠানের জন্য এলিগ্যান্ট থ্রি পিস।',
    category: 'three-piece',
    categoryBn: 'থ্রি-পিস',
    price: 2950,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=KFHUE6TCIFSXOUSOKQ3FAUCCM2RES',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=GFXGM2BUPAZVIQZZLA2HAVT2MZBIC',
    ],
    stock: 5,
    sizes: ['36', '38', '40'],
    colors: [],
    trending: false,
    featured: true,
  },
  {
    name: 'Cosmetics Bundle 1',
    nameBn: 'কসমেটিক্স বান্ডেল ১',
    description: 'Curated cosmetics set for daily beauty routine.',
    descriptionBn: 'প্রতিদিনের সৌন্দর্যের জন্য বাছাইকৃত কসমেটিক্স সেট।',
    category: 'cosmetics',
    categoryBn: 'কসমেটিক্স',
    price: 1450,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=KVWHQ4RYKJHVGNL2GNTFKSTUNEHNI',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=LJQWUZDNIRWDM2TPKQYHURTEGHZ6Q',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=NJAUG6LIN5VDOQSXINZWERJVPFRYW',
    ],
    stock: 15,
    sizes: [],
    colors: [],
    trending: false,
    featured: true,
  },
  {
    name: 'Cosmetics Glow Kit',
    nameBn: 'কসমেটিক্স গ্লো কিট',
    description: 'Premium glow kit for radiant skin.',
    descriptionBn: 'উজ্জ্বল ত্বকের জন্য প্রিমিয়াম গ্লো কিট।',
    category: 'cosmetics',
    categoryBn: 'কসমেটিক্স',
    price: 1850,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=LJQWUZDNIRWDM2TPKQYHURTEGHZ6Q',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=NJAUG6LIN5VDOQSXINZWERJVPFRYW',
    ],
    stock: 10,
    sizes: [],
    colors: [],
    trending: true,
    featured: false,
  },
  {
    name: 'Saree + Cosmetics Combo',
    nameBn: 'শাড়ি + কসমেটিক্স কম্বো',
    description: 'Special combo with premium saree and cosmetics.',
    descriptionBn: 'প্রিমিয়াম শাড়ি ও কসমেটিক্সসহ বিশেষ কম্বো।',
    category: 'combo',
    categoryBn: 'কম্বো',
    price: 3250,
    images: [
      'https://filetolinkbot.shahadathassan.workers.dev/?file=NVEDM4JXIZSFISZXJIZFCY2XJUTCW',
      'https://filetolinkbot.shahadathassan.workers.dev/?file=KZCDATTJI53GEMDTKVWFQ4DMJELUC',
    ],
    stock: 6,
    sizes: [],
    colors: [],
    trending: true,
    featured: false,
  },
  {
    name: 'Three Piece + Cosmetics Combo',
    nameBn: 'থ্রি পিস + কসমেটিক্স কম্বো',
    description: 'Premium combo with three piece and cosmetics.',
    descriptionBn: 'থ্রি পিস ও কসমেটিক্সসহ প্রিমিয়াম কম্বো।',
    category: 'combo',
    categoryBn: 'কম্বো',
    price: 3750,
    images: [
      'https://filetolinkbot.shahadathassan.workers.dev/?file=KZCDATTJI53GEMDTKVWFQ4DMJELUC',
      'https://filetolinkbot.shahadathassan.workers.dev/?file=NVEDM4JXIZSFISZXJIZFCY2XJUTCW',
    ],
    stock: 4,
    sizes: ['36', '38', '40'],
    colors: [],
    trending: false,
    featured: true,
  },
  {
    name: 'Silk Saree Premium',
    nameBn: 'সিল্ক শাড়ি প্রিমিয়াম',
    description: 'Soft silk saree with rich patterns.',
    descriptionBn: 'মোলায়েম সিল্ক শাড়ি সমৃদ্ধ ডিজাইনে।',
    category: 'saree',
    categoryBn: 'শাড়ি',
    price: 2850,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=GU2XEUCCMJLTCTDPOVMEY6KEJQX6E',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=NU2WG32GLFRXGR2FNY4GO6DTMET6K',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=IY3EOVC2JY4XMOCWMVXWON2KJ6TI6',
    ],
    stock: 12,
    sizes: [],
    colors: ['লাল', 'নীল', 'সবুজ'],
    trending: false,
    featured: false,
  },
  {
    name: 'Cotton Saree Classic',
    nameBn: 'কটন শাড়ি ক্লাসিক',
    description: 'Classic cotton saree for everyday wear.',
    descriptionBn: 'প্রতিদিনের পরিধানের জন্য ক্লাসিক কটন শাড়ি।',
    category: 'saree',
    categoryBn: 'শাড়ি',
    price: 1950,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=NU2WG32GLFRXGR2FNY4GO6DTMET6K',
      'https://filehosting.shahadathassan.workers.dev/file/images.jpg?hash=IY3EOVC2JY4XMOCWMVXWON2KJ6TI6',
    ],
    stock: 18,
    sizes: [],
    colors: ['হলুদ', 'গোলাপি'],
    trending: true,
    featured: false,
  },
  {
    name: 'Graphic T-Shirt',
    nameBn: 'গ্রাফিক টি-শার্ট',
    description: 'Comfortable cotton tee with bold graphic.',
    descriptionBn: 'আরামদায়ক কটন টি-শার্ট চমকপ্রদ গ্রাফিকসহ।',
    category: 'tshirt',
    categoryBn: 'টি-শার্ট',
    price: 750,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=GRYFEWCMGBVDMRCUGQZVQSCWJQMLE',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=JBGFEZSDON5HSULVPIZE6VRVKFKPO',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=HB4W252SKFRFKUDUNUZEO23CJXSI2',
    ],
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['কালো', 'সাদা', 'নেভি'],
    trending: false,
    featured: false,
  },
  {
    name: 'Premium Polo T-Shirt',
    nameBn: 'প্রিমিয়াম পোলো টি-শার্ট',
    description: 'Premium polo t-shirt for casual style.',
    descriptionBn: 'ক্যাজুয়াল স্টাইলের জন্য প্রিমিয়াম পোলো টি-শার্ট।',
    category: 'tshirt',
    categoryBn: 'টি-শার্ট',
    price: 950,
    images: [
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=JBGFEZSDON5HSULVPIZE6VRVKFKPO',
      'https://filehosting.shahadathassan.workers.dev/file/download.jpg?hash=HB4W252SKFRFKUDUNUZEO23CJXSI2',
    ],
    stock: 25,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['সাদা', 'কালো'],
    trending: true,
    featured: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert demo products
    const inserted = await Product.insertMany(demoProducts);
    console.log(`Seeded ${inserted.length} products successfully`);

    // Log the IDs for reference
    inserted.forEach(p => {
      console.log(`  ${p.nameBn} -> ${p._id}`);
    });

    await mongoose.connection.close();
    console.log('Done! MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
