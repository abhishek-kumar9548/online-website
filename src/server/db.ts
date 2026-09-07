import crypto from 'crypto';
import { Category, Product, User, Order, Review, Coupon, ContactMessage, AdminStats } from '../types.ts';

// Helper for secure password hashing with salt
export function hashPassword(password: string): string {
  const salt = 'utsav_veda_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Generate human-friendly order number
export function generateOrderNumber(): string {
  const prefix = 'UTSAV';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

// -------------------------------------------------------------
// SEED DATA: CATEGORIES
// -------------------------------------------------------------
export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Festival Decorations',
    slug: 'festival-decorations',
    description: 'Artisan floral torans, handcrafted wall hangings, and reusable festive floor mats.',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
  },
  {
    id: 'cat-2',
    name: 'Diyas & Lamps',
    slug: 'diyas-and-lamps',
    description: 'Traditional terracotta oil lamps, pure brass akhand deepams, and artisanal painted diyas.',
    image: 'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
  },
  {
    id: 'cat-3',
    name: 'Gift Items',
    slug: 'gift-items',
    description: 'Royal dry fruit hampers, silver-plated tokens, and festive celebration gift boxes.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    itemCount: 9,
  },
  {
    id: 'cat-4',
    name: 'Pujā/Religious Accessories',
    slug: 'puja-accessories',
    description: 'Authentic brass pooja thalis, temple chowkis, pure dhoop incense, and ritual bells.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    itemCount: 10,
  },
  {
    id: 'cat-5',
    name: 'Decorative Lights',
    slug: 'decorative-lights',
    description: 'Warm fairy LED curtains, Moroccan hanging brass lanterns, and ambient celebration lamps.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    itemCount: 7,
  },
  {
    id: 'cat-6',
    name: 'Party Supplies',
    slug: 'party-supplies',
    description: 'Eco-friendly paper kandeels, natural floral rangoli colors, and festive celebration decor.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    itemCount: 6,
  },
];

