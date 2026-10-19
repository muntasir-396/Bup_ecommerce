import {
  DbUser,
  DbSellerProfile,
  DbListing,
  DbOrder,
  DbOrderItem,
  DbReview,
  DbConversation,
  DbMessage,
  DbPayout,
  DbReport,
  SEED_USERS,
  SEED_SELLER_PROFILES,
  SEED_LISTINGS,
} from '@/data/seed'

// Prohibited items keyword list
const PROHIBITED_KEYWORDS = [
  'exam paper leak',
  'leak question',
  'cheat sheet exam hall',
  'proxy attendance',
  'alcohol',
  'cigarette',
  'vape',
  'weapon',
  'knife',
  'firearm',
  'prescription drug',
  'narcotic',
]

export function checkProhibitedContent(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase()
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (text.includes(keyword)) {
      return `Listing contains prohibited content: "${keyword}". Such items violate BUP campus discipline regulations.`
    }
  }
  return null
}

// Global in-memory singleton to persist across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __BUP_DB__: {
    users: DbUser[]
    sellers: DbSellerProfile[]
    listings: DbListing[]
    orders: DbOrder[]
    reviews: DbReview[]
    conversations: DbConversation[]
    payouts: DbPayout[]
    reports: DbReport[]
  } | undefined
}

