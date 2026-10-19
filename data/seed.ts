// 20 Users, 10 Sellers, and 100 Listings across all campus categories

export interface DbUser {
  id: string
  name: string
  email: string
  studentId?: string
  department?: string
  faculty?: string
  phone: string
  role: 'USER' | 'ADMIN'
  isBupVerified: boolean
  isSeller: boolean
  avatarUrl?: string
  createdAt: string
}

export interface DbSellerProfile {
  id: string
  userId: string
  storeName: string
  bio: string
  phone: string
  pickupLocation: string
  payoutMethod: 'bkash' | 'nagad'
  payoutNumber: string
  rating: number
  totalSales: number
  balance: number
  isTrusted: boolean
  createdAt: string
}

export interface DbListing {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  condition: 'NEW' | 'USED_LIKE_NEW' | 'USED_GOOD'
  stock: number
  category: string
  sellerId: string
  sellerStoreName: string
  sellerPickup: string
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'DRAFT'
  viewsCount: number
  isBoosted: boolean
  deliveryTime: string
  pickupOption: string
  rating: number
  reviewsCount: number
  createdAt: string
}

export interface DbOrderItem {
  id: string
  orderId: string
  listingId: string
  listingTitle: string
  listingImage: string
  sellerId: string
  sellerStoreName: string
  price: number
  quantity: number
  status: 'CONFIRMED' | 'PACKED' | 'READY' | 'DELIVERED' | 'CANCELLED'
  cancellationReason?: string
  pickupLocation: string
  createdAt: string
}

export interface DbOrder {
  id: string
  buyerId: string
  buyerName: string
  buyerPhone: string
  items: DbOrderItem[]
  totalAmount: number
  paymentMethod: 'bkash' | 'nagad' | 'cod'
  deliveryLocation: string
  createdAt: string
}

export interface DbReview {
  id: string
  orderItemId: string
  buyerId: string
  buyerName: string
  sellerId: string
  listingId: string
  rating: number
  comment: string
  createdAt: string
}

export interface DbMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  isRead: boolean
  createdAt: string
}

export interface DbConversation {
  id: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  listingId?: string
  listingTitle?: string
  listingPrice?: number
  listingImage?: string
  updatedAt: string
  messages: DbMessage[]
}

export interface DbPayout {
  id: string
  sellerId: string
  amount: number
  commission: number
  netAmount: number
  method: 'bkash' | 'nagad'
  accountNumber: string
  status: 'PENDING' | 'COMPLETED'
  createdAt: string
}

export interface DbReport {
  id: string
  reporterId: string
  reporterName: string
  targetType: 'LISTING' | 'USER'
  targetId: string
  reason: string
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  createdAt: string
}