// -------------------------------------------------------------
// SEED DATA: PRODUCTS (Strictly Safe, Permitted, Lawful Items)
// -------------------------------------------------------------
export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Handcrafted Terracotta Painted Diyas (Set of 12)',
    slug: 'handcrafted-terracotta-painted-diyas-set-of-12',
    categoryId: 'cat-2',
    categoryName: 'Diyas & Lamps',
    price: 499,
    originalPrice: 799,
    discountPercent: 38,
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 45,
    sku: 'DIY-TER-012',
    shortDescription: 'Vibrant hand-painted clay diyas with gold zari detailing, crafted by rural potters.',
    description: 'Celebrate the Festival of Lights with these exquisite handmade terracotta diyas. Each diya is lovingly molded from pure river clay, sun-dried, kiln-fired, and decorated with natural acrylic paints and intricate gold zari borders. Perfect for home entryways, verandas, and puja altars.',
    specifications: {
      'Material': '100% Natural River Clay (Terracotta)',
      'Dimensions': '6 cm diameter each',
      'Pieces': '12 Diyas per box',
      'Origin': 'Kolkata Artisans, India',
      'Care': 'Wipe gently with dry cloth; reusable year after year',
      'Safety': 'Non-toxic, 100% biodegradable and eco-friendly'
    },
    images: [
      'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Diwali', 'Handmade', 'Terracotta', 'Eco-friendly', 'Traditional'],
    variants: [
      { name: 'Set Size', options: ['Box of 12 Diyas', 'Box of 24 Diyas (+ ₹350)', 'Box of 50 Diyas (+ ₹900)'] }
    ],
    artisanInfo: 'Crafted under fair-trade principles by the Kumortuli Potters Guild in West Bengal.',
    safetyCompliance: '100% Non-hazardous, safe for all household festive rituals.'
  },
  {
    id: 'prod-2',
    title: 'Pure Brass Akhand Jyoti Diya with Glass Chimney',
    slug: 'pure-brass-akhand-jyoti-diya-with-glass-chimney',
    categoryId: 'cat-2',
    categoryName: 'Diyas & Lamps',
    price: 1299,
    originalPrice: 1899,
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 30,
    sku: 'DIY-BRS-AKH',
    shortDescription: 'Solid brass perpetual diya with heat-resistant borosilicate glass cover.',
    description: 'A sacred Akhand Jyoti Diya engineered from heavy-gauge virgin brass with a crystal-clear borosilicate glass cover. The wind-proof glass chimney ensures your auspicious flame remains steady and calm for over 24 hours during Navratri, Diwali, and daily temple prayers.',
    specifications: {
      'Material': 'Pure Heavy Brass & Borosilicate Glass',
      'Height': '16.5 cm',
      'Weight': '420 grams',
      'Burn Time': 'Up to 28 hours on full reservoir',
      'Included': '1 Brass Diya, 1 Glass Shield, 10 Cotton Wicks'
    },
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Brass', 'Akhand Jyoti', 'Temple', 'Pooja', 'Puja'],
    variants: [
      { name: 'Finish', options: ['Antique Golden Brass', 'Mirror Gloss Gold'] }
    ],
    artisanInfo: 'Turned and hand-engraved by brass masters in Moradabad, Uttar Pradesh.',
    safetyCompliance: 'UL tested thermal glass; safe and enclosed flame design.'
  },
  {
    id: 'prod-3',
    title: 'Royal Brass 8-Piece Pūjā Thali Deluxe Set',
    slug: 'royal-brass-8-piece-puja-thali-deluxe-set',
    categoryId: 'cat-4',
    categoryName: 'Pujā/Religious Accessories',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 29,
    rating: 5.0,
    reviewCount: 84,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 18,
    sku: 'PUJ-THL-008',
    shortDescription: 'Traditional embossed peacock pooja thali with bell, diya, agarbatti stand, and bowls.',
    description: 'This grand 8-piece Puja Thali set transforms your festive prayer rituals into a royal experience. Features an intricately embossed Mayur (Peacock) central plate, accompanied by a heavy brass ghanti (bell), Panchamrit cup, Achamani spoon, Agarbatti stand, Diya, and dual Roli-Chawal vatis.',
    specifications: {
      'Material': 'High-purity Cast Brass with Lacquer coating',
      'Thali Diameter': '11.5 inches (29 cm)',
      'Items in Set': 'Thali, Bell, Diya, Agarbatti Holder, Kalash, Spoon, 2 Vatis',
      'Weight': '980 grams total'
    },
    images: [
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Puja Thali', 'Brass', 'Pooja Set', 'Festive Gift', 'Spiritual'],
    variants: [
      { name: 'Engraving Style', options: ['Peacock Motif', 'Gayatri Mantra Inscribed'] }
    ],
    artisanInfo: 'Cast and finished in the historic metal workshops of Aligarh.',
    safetyCompliance: 'Food-safe lead-free brass alloy suitable for prasad.'
  },
  {
    id: 'prod-4',
    title: 'Warm Golden LED Fairy Curtain Lights (10x10 ft)',
    slug: 'warm-golden-led-fairy-curtain-lights-10x10-ft',
    categoryId: 'cat-5',
    categoryName: 'Decorative Lights',
    price: 899,
    originalPrice: 1499,
    discountPercent: 40,
    rating: 4.7,
    reviewCount: 215,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 60,
    sku: 'LGT-CUR-300',
    shortDescription: '300 Warm white festive micro-LEDs with 8 flashing modes and remote controller.',
    description: 'Infuse your living room, balcony, or festive backdrop with an ethereal glow. 300 ultra-bright warm amber micro-LED bulbs arranged along 10 hanging strands. Includes 8 distinct illumination modes (Waves, Chasing, Slow Glow, Twinkle, Steady On) and an energy-efficient low-voltage adapter.',
    specifications: {
      'LED Count': '300 LEDs (10 strands x 30 LEDs)',
      'Dimensions': '10 ft width x 10 ft drop length',
      'Color Temperature': '2700K Warm Golden Amber',
      'Power Source': 'BIS-certified 2-pin Indian plug (Low 5V)',
      'Waterproof Rating': 'IP44 Weather-resistant'
    },
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Fairy Lights', 'LED', 'Festive Decor', 'Curtain Lights', 'Diwali Lights'],
    variants: [
      { name: 'Length', options: ['10x10 ft (300 LEDs)', '10x6 ft (200 LEDs)'] }
    ],
    safetyCompliance: 'BIS Approved cool-to-touch LEDs; safe for draperies and indoor celebration.'
  },
  {
    id: 'prod-5',
    title: 'Artisan Marigold & Mango Leaves Door Toran (3.5 ft)',
    slug: 'artisan-marigold-and-mango-leaves-door-toran',
    categoryId: 'cat-1',
    categoryName: 'Festival Decorations',
    price: 649,
    originalPrice: 999,
    discountPercent: 35,
    rating: 4.9,
    reviewCount: 76,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 40,
    sku: 'DEC-TRN-035',
    shortDescription: 'Vibrant artificial Genda Phool garland with gold brass jhumki bells for main door.',
    description: 'Welcome prosperity, auspiciousness, and joy into your sanctuary. Handcrafted with plush silk-blend marigold blossoms in auspicious saffron and lemon yellow, combined with lifelike green mango leaves and miniature melodious tinkling brass bells along the border.',
    specifications: {
      'Length': '42 inches / 3.5 feet (Fits standard door frames)',
      'Material': 'Silk organza, golden beads, mini brass ghunghroos',
      'Washable': 'Gentle rinse in cold water; lasts for years',
      'Mounting': 'Built-in sturdy loops for instant hanging'
    },
    images: [
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Toran', 'Marigold', 'Door Hanging', 'Diwali Decor', 'Auspicious'],
    variants: [
      { name: 'Design', options: ['Classic Yellow & Orange', 'Royal Crimson & Gold'] }
    ],
    artisanInfo: 'Hand-strung by women artisan collectives in Rajasthan.',
    safetyCompliance: '100% Non-combustible treated textiles; non-hazardous decoration.'
  },
  {
    id: 'prod-6',
    title: 'Shahi Khazana Festive Dry Fruits & Sweet Delights Hamper',
    slug: 'shahi-khazana-festive-dry-fruits-and-sweet-delights-hamper',
    categoryId: 'cat-3',
    categoryName: 'Gift Items',
    price: 1899,
    originalPrice: 2599,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 164,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 25,
    sku: 'GFT-HMP-ROY',
    shortDescription: 'Luxury velvet gift box with premium roasted almonds, cashews, pistachios, and saffron.',
    description: 'The ultimate royal presentation for family, friends, and corporate festival gifting. Packaged inside a keepsake velvet-lined royal maroon gift box with gold foil embossing. Contains jumbo California roasted almonds (200g), Mangalore cashews (200g), Iranian salted pistachios (200g), and Kashmiri Mogra Saffron (1g vial).',
    specifications: {
      'Total Weight': '600g Dry Fruits + 1g Pure Saffron',
      'Packaging': 'Reusable Regal Velvet Embroidered Chest Box',
      'Shelf Life': '6 Months from packaging',
      'FSSAI Certified': '100% Vegetarian and certified organic'
    },
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Gift Hamper', 'Dry Fruits', 'Corporate Gift', 'Saffron', 'Luxury'],
    variants: [
      { name: 'Hamper Size', options: ['Grand Deluxe (600g)', 'Imperial Royal (1.2 kg) (+ ₹1200)'] }
    ],
    safetyCompliance: 'FSSAI certified, food-grade airtight vacuum sealed jars.'
  },
  {
    id: 'prod-7',
    title: 'Organic Herbal Rangoli Colors & Stencils Kit (8 Colors)',
    slug: 'organic-herbal-rangoli-colors-and-stencils-kit',
    categoryId: 'cat-6',
    categoryName: 'Party Supplies',
    price: 399,
    originalPrice: 599,
    discountPercent: 33,
    rating: 4.8,
    reviewCount: 112,
    isFeatured: false,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 55,
    sku: 'PTY-RNG-008',
    shortDescription: 'Skin-friendly cornstarch rangoli powders made with natural turmeric, beetroot, and floral extracts.',
    description: 'Adorn your threshold with breathtaking floor art without worrying about chemicals or skin irritation. 8 vibrant, free-flowing rangoli shades formulated from edible maize starch and flower powders. Includes 4 precision laser-cut reusable acrylic stencils (Lotus, Diya, Mandala, Peacock).',
    specifications: {
      'Colors': 'Red, Turmeric Yellow, Emerald Green, Indigo Blue, Orange, Pink, White, Purple (100g each)',
      'Total Weight': '800g',
      'Stencils': '4 Durable 8-inch Acrylic Stencils',
      'Skin Safety': 'Dermatologically tested, completely non-toxic'
    },
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Rangoli', 'Eco-friendly', 'Herbal', 'Stencils', 'Festival Supplies'],
    safetyCompliance: '100% Non-hazardous natural mineral and plant powders; completely chemical-free.'
  },
  {
    id: 'prod-8',
    title: 'Hand-Etched Moroccan Brass Hanging Lantern',
    slug: 'hand-etched-moroccan-brass-hanging-lantern',
    categoryId: 'cat-5',
    categoryName: 'Decorative Lights',
    price: 1499,
    originalPrice: 2199,
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 63,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 22,
    sku: 'LGT-LNT-MOR',
    shortDescription: 'Vintage brass filigree lantern casting mesmerizing geometric light shadows.',
    description: 'An architectural centerpiece for evening celebrations. Hand-perforated with hundreds of tiny pinhole motifs that cast intricate celestial shadows across your walls and ceilings. Accommodates either traditional wax tealights, LED candle lights, or small electric bulbs.',
    specifications: {
      'Material': 'Antique finish Brass-plated Iron',
      'Height': '14 inches (35 cm)',
      'Diameter': '6.5 inches',
      'Hanging Chain': '18-inch matching antique chain included'
    },
    images: [
      'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Lantern', 'Moroccan', 'Ambient Lighting', 'Brass Lantern', 'Balcony Decor'],
    variants: [
      { name: 'Size', options: ['Medium 14-inch', 'Large 18-inch (+ ₹600)'] }
    ],
    safetyCompliance: 'Safe ventilated roof design prevent heat trapping.'
  },
  {
    id: 'prod-9',
    title: 'Sacred Sandalwood & Camphor Aromatic Dhoop Gift Box',
    slug: 'sacred-sandalwood-and-camphor-aromatic-dhoop-gift-box',
    categoryId: 'cat-4',
    categoryName: 'Pujā/Religious Accessories',
    price: 549,
    originalPrice: 799,
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 94,
    isFeatured: false,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 38,
    sku: 'PUJ-DHP-SND',
    shortDescription: 'Charcoal-free pure cow dung, sandalwood, and bhimseni camphor herbal dhoop cones.',
    description: 'Purify your home environment with the divine aroma of authentic temple incense. 100% charcoal-free and sulfur-free cones handcrafted from sacred temple flowers, natural Mysore sandalwood, and certified pure Bhimseni camphor. Leaves a tranquil, lingering peaceful energy.',
    specifications: {
      'Cones Count': '60 Dhoop Cones in luxury tin',
      'Burn Time': '35-40 minutes per cone',
      'Holder': 'Ceramic miniature lotus stand included',
      'Zero Charcoal': 'Produces smooth, clean, therapeutic aroma'
    },
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Dhoop', 'Sandalwood', 'Camphor', 'Incense', 'Organic Puja'],
    safetyCompliance: '100% Charcoal-free; non-toxic natural aromatherapeutic formulation.'
  },
  {
    id: 'prod-10',
    title: 'Traditional Handcrafted Brass Urli Bowl (12 inch)',
    slug: 'traditional-handcrafted-brass-urli-bowl-12-inch',
    categoryId: 'cat-1',
    categoryName: 'Festival Decorations',
    price: 1999,
    originalPrice: 2899,
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 88,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockQuantity: 15,
    sku: 'DEC-URL-012',
    shortDescription: 'Stunning centerpiece bowl with floral handles for floating flowers and tea lights.',
    description: 'An auspicious focal point for your foyer or drawing room. Hand-hammered from solid brass with ornate floral handles and a lustrous golden gleam. Fill with fresh water, fresh rose and marigold petals, and floating diyas to welcome goddess Lakshmi and guests.',
    specifications: {
      'Material': 'Solid Brass with anti-tarnish protective seal',
      'Diameter': '12 inches (30 cm)',
      'Weight': '1.35 kg',
      'Free Gift': 'Comes with 6 floating soy-wax scented tealights'
    },
    images: [
      'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Urli', 'Brass Bowl', 'Floating Diyas', 'Home Decor', 'Festive Focal'],
    variants: [
      { name: 'Finish', options: ['Golden Brass', 'Antique Patina Bronze'] }
    ],
    artisanInfo: 'Hammered by 4th-generation metal craftspeople in Thanjavur, Tamil Nadu.',
    safetyCompliance: '100% Non-hazardous solid metal craft.'
  },
  {
    id: 'prod-11',
    title: 'Eco-Friendly Paper Kandeel Lanterns (Pack of 3)',
    slug: 'eco-friendly-paper-kandeel-lanterns-pack-of-3',
    categoryId: 'cat-6',
    categoryName: 'Party Supplies',
    price: 449,
    originalPrice: 699,
    discountPercent: 36,
    rating: 4.7,
    reviewCount: 52,
    isFeatured: false,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 42,
    sku: 'PTY-KND-003',
    shortDescription: 'Foldable geometric traditional paper lanterns with metallic tassel streamers.',
    description: 'Embrace traditional festive nostalgia with modern eco-responsibility. These vibrant Akash Kandil lanterns are constructed from sturdy recycled craft paper with kaleidoscopic cutouts and shimmering metallic ribbons. Folds flat for effortless storage and reusability every season.',
    specifications: {
      'Quantity': 'Set of 3 distinct color combinations',
      'Folded Dimensions': '30 cm x 30 cm flat',
      'Unfolded Height': '65 cm including tassels',
      'Compatibility': 'Pre-fitted frame for LED bulbs or fairy light strands'
    },
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Kandeel', 'Akash Kandil', 'Paper Lantern', 'Eco-friendly', 'Celebration Supplies'],
    safetyCompliance: 'Flame-retardant tested craft paper; safe for electrical string lights.'
  },
  {
    id: 'prod-12',
    title: 'Silver-Plated Ganesha & Lakshmi Auspicious Coin Set',
    slug: 'silver-plated-ganesha-and-lakshmi-auspicious-coin-set',
    categoryId: 'cat-3',
    categoryName: 'Gift Items',
    price: 999,
    originalPrice: 1499,
    discountPercent: 33,
    rating: 4.9,
    reviewCount: 130,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockQuantity: 35,
    sku: 'GFT-COI-SIL',
    shortDescription: '999 Pure silver plated 20g commemorative medallions in a clear acrylic airtight capsule.',
    description: 'A deeply revered gifting token symbolizing health, wealth, and spiritual wisdom. Deeply embossed with idols of Lord Ganesha and Goddess Lakshmi on front and the sacred Shree Yantra on the reverse. Presented in a luxurious silk-lined velvet case.',
    specifications: {
      'Purity': '999 Pure Silver electroplating on high-density copper core',
      'Weight': '20 grams total (10g each)',
      'Diameter': '32 mm',
      'Box': 'Burgundy velvet presentation jewel case'
    },
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['Silver Coins', 'Ganesha', 'Lakshmi', 'Diwali Gifting', 'Shree Yantra'],
    safetyCompliance: 'Non-hazardous commemorative religious craft collectible.'
  }
];

// -------------------------------------------------------------
// SEED DATA: REVIEWS
// -------------------------------------------------------------
export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'cust-1',
    userName: 'Pooja Sharma',
    rating: 5,
    title: 'Exquisite craftsmanship and vibrant colors!',
    comment: 'The painted terracotta diyas arrived in pristine condition, securely cushioned. The gold zari detailing glitters wonderfully under oil lamps. Loved that it supports local artisans!',
    verifiedPurchase: true,
    createdAt: '2026-08-25T14:22:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'cust-2',
    userName: 'Vikram Mehta',
    rating: 5,
    title: 'Authentic and eco-friendly celebration',
    comment: 'No toxic chemicals or odors. They burned steadily throughout Diwali night. Ordering another pack of 24 for Bhai Dooj.',
    verifiedPurchase: true,
    createdAt: '2026-08-29T09:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userId: 'cust-3',
    userName: 'Ananya Iyer',
    rating: 5,
    title: 'Best Akhand Diya ever bought',
    comment: 'The glass chimney fits snugly and stops wind drafts completely. Burned for 26 hours without flickering. The brass is pure and heavy.',
    verifiedPurchase: true,
    createdAt: '2026-09-01T18:40:00Z'
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    userId: 'cust-4',
    userName: 'Rajesh Singhania',
    rating: 5,
    title: 'Spectacular warm ambience on our balcony',
    comment: 'The 300 LEDs are bright yet pleasantly warm, not harsh white. The 8 light modes are easy to cycle with the remote. Excellent quality wire.',
    verifiedPurchase: true,
    createdAt: '2026-09-02T11:05:00Z'
  }
];