function initDb() {
  if (!global.__BUP_DB__) {
    // Initial sample orders
    const sampleOrders: DbOrder[] = [
      {
        id: 'ord-1001',
        buyerId: 'user-11',
        buyerName: 'Zareen Subah',
        buyerPhone: '+880 1777 112233',
        deliveryLocation: 'BUP Central Library Plaza',
        paymentMethod: 'bkash',
        totalAmount: 1450,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        items: [
          {
            id: 'item-1',
            orderId: 'ord-1001',
            listingId: 'listing-1',
            listingTitle: 'Official BUP Varsity Winter Hoodie (Deep Emerald & Gold)',
            listingImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
            sellerId: 'user-4',
            sellerStoreName: 'BUP Official Varsity Regalia',
            price: 1450,
            quantity: 1,
            status: 'READY',
            pickupLocation: 'BUP Central Information & Alumni Booth (Gate 1)',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
        ],
      },
      {
        id: 'ord-1002',
        buyerId: 'user-12',
        buyerName: 'Farhan Kabir',
        buyerPhone: '+880 1888 223344',
        deliveryLocation: 'Faculty of Business Studies (FBS) Concourse',
        paymentMethod: 'nagad',
        totalAmount: 600,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            id: 'item-2',
            orderId: 'ord-1002',
            listingId: 'listing-10',
            listingTitle: 'FBS Case Study Digest 2026 (HBR Analysis & Valuation)',
            listingImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
            sellerId: 'user-7',
            sellerStoreName: 'BCC Case Study & Career Hub',
            price: 360,
            quantity: 1,
            status: 'CONFIRMED',
            pickupLocation: 'FBS Career Club Room (West Concourse)',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'item-3',
            orderId: 'ord-1002',
            listingId: 'listing-13',
            listingTitle: 'BUP Central Canteen Special Khichuri & Fried Ilish Platter',
            listingImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            sellerId: 'user-3',
            sellerStoreName: 'BUP Central Canteen Express',
            price: 240,
            quantity: 1,
            status: 'PACKED',
            pickupLocation: 'Central Canteen Counter #2 (Express Pickup)',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ],
      },
    ]

    // Initial conversations
    const sampleConversations: DbConversation[] = [
      {
        id: 'conv-1',
        buyerId: 'user-11',
        buyerName: 'Zareen Subah',
        sellerId: 'user-1',
        sellerName: 'Tanvir Engineering & Notes Vault',
        listingId: 'listing-7',
        listingTitle: 'Calculus & Analytical Geometry (11th Ed) + Solved Midterms',
        listingPrice: 520,
        listingImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        messages: [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            senderId: 'user-11',
            senderName: 'Zareen Subah',
            text: 'Salam Tanvir bhai! Does this calculus book have the 2025 midterm solutions too?',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            senderId: 'user-1',
            senderName: 'Tanvir Ahmed',
            text: 'Walaikum Assalam! Yes, the back section has both 2024 and 2025 midterms solved step-by-step.',
            isRead: true,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      },
    ]

    global.__BUP_DB__ = {
      users: [...SEED_USERS],
      sellers: [...SEED_SELLER_PROFILES],
      listings: [...SEED_LISTINGS],
      orders: sampleOrders,
      reviews: [],
      conversations: sampleConversations,
      payouts: [
        {
          id: 'pay-1',
          sellerId: 'user-1',
          amount: 3500,
          commission: 175,
          netAmount: 3325,
          method: 'bkash',
          accountNumber: '01711234567',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ],
      reports: [],
    }
  }
  return global.__BUP_DB__
}

export const db = initDb()

// Helper API functions
export function getAllListings(params?: {
  category?: string
  q?: string
  sellerId?: string
  status?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  limit?: number
}) {
  let list = [...db.listings]

  if (params?.status) {
    list = list.filter((l) => l.status === params.status)
  } else {
    // By default public sees active listings
    if (!params?.sellerId) {
      list = list.filter((l) => l.status === 'ACTIVE')
    }
  }

  if (params?.sellerId) {
    list = list.filter((l) => l.sellerId === params.sellerId)
  }

  if (params?.category && params.category !== 'All') {
    const cat = params.category.toLowerCase()
    list = list.filter((l) => l.category.toLowerCase().includes(cat))
  }

  if (params?.q) {
    const q = params.q.toLowerCase()
    list = list.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.sellerStoreName.toLowerCase().includes(q)
    )
  }

  if (params?.condition) {
    list = list.filter((l) => l.condition === params.condition)
  }

  if (params?.minPrice !== undefined) {
    list = list.filter((l) => l.price >= params.minPrice!)
  }

  if (params?.maxPrice !== undefined) {
    list = list.filter((l) => l.price <= params.maxPrice!)
  }

  if (params?.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (params?.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  } else if (params?.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  } else {
    // popularity / views
    list.sort((a, b) => b.viewsCount - a.viewsCount)
  }

  const page = params?.page || 1
  const limit = params?.limit || 20
  const total = list.length
  const paginated = list.slice((page - 1) * limit, page * limit)

  return {
    listings: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export function getListingById(id: string) {
  const listing = db.listings.find((l) => l.id === id)
  if (listing) {
    listing.viewsCount += 1
  }
  return listing
}

export function getSellerProfile(userId: string) {
  return db.sellers.find((s) => s.userId === userId)
}

export function createOrUpdateSeller(data: {
  userId: string
  storeName: string
  bio?: string
  phone: string
  pickupLocation: string
  payoutMethod: 'bkash' | 'nagad'
  payoutNumber: string
}) {
  const user = db.users.find((u) => u.id === data.userId)
  if (!user) throw new Error('User not found')

  user.isSeller = true

  const existingIndex = db.sellers.findIndex((s) => s.userId === data.userId)
  if (existingIndex >= 0) {
    db.sellers[existingIndex] = {
      ...db.sellers[existingIndex],
      storeName: data.storeName,
      bio: data.bio || '',
      phone: data.phone,
      pickupLocation: data.pickupLocation,
      payoutMethod: data.payoutMethod,
      payoutNumber: data.payoutNumber,
    }
    return db.sellers[existingIndex]
  } else {
    const newProfile: DbSellerProfile = {
      id: `seller-${Date.now()}`,
      userId: data.userId,
      storeName: data.storeName,
      bio: data.bio || '',
      phone: data.phone,
      pickupLocation: data.pickupLocation,
      payoutMethod: data.payoutMethod,
      payoutNumber: data.payoutNumber,
      rating: 5.0,
      totalSales: 0,
      balance: 0,
      isTrusted: user.isBupVerified,
      createdAt: new Date().toISOString(),
    }
    db.sellers.push(newProfile)
    return newProfile
  }
}

export function createListing(data: {
  sellerId: string
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  condition: 'NEW' | 'USED_LIKE_NEW' | 'USED_GOOD'
  stock: number
  category: string
  deliveryTime?: string
  pickupOption?: string
  isDraft?: boolean
}) {
  const prohibited = checkProhibitedContent(data.title, data.description)
  if (prohibited) throw new Error(prohibited)

  const seller = db.sellers.find((s) => s.userId === data.sellerId)
  if (!seller) throw new Error('Seller profile required before publishing')

  // Auto-publish for trusted sellers, pending for new sellers
  const status: 'ACTIVE' | 'PENDING' | 'DRAFT' = data.isDraft
    ? 'DRAFT'
    : seller.isTrusted
    ? 'ACTIVE'
    : 'PENDING'

  const newListing: DbListing = {
    id: `listing-${Date.now()}`,
    title: data.title,
    description: data.description,
    price: data.price,
    originalPrice: data.originalPrice || Math.round(data.price * 1.2),
    images: data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    condition: data.condition,
    stock: data.stock,
    category: data.category,
    sellerId: data.sellerId,
    sellerStoreName: seller.storeName,
    sellerPickup: seller.pickupLocation,
    status: status,
    viewsCount: 1,
    isBoosted: false,
    deliveryTime: data.deliveryTime || 'Same Day on Campus',
    pickupOption: data.pickupOption || 'Campus Handover',
    rating: 5.0,
    reviewsCount: 0,
    createdAt: new Date().toISOString(),
  }

  db.listings.unshift(newListing)
  return newListing
}

export function updateListing(listingId: string, sellerId: string, updates: Partial<DbListing>) {
  const listing = db.listings.find((l) => l.id === listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.sellerId !== sellerId) throw new Error('Unauthorized to edit this listing')

  if (updates.title || updates.description) {
    const prohibited = checkProhibitedContent(
      updates.title || listing.title,
      updates.description || listing.description
    )
    if (prohibited) throw new Error(prohibited)
  }

  Object.assign(listing, updates)
  return listing
}

export function deleteListing(listingId: string, sellerId: string) {
  const index = db.listings.findIndex((l) => l.id === listingId)
  if (index === -1) throw new Error('Listing not found')
  if (db.listings[index].sellerId !== sellerId) throw new Error('Unauthorized to delete this listing')

  db.listings.splice(index, 1)
  return true
}

// Split mixed cart into separate sub-orders per seller
export function createOrder(data: {
  buyerId: string
  buyerName: string
  buyerPhone: string
  paymentMethod: 'bkash' | 'nagad' | 'cod'
  deliveryLocation: string
  items: { listingId: string; quantity: number }[]
}) {
  const orderId = `ord-${Date.now().toString().slice(-6)}`
  const orderItems: DbOrderItem[] = []
  let totalAmount = 0

  for (const item of data.items) {
    const listing = db.listings.find((l) => l.id === item.listingId)
    if (!listing) continue

    if (listing.sellerId === data.buyerId) {
      throw new Error(`You cannot purchase your own listing ("${listing.title}")`)
    }

    if (listing.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${listing.title}". Available: ${listing.stock}`)
    }

    // Decrement stock
    listing.stock -= item.quantity
    if (listing.stock <= 0) listing.status = 'SOLD'

    const itemTotal = listing.price * item.quantity
    totalAmount += itemTotal

    orderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      sellerId: listing.sellerId,
      sellerStoreName: listing.sellerStoreName,
      price: listing.price,
      quantity: item.quantity,
      status: 'CONFIRMED',
      pickupLocation: listing.sellerPickup,
      createdAt: new Date().toISOString(),
    })
  }

  const newOrder: DbOrder = {
    id: orderId,
    buyerId: data.buyerId,
    buyerName: data.buyerName,
    buyerPhone: data.buyerPhone,
    deliveryLocation: data.deliveryLocation,
    paymentMethod: data.paymentMethod,
    totalAmount,
    items: orderItems,
    createdAt: new Date().toISOString(),
  }

  db.orders.unshift(newOrder)
  return newOrder
}

export function updateOrderItemStatus(
  orderItemId: string,
  sellerId: string,
  newStatus: 'CONFIRMED' | 'PACKED' | 'READY' | 'DELIVERED' | 'CANCELLED',
  reason?: string
) {
  for (const order of db.orders) {
    const item = order.items.find((i) => i.id === orderItemId)
    if (item) {
      if (item.sellerId !== sellerId) throw new Error('Unauthorized to update this order item')
      item.status = newStatus
      if (reason) item.cancellationReason = reason

      // If delivered, add to seller balance (95% after 5% platform commission)
      if (newStatus === 'DELIVERED') {
        const seller = db.sellers.find((s) => s.userId === sellerId)
        if (seller) {
          const earnings = item.price * item.quantity * 0.95
          seller.balance += earnings
          seller.totalSales += item.quantity
        }
      }

      return item
    }
  }
  throw new Error('Order item not found')
}