// 20 SEEDED USERS
export const SEED_USERS: DbUser[] = [
  {
    id: 'user-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir.22041108@bup.edu.bd',
    studentId: '22041108',
    department: 'ICE',
    faculty: 'FST',
    phone: '+880 1711 234567',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Dr. Sabrina Rahman',
    email: 's.rahman@bup.edu.bd',
    studentId: 'BUP-FAC-102',
    department: 'Marketing',
    faculty: 'FBS',
    phone: '+880 1819 876543',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-11T10:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Central Canteen Head Chef',
    email: 'canteen@bup.edu.bd',
    studentId: 'BUP-VENDOR-01',
    department: 'Campus Welfare',
    faculty: 'Administration',
    phone: '+880 1712 998877',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'user-4',
    name: 'BUP Alumni Welfare Club',
    email: 'alumni.club@bup.edu.bd',
    studentId: 'BUP-CLUB-01',
    department: 'Student Affairs',
    faculty: 'University Wide',
    phone: '+880 1755 443322',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'user-5',
    name: 'Nabil Hasan (Robotics)',
    email: 'nabil.21041120@bup.edu.bd',
    studentId: '21041120',
    department: 'CSE',
    faculty: 'FST',
    phone: '+880 1911 334455',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-6',
    name: 'Lake Promenade Cafe',
    email: 'lakepavilion@gmail.com',
    studentId: 'BUP-VENDOR-02',
    department: 'Food Court',
    faculty: 'Lakeside Concourse',
    phone: '+880 1622 778899',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'user-7',
    name: 'Sadman Sakib (BCC Case Lead)',
    email: 'sadman.21051011@bup.edu.bd',
    studentId: '21051011',
    department: 'BBA Finance',
    faculty: 'FBS',
    phone: '+880 1733 990011',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-17T10:00:00Z',
  },
  {
    id: 'user-8',
    name: 'BUP Cultural Crafts Corner',
    email: 'cultural.crafts@bup.edu.bd',
    studentId: 'BUP-CLUB-08',
    department: 'Cultural Forum',
    faculty: 'FASS',
    phone: '+880 1844 556677',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'user-9',
    name: 'Campus Print & Plot Hub',
    email: 'printmaster.bup@gmail.com',
    studentId: 'BUP-VENDOR-05',
    department: 'Library Plaza',
    faculty: 'Central Facility',
    phone: '+880 1922 445566',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-19T10:00:00Z',
  },
  {
    id: 'user-10',
    name: 'BUP Sports Syndicate',
    email: 'sports.club@bup.edu.bd',
    studentId: 'BUP-CLUB-04',
    department: 'Physical Education',
    faculty: 'Central Field',
    phone: '+880 1766 889900',
    role: 'USER',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-20T10:00:00Z',
  },
  // Buyers & Admin
  {
    id: 'user-11',
    name: 'Zareen Subah',
    email: 'zareen.23041005@bup.edu.bd',
    studentId: '23041005',
    department: 'Economics',
    faculty: 'FASS',
    phone: '+880 1777 112233',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-12',
    name: 'Farhan Kabir',
    email: 'farhan.22051144@bup.edu.bd',
    studentId: '22051144',
    department: 'Marketing',
    faculty: 'FBS',
    phone: '+880 1888 223344',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 'user-13',
    name: 'Kazi Murshed (Mirpur DOHS)',
    email: 'murshed.mirpur@gmail.com',
    phone: '+880 1912 345678',
    role: 'USER',
    isBupVerified: false,
    isSeller: false,
    createdAt: '2026-02-03T10:00:00Z',
  },
  {
    id: 'user-14',
    name: 'Shamim Osman',
    email: 'shamim.23041288@bup.edu.bd',
    studentId: '23041288',
    department: 'CSE',
    faculty: 'FST',
    phone: '+880 1799 334455',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-04T10:00:00Z',
  },
  {
    id: 'user-15',
    name: 'Nusrat Jahan',
    email: 'nusrat.22011033@bup.edu.bd',
    studentId: '22011033',
    department: 'IR',
    faculty: 'FSSS',
    phone: '+880 1811 445566',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'user-16',
    name: 'Major Rafiqul Islam (Faculty)',
    email: 'rafiqul@bup.edu.bd',
    studentId: 'BUP-FAC-205',
    department: 'Strategic Studies',
    faculty: 'FSSS',
    phone: '+880 1711 990088',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-06T10:00:00Z',
  },
  {
    id: 'user-17',
    name: 'Anika Tabassum',
    email: 'anika.24041112@bup.edu.bd',
    studentId: '24041112',
    department: 'Environmental Science',
    faculty: 'FST',
    phone: '+880 1633 556677',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-07T10:00:00Z',
  },
  {
    id: 'user-18',
    name: 'Saif Chowdhury',
    email: 'saif.21041199@bup.edu.bd',
    studentId: '21041199',
    department: 'ICE',
    faculty: 'FST',
    phone: '+880 1722 667788',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-08T10:00:00Z',
  },
  {
    id: 'user-19',
    name: 'Ayesha Siddika',
    email: 'ayesha.22051080@bup.edu.bd',
    studentId: '22051080',
    department: 'Accounting',
    faculty: 'FBS',
    phone: '+880 1833 778899',
    role: 'USER',
    isBupVerified: true,
    isSeller: false,
    createdAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'user-20',
    name: 'BUP Marketplace Admin',
    email: 'admin.marketplace@bup.edu.bd',
    studentId: 'BUP-ADMIN-01',
    department: 'IT Directorate',
    faculty: 'Administration',
    phone: '+880 1700 000001',
    role: 'ADMIN',
    isBupVerified: true,
    isSeller: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
]

// 10 SELLER PROFILES
export const SEED_SELLER_PROFILES: DbSellerProfile[] = [
  {
    id: 'seller-1',
    userId: 'user-1',
    storeName: 'Tanvir Engineering & Notes Vault',
    bio: 'FST ICE senior offering pristine engineering textbooks, solved midterms & verified exam notes.',
    phone: '+880 1711 234567',
    pickupLocation: 'Faculty of Science & Technology (FST) Ground Floor Lobby',
    payoutMethod: 'bkash',
    payoutNumber: '01711234567',
    rating: 4.9,
    totalSales: 154,
    balance: 8450,
    isTrusted: true,
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'seller-2',
    userId: 'user-2',
    storeName: 'Dr. Sabrina Faculty Academic Books',
    bio: 'FBS recommended management textbooks, marketing research monographs, and case solutions.',
    phone: '+880 1819 876543',
    pickupLocation: 'Faculty of Business Studies (FBS) Faculty Lounge 3rd Floor',
    payoutMethod: 'bkash',
    payoutNumber: '01819876543',
    rating: 5.0,
    totalSales: 88,
    balance: 5200,
    isTrusted: true,
    createdAt: '2026-01-11T12:00:00Z',
  },
  {
    id: 'seller-3',
    userId: 'user-3',
    storeName: 'BUP Central Canteen Express',
    bio: 'Official Mirpur Cantonment campus canteen. Fresh hot khichuri, fried Ilish fish, and meal pre-orders.',
    phone: '+880 1712 998877',
    pickupLocation: 'Central Canteen Counter #2 (Express Pickup)',
    payoutMethod: 'nagad',
    payoutNumber: '01712998877',
    rating: 4.8,
    totalSales: 890,
    balance: 24300,
    isTrusted: true,
    createdAt: '2026-01-12T12:00:00Z',
  },
  {
    id: 'seller-4',
    userId: 'user-4',
    storeName: 'BUP Official Varsity Regalia',
    bio: 'Official varsity merchandise: heavyweight winter hoodies, ties, badges, journals, and graduation regalia.',
    phone: '+880 1755 443322',
    pickupLocation: 'BUP Central Information & Alumni Booth (Gate 1)',
    payoutMethod: 'bkash',
    payoutNumber: '01755443322',
    rating: 4.9,
    totalSales: 620,
    balance: 41200,
    isTrusted: true,
    createdAt: '2026-01-14T12:00:00Z',
  },
  {
    id: 'seller-5',
    userId: 'user-5',
    storeName: 'BUP Robotics & Tech Syndicate',
    bio: 'Approved scientific calculators, sensors, microcontrollers, and low-latency library earbuds.',
    phone: '+880 1911 334455',
    pickupLocation: 'FST Hardware Robotics Lab (Room 402)',
    payoutMethod: 'bkash',
    payoutNumber: '01911334455',
    rating: 4.8,
    totalSales: 132,
    balance: 9150,
    isTrusted: true,
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'seller-6',
    userId: 'user-6',
    storeName: 'Lake Promenade Brew & Bakery',
    bio: 'Slow steeped 16hr cold brew, cinnamon rolls, artisan brownies, and waterfront sunset snacks.',
    phone: '+880 1622 778899',
    pickupLocation: 'Central Lake Boardwalk Deck Stall #1',
    payoutMethod: 'nagad',
    payoutNumber: '01622778899',
    rating: 4.9,
    totalSales: 410,
    balance: 11800,
    isTrusted: true,
    createdAt: '2026-01-16T12:00:00Z',
  },
  {
    id: 'seller-7',
    userId: 'user-7',
    storeName: 'BCC Case Study & Career Hub',
    bio: 'HBR business cases, interview prep binders, presentation templates, and corporate grooming items.',
    phone: '+880 1733 990011',
    pickupLocation: 'FBS Career Club Room (West Concourse)',
    payoutMethod: 'bkash',
    payoutNumber: '01733990011',
    rating: 4.7,
    totalSales: 94,
    balance: 4300,
    isTrusted: true,
    createdAt: '2026-01-17T12:00:00Z',
  },
  {
    id: 'seller-8',
    userId: 'user-8',
    storeName: 'BUP Artisan Crafts & Gifts',
    bio: 'Leatherbound custom notebooks, brass metal bookmarks, engraved pens, and handmade campus souvenirs.',
    phone: '+880 1844 556677',
    pickupLocation: 'Bijoy Auditorium Grand Plaza Steps',
    payoutMethod: 'bkash',
    payoutNumber: '01844556677',
    rating: 4.8,
    totalSales: 110,
    balance: 6200,
    isTrusted: true,
    createdAt: '2026-01-18T12:00:00Z',
  },
  {
    id: 'seller-9',
    userId: 'user-9',
    storeName: 'Library Plaza Express Print & Binding',
    bio: 'Fast thesis spiral binding, high-DPI CAD plotting, lab reports, and executive stationery kits.',
    phone: '+880 1922 445566',
    pickupLocation: 'BUP Central Library Ground Floor Print Counter',
    payoutMethod: 'nagad',
    payoutNumber: '01922445566',
    rating: 4.8,
    totalSales: 350,
    balance: 8900,
    isTrusted: true,
    createdAt: '2026-01-19T12:00:00Z',
  },
  {
    id: 'seller-10',
    userId: 'user-10',
    storeName: 'BUP Sports Club Athletic Store',
    bio: 'Varsity baseball caps, team jerseys, water flasks, badminton shuttlecocks, and athletics gear.',
    phone: '+880 1766 889900',
    pickupLocation: 'Central Athletics Ground Pavilion Desk',
    payoutMethod: 'bkash',
    payoutNumber: '01766889900',
    rating: 4.7,
    totalSales: 145,
    balance: 7800,
    isTrusted: true,
    createdAt: '2026-01-20T12:00:00Z',
  },
]

// HELPER TO GENERATE 100 COMPLETE LISTINGS
const CATEGORIES_LIST = [
  'Merch',
  'Books & Notes',
  'Dining & Canteen',
  'Coffee & Snacks',
  'Electronics',
  'Stationery',
  'Services',
]

const SAMPLE_TITLES = [
  // Merch
  { title: 'Official BUP Varsity Winter Hoodie (Deep Emerald & Gold)', cat: 'Merch', p: 1450, mrp: 1650, sellerIdx: 3, cond: 'NEW', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { title: 'BUP Heavyweight Zipper Bomber Jacket (Charcoal)', cat: 'Merch', p: 1850, mrp: 2200, sellerIdx: 3, cond: 'NEW', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
  { title: 'BUP Crest Antique Gold Metal Lapel Pin', cat: 'Merch', p: 250, mrp: 350, sellerIdx: 3, cond: 'NEW', img: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=800&q=80' },
  { title: 'BUP Athletics Varsity Sports Cap (Embroidered Cotton)', cat: 'Merch', p: 380, mrp: 480, sellerIdx: 9, cond: 'NEW', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Varsity Football Team Jersey 2026 (Green & Gold)', cat: 'Merch', p: 550, mrp: 700, sellerIdx: 9, cond: 'NEW', img: 'https://images.unsplash.com/photo-1577210897949-1f56f9435024?auto=format&fit=crop&w=800&q=80' },
  { title: 'BUP Silk Woven Necktie with Gift Box', cat: 'Merch', p: 480, mrp: 600, sellerIdx: 3, cond: 'NEW', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
  // Books & Notes
  { title: 'Calculus & Analytical Geometry (11th Ed) + Solved Midterms', cat: 'Books & Notes', p: 520, mrp: 750, sellerIdx: 0, cond: 'USED_LIKE_NEW', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
  { title: 'Data Structures & Algorithms in C++ (Mark Weiss) Notes', cat: 'Books & Notes', p: 440, mrp: 600, sellerIdx: 0, cond: 'USED_LIKE_NEW', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80' },
  { title: 'Digital Logic Design & Verilog Handout Complete Bundle', cat: 'Books & Notes', p: 310, mrp: 450, sellerIdx: 0, cond: 'USED_GOOD', img: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80' },
  { title: 'FBS Case Study Digest 2026 (HBR Analysis & Valuation)', cat: 'Books & Notes', p: 360, mrp: 450, sellerIdx: 6, cond: 'NEW', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80' },
  { title: 'Principles of Marketing (Kotler & Armstrong 17th Ed)', cat: 'Books & Notes', p: 480, mrp: 650, sellerIdx: 1, cond: 'USED_LIKE_NEW', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
  { title: 'Corporate Finance (Ross Westerfield) Hardbound', cat: 'Books & Notes', p: 590, mrp: 850, sellerIdx: 1, cond: 'USED_GOOD', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  // Dining & Canteen
  { title: 'BUP Central Canteen Special Khichuri & Fried Ilish Platter', cat: 'Dining & Canteen', p: 240, mrp: 280, sellerIdx: 2, cond: 'NEW', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { title: 'Kacchi Biryani Special (Mutton + Borhani + Salad)', cat: 'Dining & Canteen', p: 290, mrp: 350, sellerIdx: 2, cond: 'NEW', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { title: 'Crispy Chicken Burger & Masala Fries Lunch Combo', cat: 'Dining & Canteen', p: 180, mrp: 220, sellerIdx: 2, cond: 'NEW', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { title: 'Traditional Morog Polao with Shami Kebab & Egg', cat: 'Dining & Canteen', p: 220, mrp: 260, sellerIdx: 2, cond: 'NEW', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  // Coffee & Snacks
  { title: 'Lake Promenade Cold Brew Coffee & Warm Cinnamon Roll', cat: 'Coffee & Snacks', p: 180, mrp: 220, sellerIdx: 5, cond: 'NEW', img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
  { title: 'Traditional Matir-Bhaar Masala Milk Tea & Shingara (4pcs)', cat: 'Coffee & Snacks', p: 95, mrp: 120, sellerIdx: 2, cond: 'NEW', img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80' },
  { title: 'Artisan Double Chocolate Fudge Brownie Slice', cat: 'Coffee & Snacks', p: 120, mrp: 150, sellerIdx: 5, cond: 'NEW', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { title: 'Iced Spanish Latte (16oz Lake Promenade Special)', cat: 'Coffee & Snacks', p: 140, mrp: 170, sellerIdx: 5, cond: 'NEW', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' },
  // Electronics
  { title: 'Casio fx-991EX ClassWiz Scientific Calculator (Original)', cat: 'Electronics', p: 2150, mrp: 2400, sellerIdx: 4, cond: 'NEW', img: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' },
  { title: 'Noise-Canceling Wireless Earbuds with Low-Latency Mode', cat: 'Electronics', p: 1890, mrp: 2300, sellerIdx: 4, cond: 'NEW', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { title: '20,000mAh 22.5W Fast Charging Power Bank', cat: 'Electronics', p: 1450, mrp: 1800, sellerIdx: 4, cond: 'NEW', img: 'https://images.unsplash.com/photo-1609592426868-b7c1ea141b77?auto=format&fit=crop&w=800&q=80' },
  { title: 'SanDisk 128GB Ultra Dual USB 3.1 Type-C Flash Drive', cat: 'Electronics', p: 850, mrp: 1100, sellerIdx: 4, cond: 'NEW', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80' },
  // Stationery
  { title: 'BUP Handcrafted Leather Notebook & Metal Ballpoint Pen Set', cat: 'Stationery', p: 490, mrp: 600, sellerIdx: 7, cond: 'NEW', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { title: 'Rotring Tikky Engineering Drafting Pencil Set (0.5/0.7mm)', cat: 'Stationery', p: 680, mrp: 850, sellerIdx: 8, cond: 'NEW', img: 'https://images.unsplash.com/photo-1585336261024-596956f2f276?auto=format&fit=crop&w=800&q=80' },
  { title: 'Pastel Highlighters 6-Color Study Aesthetic Set', cat: 'Stationery', p: 220, mrp: 290, sellerIdx: 8, cond: 'NEW', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80' },
  // Services
  { title: 'Express Thesis Hardbound Gold Foil Stamping & Binding', cat: 'Services', p: 250, mrp: 300, sellerIdx: 8, cond: 'NEW', img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80' },
  { title: 'Laser CAD Color Architectural Plotting (A1/A2 Size)', cat: 'Services', p: 120, mrp: 160, sellerIdx: 8, cond: 'NEW', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
]

export function generate100Listings(): DbListing[] {
  const listings: DbListing[] = []
  let idCounter = 1

  // First push our curated items
  for (const item of SAMPLE_TITLES) {
    const seller = SEED_SELLER_PROFILES[item.sellerIdx % SEED_SELLER_PROFILES.length]
    listings.push({
      id: `listing-${idCounter++}`,
      title: item.title,
      description: `Official campus offering provided by ${seller.storeName}. Verified by BUPCommon student welfare network. Free handover directly at ${seller.pickupLocation}.`,
      price: item.p,
      originalPrice: item.mrp,
      images: [item.img],
      condition: item.cond as any,
      stock: Math.floor(Math.random() * 20) + 3,
      category: item.cat,
      sellerId: seller.userId,
      sellerStoreName: seller.storeName,
      sellerPickup: seller.pickupLocation,
      status: 'ACTIVE',
      viewsCount: Math.floor(Math.random() * 500) + 40,
      isBoosted: idCounter % 7 === 0,
      deliveryTime: 'Same Day at Campus',
      pickupOption: 'Campus Handover',
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 120) + 12,
      createdAt: new Date(Date.now() - idCounter * 3600000 * 8).toISOString(),
    })
  }

  // Generate remaining to hit 100 listings
  const variations = [
    { prefix: 'Midterm Solved Lecture Notes for', cats: ['Books & Notes'] },
    { prefix: 'Premium Cotton Varsity T-Shirt with BUP Emblem', cats: ['Merch'] },
    { prefix: 'Fresh Afternoon Canteen Snack Box -', cats: ['Dining & Canteen', 'Coffee & Snacks'] },
    { prefix: 'Original Exam Approved Calculator Case for', cats: ['Electronics'] },
    { prefix: 'Spiral Lab Report Binding Voucher for', cats: ['Services'] },
    { prefix: 'Custom Engraved BUP Wooden Bookmark -', cats: ['Stationery'] },
    { prefix: 'Pre-owned Reference Guide & Solved Questions for', cats: ['Books & Notes'] },
    { prefix: 'Thermal Insulated Water Flask with BUP Crest', cats: ['Merch'] },
  ]

  const subjects = [
    'Algorithm Analysis & Design', 'Economics for Engineers', 'Business Law & Ethics',
    'Financial Accounting 2', 'Linear Algebra & ODE', 'Microprocessor & Assembly',
    'Supply Chain Management', 'International Trade Policy', 'Machine Learning Foundations',
    'Environmental Chemistry Lab', 'Corporate Strategy & Governance', 'Digital Communications',
  ]

  while (listings.length < 100) {
    const seller = SEED_SELLER_PROFILES[listings.length % SEED_SELLER_PROFILES.length]
    const varItem = variations[listings.length % variations.length]
    const subj = subjects[listings.length % subjects.length]
    const cat = varItem.cats[0]
    const basePrice = Math.floor(Math.random() * 60) * 20 + 120
    const originalPrice = Math.round(basePrice * 1.25)
    const isPending = listings.length === 98 || listings.length === 99
    const isSold = listings.length % 15 === 0

    listings.push({
      id: `listing-${idCounter++}`,
      title: `${varItem.prefix} ${subj}`,
      description: `Offered by verified campus seller ${seller.storeName}. Curated specifically for BUP cohorts with easy pickup at ${seller.pickupLocation}.`,
      price: basePrice,
      originalPrice: originalPrice,
      images: [
        SAMPLE_TITLES[listings.length % SAMPLE_TITLES.length].img
      ],
      condition: listings.length % 3 === 0 ? 'USED_LIKE_NEW' : listings.length % 5 === 0 ? 'USED_GOOD' : 'NEW',
      stock: isSold ? 0 : Math.floor(Math.random() * 15) + 2,
      category: cat,
      sellerId: seller.userId,
      sellerStoreName: seller.storeName,
      sellerPickup: seller.pickupLocation,
      status: isSold ? 'SOLD' : isPending ? 'PENDING' : 'ACTIVE',
      viewsCount: Math.floor(Math.random() * 400) + 15,
      isBoosted: listings.length % 11 === 0,
      deliveryTime: 'Within 2 hours on Campus',
      pickupOption: 'Faculty Handover',
      rating: Number((4.4 + Math.random() * 0.6).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 80) + 5,
      createdAt: new Date(Date.now() - listings.length * 3600000 * 6).toISOString(),
    })
  }

  return listings
}

export const SEED_LISTINGS: DbListing[] = generate100Listings()