// -------------------------------------------------------------
// SEED DATA: COUPONS
// -------------------------------------------------------------
export const initialCoupons: Coupon[] = [
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 999,
    description: '20% discount on orders above ₹999'
  },
  {
    code: 'UTSAV500',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 2499,
    description: 'Flat ₹500 off on festive orders above ₹2499'
  },
  {
    code: 'DIWALI10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 499,
    description: '10% celebratory discount on all items'
  }
];

// -------------------------------------------------------------
// SEED USERS (Admin and Verified Customer)
// -------------------------------------------------------------
export const initialUsers: (User & { passwordHash: string })[] = [
  {
    id: 'usr-admin-1',
    name: 'Utsav Admin',
    email: 'admin@utsavveda.com',
    role: 'admin',
    phone: '+91 98765 43210',
    passwordHash: hashPassword('Admin@12345'),
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'Utsav Admin Office',
        addressLine1: 'Utsav Veda Heritage House, MG Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302001',
        country: 'India',
        phone: '+91 98765 43210',
        isDefault: true
      }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-cust-1',
    name: 'Aarav Patel',
    email: 'customer@utsavveda.com',
    role: 'customer',
    phone: '+91 91234 56789',
    passwordHash: hashPassword('Customer@12345'),
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Aarav Patel',
        addressLine1: 'Flat 402, Lotus Residency, Satellite Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380015',
        country: 'India',
        phone: '+91 91234 56789',
        isDefault: true
      }
    ],
    createdAt: '2026-07-15T10:30:00Z'
  }
];

