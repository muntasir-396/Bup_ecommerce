export type UserRole = 'student' | 'faculty' | 'outside' | 'admin'

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED'

export interface UserAddress {
  id: string
  label: 'Hall' | 'Home' | 'Other'
  recipient: string
  phone: string
  area: string
  fullAddress: string
  pickupPoint?: string
  isDefault: boolean
}

export interface SavedPayment {
  id: string
  method: 'bkash' | 'nagad'
  accountNumber: string // Masked e.g. 017****5892
  accountHolder: string
  isDefault: boolean
}

export interface AccountOrder {
  id: string
  date: string
  seller: string
  sellerSlug?: string
  sellerId?: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: 'To Pay' | 'To Receive' | 'Completed' | 'Cancelled' | 'Returns'
  pickupLocation: string
  paymentMethod: string
  trackingStep: number // 0: Confirmed, 1: Packed, 2: Ready/Shipped, 3: Delivered
  invoiceId: string
  canReview?: boolean
  isReviewed?: boolean
}

export interface UserNotification {
  id: string
  title: string
  message: string
  category: 'orders' | 'messages' | 'offers' | 'system'
  isRead: boolean
  date: string
  linkUrl?: string
}

export interface UserReview {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  sellerName: string
  sellerSlug: string
  sellerRating: number
  productRating: number
  comment: string
  date: string
  sellerReply?: string
}

export interface SellerProfileData {
  id: string
  userId: string
  shopName: string
  slug: string
  logo?: string
  banner?: string
  tagline?: string
  description?: string
  sellerType: 'Student' | 'Faculty' | 'Staff' | 'Stall Vendor' | 'Canteen'
  categories: string[]
  pickupPoints: string[]
  openingHours?: Record<string, string> // e.g. { "Sun-Thu": "09:00 - 17:00" }
  deliveryFee: number
  prepTime: string
  phone: string
  pickupLocation: string
  payoutMethod: 'bkash' | 'nagad'
  payoutNumber: string
  vacationUntil?: string | null
  verificationLevel: 'EMAIL_VERIFIED' | 'BUP_VERIFIED' | 'TRUSTED_SELLER'
  policy?: string
  announcement?: string
  rating: number
  totalSales: number
  balance: number
  followersCount: number
  responseRate?: number
  avgResponseTime?: string
  onTimeDeliveryRate?: number
  memberSince?: string
  isTrusted: boolean
}

export interface UserProfile {
  id: string
  name: string
  username?: string
  email: string
  role?: UserRole
  studentId?: string
  department?: string
  faculty?: string
  batch?: string
  hall?: string
  phone?: string
  bio?: string
  gender?: string
  dateOfBirth?: string
  isBupVerified: boolean
  verificationStatus?: VerificationStatus
  isSeller?: boolean
  sellerSlug?: string
  sellerProfile?: SellerProfileData
  avatarUrl?: string
  coverUrl?: string
  addresses?: UserAddress[]
  savedPayments?: SavedPayment[]
}

export interface Product {
  id: string
  name: string
  category:
    | 'Merch'
    | 'Textbooks'
    | 'Books & Notes'
    | 'Dining & Canteen'
    | 'Coffee & Snacks'
    | 'Electronics'
    | 'Stationery'
    | 'Stationery & Arts'
    | 'Services'
    | (string & {})
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  seller: string
  sellerSlug?: string
  sellerId?: string
  sellerType: 'BUP Official' | 'Student Society' | 'Campus Canteen' | 'Student Vendor' | 'Outside Partner'
  image: string
  images?: string[]
  description: string
  inStock: boolean
  tag?: string
  deliveryTime: string
}

export interface Stall {
  id: string
  name: string
  zone: 'Lakeside & Vista' | 'Academic Wing (FST/FBS)' | 'Auditorium Plaza' | 'Central Library' | 'Sports Grounds'
  side: string
  status: 'Open' | 'Popular' | 'Reserved'
  position: string
  tone: string
  dailyRate: number
  features: string[]
  reservedBy?: string
  coordinates: { x: number; y: number }
  footfall: string
  peakHours: string
  ambience: string
  image: string
  dimensions: string
  powerGrid: string
  recommendedFor: string[]
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CampusEvent {
  id: string
  title: string
  organizer: string
  date: string
  time: string
  location: string
  badge: string
  description: string
}
