'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  CartItem,
  Product,
  Stall,
  UserProfile,
  UserAddress,
  SavedPayment,
  AccountOrder,
  UserNotification,
  UserReview,
  SellerProfileData
} from '@/lib/types'
import { ExtendedProduct, PRODUCTS } from '@/data/products'
import {
  INITIAL_USER,
  INITIAL_ADDRESSES,
  INITIAL_SAVED_PAYMENTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS
} from '@/data/accountMock'

interface BupContextType {
  // Cart
  cartItems: CartItem[]
  totalCartCount: number
  cartSubtotal: number
  addToCart: (product: Product | ExtendedProduct, quantity?: number) => void
  updateCartQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean

  // User & Account
  currentUser: UserProfile | null
  loginUser: (user: UserProfile) => void
  logoutUser: () => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  updateSellerProfile: (updates: Partial<SellerProfileData>) => void

  // Mode Switch
  mode: 'buying' | 'selling'
  toggleMode: () => void
  setMode: (mode: 'buying' | 'selling') => void

  // Addresses
  addresses: UserAddress[]
  addAddress: (address: Omit<UserAddress, 'id'>) => void
  updateAddress: (id: string, updates: Partial<UserAddress>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  // Payments
  savedPayments: SavedPayment[]
  addPaymentMethod: (payment: Omit<SavedPayment, 'id'>) => void
  deletePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void

  // Orders
  orders: AccountOrder[]
  cancelOrder: (orderId: string, reason?: string) => void
  reorderItems: (orderId: string) => void
  submitOrderReview: (orderId: string, review: { rating: number; comment: string }) => void

  // Notifications
  notifications: UserNotification[]
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void

  // Reviews
  reviews: UserReview[]
  deleteReview: (reviewId: string) => void
  editReview: (reviewId: string, updatedComment: string, newRating: number) => void

  // Shop Follows
  followedShops: string[]
  toggleFollowShop: (slug: string) => void
  isFollowingShop: (slug: string) => boolean

  // Delivery Location
  deliveryLocation: string
  setDeliveryLocation: (location: string) => void

  // Category & Navigation
  activeCategory: string
  setActiveCategory: (category: string) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Recently Viewed
  recentlyViewed: ExtendedProduct[]
  recordView: (product: ExtendedProduct) => void

  // Modals & Drawers
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void

  isAuthOpen: boolean
  authInitialTab: 'bup' | 'outside-login' | 'outside-register'
  openAuth: (tab?: 'bup' | 'outside-login' | 'outside-register') => void
  closeAuth: () => void

  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void

  isLocationModalOpen: boolean
  openLocationModal: () => void
  closeLocationModal: () => void

  isSellerModalOpen: boolean
  openSellerModal: () => void
  closeSellerModal: () => void

  isEventsModalOpen: boolean
  openEventsModal: () => void
  closeEventsModal: () => void

  isMapModalOpen: boolean
  openMapModal: () => void
  closeMapModal: () => void

  isProfileModalOpen: boolean
  openProfileModal: () => void
  closeProfileModal: () => void

  selectedProduct: ExtendedProduct | null
  openProduct: (product: ExtendedProduct | Product) => void
  closeProduct: () => void

  selectedStall: Stall | null
  openStall: (stall: Stall) => void
  closeStall: () => void

  // Toast
  toastMessage: string | null
  showToast: (msg: string) => void
}

const BupContext = createContext<BupContextType | undefined>(undefined)

export function BupProvider({ children }: { children: React.ReactNode }) {
  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([
    'prod-1',
    'prod-2'
  ])

  // User Auth - seeded with realistic BUP student profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER)

  // Mode Switch
  const [mode, setModeState] = useState<'buying' | 'selling'>('buying')

  // Account Data
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES)
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>(INITIAL_SAVED_PAYMENTS)
  const [orders, setOrders] = useState<AccountOrder[]>(INITIAL_ORDERS)
  const [notifications, setNotifications] = useState<UserNotification[]>(INITIAL_NOTIFICATIONS)
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS)
  const [followedShops, setFollowedShops] = useState<string[]>(['bup-official-merch'])

  // Delivery
  const [deliveryLocation, setDeliveryLocationState] = useState<string>(
    'BUP Campus, Mirpur Cantonment'
  )

  // Category
  const [activeCategory, setActiveCategory] = useState<string>('For You')

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    'prod-1',
    'prod-2',
    'prod-3',
  ])

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authInitialTab, setAuthInitialTab] = useState<'bup' | 'outside-login' | 'outside-register'>('bup')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false)
  const [isEventsModalOpen, setIsEventsOpen] = useState(false)
  const [isMapModalOpen, setIsMapOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileOpen] = useState(false)

  // Selected Entities for Detail Modals
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    const timer = setTimeout(() => {
      setToastMessage(null)
    }, 3200)
    return () => clearTimeout(timer)
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bup_ecommerce_user')
      if (savedUser) setCurrentUser(JSON.parse(savedUser))

      const savedCart = localStorage.getItem('bup_ecommerce_cart')
      if (savedCart) setCartItems(JSON.parse(savedCart))

      const savedWishlist = localStorage.getItem('bup_ecommerce_wishlist')
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

      const savedLocation = localStorage.getItem('bup_ecommerce_location')
      if (savedLocation) setDeliveryLocationState(savedLocation)

      const savedRecent = localStorage.getItem('bup_ecommerce_recent')
      if (savedRecent) setRecentlyViewedIds(JSON.parse(savedRecent))

      const savedMode = localStorage.getItem('bup_ecommerce_mode')
      if (savedMode === 'buying' || savedMode === 'selling') setModeState(savedMode)
    } catch (e) {
      console.error('Error loading stored BUP session', e)
    }
  }, [])

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('bup_ecommerce_cart', JSON.stringify(cartItems))
    } catch (e) {}
  }, [cartItems])

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('bup_ecommerce_wishlist', JSON.stringify(wishlist))
    } catch (e) {}
  }, [wishlist])

  // Mode Switch
  const setMode = (newMode: 'buying' | 'selling') => {
    setModeState(newMode)
    try {
      localStorage.setItem('bup_ecommerce_mode', newMode)
    } catch (e) {}
    showToast(`Switched to ${newMode === 'selling' ? 'Seller Hub' : 'Storefront'} mode`)
  }

  const toggleMode = () => {
    setMode(mode === 'buying' ? 'selling' : 'buying')
  }

  // Persist Location
  const setDeliveryLocation = (location: string) => {
    setDeliveryLocationState(location)
    try {
      localStorage.setItem('bup_ecommerce_location', location)
    } catch (e) {}
    showToast(`Delivery location set to: ${location}`)
  }

  // Cart Handlers
  const addToCart = (product: Product | ExtendedProduct, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
    showToast(`Added "${product.name.slice(0, 22)}..." to your bag!`)
  }

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
    showToast('Item removed from cart.')
  }

  const clearCart = () => {
    setCartItems([])
    showToast('Cart cleared.')
  }

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId)
      if (exists) {
        showToast('Removed from your wishlist.')
        return prev.filter((id) => id !== productId)
      } else {
        showToast('Saved to your wishlist! ❤️')
        return [...prev, productId]
      }
    })
  }

  const isWishlisted = (productId: string) => wishlist.includes(productId)

  // Auth Handlers
  const loginUser = (user: UserProfile) => {
    setCurrentUser(user)
    try {
      localStorage.setItem('bup_ecommerce_user', JSON.stringify(user))
    } catch (e) {}
    showToast(`Welcome back, ${user.name}! ${user.isBupVerified ? 'BUP Student/Faculty discount enabled.' : ''}`)
  }

  const logoutUser = () => {
    setCurrentUser(null)
    try {
      localStorage.removeItem('bup_ecommerce_user')
    } catch (e) {}
    showToast('Signed out successfully.')
  }

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem('bup_ecommerce_user', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })
    showToast('Profile updated successfully!')
  }

  const updateSellerProfile = (updates: Partial<SellerProfileData>) => {
    setCurrentUser((prev) => {
      if (!prev) return null
      const updatedSeller: SellerProfileData = {
        ...(prev.sellerProfile || (INITIAL_USER.sellerProfile as SellerProfileData)),
        ...updates
      }
      const updatedUser: UserProfile = {
        ...prev,
        isSeller: true,
        sellerSlug: updatedSeller.slug,
        sellerProfile: updatedSeller
      }
      try {
        localStorage.setItem('bup_ecommerce_user', JSON.stringify(updatedUser))
      } catch (e) {}
      return updatedUser
    })
    showToast('Seller shop details saved!')
  }

  // Address Handlers
  const addAddress = (addr: Omit<UserAddress, 'id'>) => {
    const newAddress: UserAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    }
    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress]
      }
      return [...prev, newAddress]
    })
    showToast('New address saved!')
  }

  const updateAddress = (id: string, updates: Partial<UserAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates }
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false }
        }
        return a
      })
    )
    showToast('Address updated.')
  }

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    showToast('Address removed.')
  }

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
    showToast('Default delivery address updated.')
  }

  // Saved Payment Handlers
  const addPaymentMethod = (pm: Omit<SavedPayment, 'id'>) => {
    const newPm: SavedPayment = {
      ...pm,
      id: `pm-${Date.now()}`
    }
    setSavedPayments((prev) => {
      if (newPm.isDefault) {
        return [...prev.map((p) => ({ ...p, isDefault: false })), newPm]
      }
      return [...prev, newPm]
    })
    showToast('Payment account saved securely.')
  }

  const deletePaymentMethod = (id: string) => {
    setSavedPayments((prev) => prev.filter((p) => p.id !== id))
    showToast('Payment method removed.')
  }

  const setDefaultPaymentMethod = (id: string) => {
    setSavedPayments((prev) =>
      prev.map((p) => ({ ...p, isDefault: p.id === id }))
    )
    showToast('Default payout/payment method updated.')
  }

  // Order Handlers
  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as const } : o))
    )
    showToast(`Order ${orderId} cancelled${reason ? `: ${reason}` : ''}`)
  }

  const reorderItems = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    order.items.forEach((item) => {
      const match = PRODUCTS.find((p) => p.id === item.id)
      if (match) {
        addToCart(match, item.quantity)
      }
    })
    showToast('Items added back to your cart!')
  }

  const submitOrderReview = (orderId: string, review: { rating: number; comment: string }) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isReviewed: true } : o))
    )
    const targetOrder = orders.find((o) => o.id === orderId)
    if (targetOrder && targetOrder.items[0]) {
      const newReview: UserReview = {
        id: `rev-${Date.now()}`,
        listingId: targetOrder.items[0].id,
        listingTitle: targetOrder.items[0].name,
        listingImage: targetOrder.items[0].image,
        sellerName: targetOrder.seller,
        sellerSlug: targetOrder.sellerSlug || 'seller',
        sellerRating: review.rating,
        productRating: review.rating,
        comment: review.comment,
        date: 'Today',
      }
      setReviews((prev) => [newReview, ...prev])
    }
    showToast('Review submitted! Thank you for rating.')
  }

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    showToast('All notifications marked as read.')
  }

  // Reviews
  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    showToast('Review deleted.')
  }

  const editReview = (reviewId: string, updatedComment: string, newRating: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, comment: updatedComment, productRating: newRating, sellerRating: newRating }
          : r
      )
    )
    showToast('Review updated!')
  }

  // Shop Follow
  const toggleFollowShop = (slug: string) => {
    setFollowedShops((prev) => {
      const exists = prev.includes(slug)
      if (exists) {
        showToast('Unfollowed campus shop.')
        return prev.filter((s) => s !== slug)
      } else {
        showToast('Following campus shop! You will get stock alerts. 🔔')
        return [...prev, slug]
      }
    })
  }

  const isFollowingShop = (slug: string) => followedShops.includes(slug)

  // Recently Viewed Handlers
  const recordView = (product: ExtendedProduct) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== product.id)
      const updated = [product.id, ...filtered].slice(0, 8)
      try {
        localStorage.setItem('bup_ecommerce_recent', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })
  }

  const recentlyViewed: ExtendedProduct[] = recentlyViewedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as ExtendedProduct[]

  // Modal controls
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const openAuth = (tab: 'bup' | 'outside-login' | 'outside-register' = 'bup') => {
    setAuthInitialTab(tab)
    setIsAuthOpen(true)
  }
  const closeAuth = () => setIsAuthOpen(false)

  const openSearch = () => setIsSearchOpen(true)
  const closeSearch = () => setIsSearchOpen(false)

  const openLocationModal = () => setIsLocationModalOpen(true)
  const closeLocationModal = () => setIsLocationModalOpen(false)

  const openSellerModal = () => setIsSellerModalOpen(true)
  const closeSellerModal = () => setIsSellerModalOpen(false)

  const openEventsModal = () => setIsEventsOpen(true)
  const closeEventsModal = () => setIsEventsOpen(false)

  const openMapModal = () => setIsMapOpen(true)
  const closeMapModal = () => setIsMapOpen(false)

  const openProfileModal = () => setIsProfileOpen(true)
  const closeProfileModal = () => setIsProfileOpen(false)

  const openProduct = (product: ExtendedProduct | Product) => {
    const extProduct = PRODUCTS.find((p) => p.id === product.id) || (product as ExtendedProduct)
    setSelectedProduct(extProduct)
    recordView(extProduct)
  }
  const closeProduct = () => setSelectedProduct(null)

  const openStall = (stall: Stall) => setSelectedStall(stall)
  const closeStall = () => setSelectedStall(null)

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <BupContext.Provider
      value={{
        cartItems,
        totalCartCount,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currentUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        updateSellerProfile,
        mode,
        toggleMode,
        setMode,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        savedPayments,
        addPaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        orders,
        cancelOrder,
        reorderItems,
        submitOrderReview,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        reviews,
        deleteReview,
        editReview,
        followedShops,
        toggleFollowShop,
        isFollowingShop,
        deliveryLocation,
        setDeliveryLocation,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        recentlyViewed,
        recordView,
        isCartOpen,
        openCart,
        closeCart,
        isAuthOpen,
        authInitialTab,
        openAuth,
        closeAuth,
        isSearchOpen,
        openSearch,
        closeSearch,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        isSellerModalOpen,
        openSellerModal,
        closeSellerModal,
        isEventsModalOpen,
        openEventsModal,
        closeEventsModal,
        isMapModalOpen,
        openMapModal,
        closeMapModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        selectedProduct,
        openProduct,
        closeProduct,
        selectedStall,
        openStall,
        closeStall,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </BupContext.Provider>
  )
}

export function useBup() {
  const context = useContext(BupContext)
  if (!context) {
    throw new Error('useBup must be used within a BupProvider')
  }
  return context
}