// -------------------------------------------------------------
// SEED ORDERS
// -------------------------------------------------------------
export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'UTSAV-839210',
    userId: 'usr-cust-1',
    customerName: 'Aarav Patel',
    customerEmail: 'customer@utsavveda.com',
    customerPhone: '+91 91234 56789',
    items: [
      {
        productId: 'prod-1',
        title: 'Handcrafted Terracotta Painted Diyas (Set of 12)',
        price: 499,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=400&q=80',
        selectedVariant: 'Box of 12 Diyas'
      },
      {
        productId: 'prod-4',
        title: 'Warm Golden LED Fairy Curtain Lights (10x10 ft)',
        price: 899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80'
      }
    ],
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Aarav Patel',
      addressLine1: 'Flat 402, Lotus Residency, Satellite Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      country: 'India',
      phone: '+91 91234 56789'
    },
    subtotal: 1897,
    discount: 379.4,
    couponCode: 'FESTIVE20',
    shippingFee: 0,
    total: 1517.6,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'DEL-EXP-992813',
    estimatedDelivery: '2026-09-10',
    createdAt: '2026-09-04T12:00:00Z',
    updatedAt: '2026-09-05T08:30:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'UTSAV-551029',
    userId: 'usr-cust-1',
    customerName: 'Aarav Patel',
    customerEmail: 'customer@utsavveda.com',
    customerPhone: '+91 91234 56789',
    items: [
      {
        productId: 'prod-3',
        title: 'Royal Brass 8-Piece Pūjā Thali Deluxe Set',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
        selectedVariant: 'Peacock Motif'
      }
    ],
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Aarav Patel',
      addressLine1: 'Flat 402, Lotus Residency, Satellite Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      country: 'India',
      phone: '+91 91234 56789'
    },
    subtotal: 2499,
    discount: 500,
    couponCode: 'UTSAV500',
    shippingFee: 0,
    total: 1999,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'BLUEDART-882190',
    estimatedDelivery: '2026-09-03',
    createdAt: '2026-08-28T16:15:00Z',
    updatedAt: '2026-09-03T14:20:00Z'
  }
];

