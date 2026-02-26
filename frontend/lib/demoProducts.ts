export type DemoProduct = {
  _id: string
  name: string
  nameBn: string
  description: string
  descriptionBn: string
  category: string
  categoryBn: string
  price: number
  images: string[]
  sizes?: string[]
  colors?: string[]
  stock: number
  trending?: boolean
  featured?: boolean
}

export const demoProducts: DemoProduct[] = [
  {
    _id: 'demo-three-piece-1',
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
    trending: true,
  },
  {
    _id: 'demo-cosmetics-1',
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
    featured: true,
  },
  {
    _id: 'demo-combo-1',
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
    trending: true,
  },
  {
    _id: 'demo-saree-1',
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
  },
  {
    _id: 'demo-tshirt-1',
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
  },
]