// In-Memory Database Store
class Database {
  private categories: Category[] = [...initialCategories];
  private products: Product[] = [...initialProducts];
  private users: (User & { passwordHash: string })[] = [...initialUsers];
  private orders: Order[] = [...initialOrders];
  private reviews: Review[] = [...initialReviews];
  private coupons: Coupon[] = [...initialCoupons];
  private contactMessages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Sneha Kapoor',
      email: 'sneha@example.com',
      phone: '+91 98989 12345',
      subject: 'Bulk order inquiry for Diwali gift hampers',
      message: 'Hello, our corporate office wants to order 80 units of the Shahi Khazana Dry Fruit gift hampers. Could you provide a customized corporate greeting sleeve?',
      createdAt: '2026-09-05T10:15:00Z',
      status: 'new'
    }
  ];
  private newsletterSubscribers: Set<string> = new Set(['welcome@utsavveda.com', 'festiveseason@example.com']);

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  // Products
  getProducts(filters?: {
    categorySlug?: string;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStockOnly?: boolean;
    sort?: 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
    limit?: number;
    offset?: number;
  }): { products: Product[]; total: number } {
    let result = [...this.products];

    if (filters?.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.categorySlug) {
      const cat = this.categories.find(c => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      }
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.categoryName.toLowerCase().includes(query)
      );
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters?.rating !== undefined) {
      result = result.filter(p => p.rating >= filters.rating!);
    }
    if (filters?.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sorting
    switch (filters?.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    const total = result.length;
    if (filters?.offset !== undefined || filters?.limit !== undefined) {
      const offset = filters.offset || 0;
      const limit = filters.limit || 12;
      result = result.slice(offset, offset + limit);
    }

    return { products: result, total };
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  createProduct(productData: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id };
    this.products.unshift(newProduct);
    // update category count
    const cat = this.categories.find(c => c.id === newProduct.categoryId);
    if (cat) cat.itemCount += 1;
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    const catId = this.products[index].categoryId;
    this.products.splice(index, 1);
    const cat = this.categories.find(c => c.id === catId);
    if (cat && cat.itemCount > 0) cat.itemCount -= 1;
    return true;
  }

  // Users & Auth
  findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  createUser(userData: { name: string; email: string; password: string; phone?: string }): User {
    const id = `usr-${Date.now()}`;
    const newUser: User & { passwordHash: string } = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: 'customer',
      phone: userData.phone,
      passwordHash: hashPassword(userData.password),
      addresses: [],
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = this.users[index];
    return safeUser;
  }

  getAllUsers(): User[] {
    return this.users.map(({ passwordHash, ...u }) => u);
  }

  // Orders
  getOrders(userId?: string): Order[] {
    if (userId) {
      return this.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const id = `ord-${Date.now()}`;
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();
    const trackingNumber = `TRK-UTS-${Math.floor(100000 + Math.random() * 900000)}`;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 4);

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      trackingNumber,
      estimatedDelivery: estimatedDate.toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now
    };

    this.orders.unshift(newOrder);

    // Deduct inventory
    for (const item of newOrder.items) {
      const prod = this.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        prod.inStock = prod.stockQuantity > 0;
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, orderStatus: Order['orderStatus']): Order | undefined {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return undefined;
    order.orderStatus = orderStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // Reviews
  getReviews(productId: string): Review[] {
    return this.reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const id = `rev-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newReview);

    // Recalculate product rating
    const prodReviews = this.reviews.filter(r => r.productId === reviewData.productId);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.products.find(p => p.id === reviewData.productId);
    if (prod) {
      prod.rating = Number(avgRating.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    return newReview;
  }

  // Coupons
  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; message: string; discountAmount: number } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return { valid: false, message: 'Invalid promo code. Try FESTIVE20 or UTSAV500.', discountAmount: 0 };
    }
    if (subtotal < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of ₹${coupon.minSpend} required for this coupon.`, discountAmount: 0 };
    }
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }
    return { valid: true, coupon, message: `Coupon applied: ${coupon.description}`, discountAmount };
  }

  // Contact Messages
  createContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.contactMessages.unshift(newMsg);
    return newMsg;
  }

  getContactMessages(): ContactMessage[] {
    return this.contactMessages;
  }

  // Newsletter
  subscribeNewsletter(email: string): { success: boolean; message: string } {
    const cleanEmail = email.toLowerCase().trim();
    if (this.newsletterSubscribers.has(cleanEmail)) {
      return { success: true, message: 'You are already subscribed to our festive updates!' };
    }
    this.newsletterSubscribers.add(cleanEmail);
    return { success: true, message: 'Thank you for subscribing! Enjoy 10% off your first festive order with code DIWALI10.' };
  }

  // Admin KPIs
  getAdminStats(): AdminStats {
    const totalSales = this.orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
    const totalOrders = this.orders.length;
    const totalCustomers = this.users.filter(u => u.role === 'customer').length;
    const totalProducts = this.products.length;
    const pendingOrders = this.orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;

    // Simulated sales by past 7 days
    const salesByDay = [
      { date: 'Mon', amount: 12500 },
      { date: 'Tue', amount: 18400 },
      { date: 'Wed', amount: 15200 },
      { date: 'Thu', amount: 24800 },
      { date: 'Fri', amount: 32000 },
      { date: 'Sat', amount: 48500 },
      { date: 'Sun', amount: 56200 },
    ];

    return {
      totalSales: Math.round(totalSales),
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      recentOrders: this.orders.slice(0, 5),
      salesByDay
    };
  }
}

export const db = new Database();
