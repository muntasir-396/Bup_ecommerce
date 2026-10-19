'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Store,
  Package,
  Truck,
  Star,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { AuthModal } from '@/components/bup/AuthModal'
import { UserProfileModal } from '@/components/bup/UserProfileModal'
import { useBup } from '@/context/BupContext'

interface SubOrderState {
  id: string
  seller: string
  sellerId?: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  status: 'CONFIRMED' | 'PACKED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELLED'
  reviewed?: boolean
}

export default function CartPage() {
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    currentUser,
    deliveryLocation,
    openLocationModal,
    openAuth,
    showToast,
    isAuthOpen,
    closeAuth,
    loginUser,
    authInitialTab,
    isProfileModalOpen,
    closeProfileModal,
    logoutUser,
  } = useBup()

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<'bkash' | 'nagad' | 'cod'>('bkash')
  const [subOrders, setSubOrders] = useState<SubOrderState[]>([])

  // Review states for delivered items
  const [reviewingSubOrderId, setReviewingSubOrderId] = useState<string | null>(null)
  const [sellerRating, setSellerRating] = useState(5)
  const [productRating, setProductRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Group cart items by seller
  const sellerGroups = useMemo(() => {
    const map = new Map<string, {
      sellerName: string
      sellerId?: string
      items: typeof cartItems
      subtotal: number
      hasSelfListing: boolean
    }>()

    cartItems.forEach((item) => {
      const sellerName = item.product.seller || 'BUP Campus Partner'
      const sellerId = (item.product as any).sellerId || ''
      const isSelf = Boolean(
        currentUser && (
          (sellerId && sellerId === currentUser.id) ||
          sellerName.toLowerCase() === (currentUser.name || '').toLowerCase()
        )
      )

      if (!map.has(sellerName)) {
        map.set(sellerName, {
          sellerName,
          sellerId,
          items: [],
          subtotal: 0,
          hasSelfListing: false,
        })
      }

      const group = map.get(sellerName)!
      group.items.push(item)
      group.subtotal += item.product.price * item.quantity
      if (isSelf) {
        group.hasSelfListing = true
      }
    })

    return Array.from(map.values())
  }, [cartItems, currentUser])

  const hasAnySelfListing = sellerGroups.some((g) => g.hasSelfListing)

  // Calculate pricing
  const totalMRP = cartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  )
  const actualSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const productDiscount = Math.max(0, totalMRP - actualSubtotal)

  // Extra 5% student discount if BUP verified
  const studentDiscount = currentUser?.isBupVerified
    ? Math.round(actualSubtotal * 0.05)
    : 0

  const totalAmount = Math.max(0, actualSubtotal - studentDiscount)
  const totalSavings = productDiscount + studentDiscount

  const handleCheckout = async () => {
    if (!currentUser) {
      openAuth('bup')
      return
    }

    if (hasAnySelfListing) {
      showToast('You cannot purchase your own listings. Please remove them first.')
      return
    }

    // Split cart into sub-orders per seller
    const generatedSubOrders: SubOrderState[] = sellerGroups.map((group, idx) => ({
      id: `SUB-${Date.now().toString().slice(-4)}-${idx + 1}`,
      seller: group.sellerName,
      sellerId: group.sellerId,
      items: group.items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal: group.subtotal,
      status: 'CONFIRMED',
    }))

    setSubOrders(generatedSubOrders)
    setOrderPlaced(true)
    showToast('Order confirmed! Sub-orders sent to campus sellers.')

    // Post to server orders API in the background
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: currentUser.id,
          pickupLocation: deliveryLocation,
          paymentMethod: selectedPayment,
          items: cartItems.map((ci) => ({
            listingId: ci.product.id,
            quantity: ci.quantity,
          })),
        }),
      })
    } catch {
      // offline/mock fallback
    }
  }

  const advanceOrderStatus = (subOrderId: string) => {
    setSubOrders((prev) =>
      prev.map((order) => {
        if (order.id !== subOrderId) return order
        const flow: Record<SubOrderState['status'], SubOrderState['status']> = {
          CONFIRMED: 'PACKED',
          PACKED: 'READY_FOR_PICKUP',
          READY_FOR_PICKUP: 'DELIVERED',
          DELIVERED: 'DELIVERED',
          CANCELLED: 'CANCELLED',
        }
        const nextStatus = flow[order.status]
        if (nextStatus === 'DELIVERED') {
          showToast(`Sub-order ${order.id} marked as delivered! Please leave a review.`)
        } else {
          showToast(`Sub-order ${order.id} updated to ${nextStatus.replace('_', ' ')}`)
        }
        return { ...order, status: nextStatus }
      })
    )
  }

  const submitReview = async (subOrderId: string) => {
    setSubmittingReview(true)
    try {
      await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          subOrderId,
          sellerRating,
          productRating,
          comment: reviewComment,
        }),
      })
    } catch {
      // mock fallback
    }
    setSubmittingReview(false)
    setSubOrders((prev) =>
      prev.map((o) => (o.id === subOrderId ? { ...o, reviewed: true } : o))
    )
    setReviewingSubOrderId(null)
    setReviewComment('')
    showToast('Review submitted! Thank you for supporting campus peers.')
  }

  const getTimelineIndex = (status: SubOrderState['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 0
      case 'PACKED':
        return 1
      case 'READY_FOR_PICKUP':
        return 2
      case 'DELIVERED':
        return 3
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#1f3a2e]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Shopping Cart</span>
        </div>

        {orderPlaced ? (
          /* ORDER CONFIRMATION & MULTI-SELLER SUB-ORDER TRACKING */
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-2xl bg-white p-6 sm:p-8 text-center border border-neutral-200 shadow-sm animate-in fade-in">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                <CheckCircle2 className="size-8" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900">
                Order Placed Successfully!
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                Cart split into <strong>{subOrders.length} seller sub-order{subOrders.length > 1 ? 's' : ''}</strong> for campus fulfillment.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FAF5E9] px-4 py-1.5 text-xs font-semibold text-[#1f3a2e] border border-[#213527]/10">
                <MapPin className="size-3.5 text-[#b5573a]" />
                <span>Pickup / Handover: {deliveryLocation}</span>
                <span>•</span>
                <span className="uppercase text-neutral-700">{selectedPayment}</span>
              </div>
            </div>

            {/* SUB-ORDERS LIST */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                Seller Sub-Orders & Live Tracking ({subOrders.length})
              </h2>

              {subOrders.map((subOrder) => {
                const stepIdx = getTimelineIndex(subOrder.status)
                const isDelivered = subOrder.status === 'DELIVERED'

                return (
                  <div
                    key={subOrder.id}
                    className="rounded-xl bg-white p-5 border border-neutral-200/90 shadow-2xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="grid size-8 place-items-center rounded-lg bg-[#FAF5E9] text-[#1f3a2e]">
                          <Store className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-neutral-900">{subOrder.seller}</h3>
                            <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-mono text-neutral-500">
                              #{subOrder.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Campus Seller Sub-Order</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-500">Subtotal: </span>
                        <strong className="text-sm font-bold text-neutral-900">৳{subOrder.subtotal}</strong>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {subOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2.5 rounded-lg bg-neutral-50 p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-10 rounded object-cover border border-neutral-200"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-neutral-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-neutral-500">
                              Qty: {item.quantity} × ৳{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline per seller */}
                    <div className="pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                        Status Timeline
                      </p>
                      <div className="relative flex items-center justify-between">
                        {/* Connecting line */}
                        <div className="absolute left-6 right-6 top-3 h-0.5 bg-neutral-200 -z-0" />
                        <div
                          className="absolute left-6 top-3 h-0.5 bg-[#1f3a2e] transition-all duration-300 -z-0"
                          style={{ width: `${(stepIdx / 3) * 100}%` }}
                        />

                        {/* Step 1: Confirmed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                              stepIdx >= 0 ? 'bg-[#1f3a2e] text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-neutral-700">Confirmed</span>
                        </div>

                        {/* Step 2: Packed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                              stepIdx >= 1 ? 'bg-[#1f3a2e] text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {stepIdx >= 1 ? '✓' : '2'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-neutral-700">Packed</span>
                        </div>

                        {/* Step 3: Ready / Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                              stepIdx >= 2 ? 'bg-[#1f3a2e] text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {stepIdx >= 2 ? '✓' : '3'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-neutral-700">Ready / Shipped</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                              stepIdx >= 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {stepIdx >= 3 ? '✓' : '4'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-neutral-700">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Action / Simulation Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        {!isDelivered ? (
                          <button
                            type="button"
                            onClick={() => advanceOrderStatus(subOrder.id)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
                          >
                            <RotateCcw className="size-3 text-[#1f3a2e]" />
                            <span>Simulate Next Step ({subOrder.status === 'CONFIRMED' ? 'Pack' : subOrder.status === 'PACKED' ? 'Ready for Pickup' : 'Deliver'})</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="size-3.5" /> Handover Complete
                          </span>
                        )}
                      </div>

                      {/* Review Prompt After Delivery */}
                      {isDelivered && (
                        <div>
                          {subOrder.reviewed ? (
                            <span className="text-xs font-semibold text-neutral-400">
                              ✓ Review Submitted
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReviewingSubOrderId(subOrder.id)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-[#1f3a2e] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
                            >
                              <Star className="size-3.5 fill-current text-amber-300" />
                              <span>Rate Seller & Products</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* INLINE REVIEW FORM */}
                    {reviewingSubOrderId === subOrder.id && !subOrder.reviewed && (
                      <div className="mt-3 rounded-xl bg-amber-50/60 p-4 border border-amber-200 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-amber-900">
                            Rate {subOrder.seller} & Order #{subOrder.id}
                          </h4>
                          <button
                            onClick={() => setReviewingSubOrderId(null)}
                            className="text-xs text-neutral-400 hover:text-neutral-700"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {/* Seller rating */}
                          <div>
                            <label className="block font-semibold text-neutral-700 mb-1">
                              Seller Service & Punctuality
                            </label>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setSellerRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`size-4 ${
                                      star <= sellerRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="ml-1 font-bold text-neutral-600">{sellerRating}/5</span>
                            </div>
                          </div>

                          {/* Product rating */}
                          <div>
                            <label className="block font-semibold text-neutral-700 mb-1">
                              Product Quality & Condition
                            </label>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setProductRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`size-4 ${
                                      star <= productRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="ml-1 font-bold text-neutral-600">{productRating}/5</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your campus feedback (e.g. Quick pickup at Cafe Lake, item was in mint condition)..."
                            className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                            rows={2}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => submitReview(subOrder.id)}
                            disabled={submittingReview}
                            className="rounded-md bg-[#1f3a2e] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors disabled:opacity-50"
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Campus Review'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Back button */}
            <div className="text-center pt-2">
              <Link
                href="/marketplace"
                onClick={() => {
                  clearCart()
                  setOrderPlaced(false)
                }}
                className="inline-flex items-center gap-2 rounded-md bg-[#1f3a2e] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#b5573a] transition-colors shadow-sm"
              >
                <span>Continue Shopping Marketplace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART */
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
              <ShoppingBag className="size-10" />
            </div>
            <h2 className="font-serif text-2xl font-black text-neutral-900">
              Your Campus Bag is Empty
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              Explore varsity hoodies, fresh canteen khichuri, textbooks, and campus lake stalls to add items to your bag.
            </p>
            <div className="mt-6">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-md bg-[#1f3a2e] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#b5573a] transition-colors shadow-sm"
              >
                <span>Shop BUP Marketplace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE CART: GROUPED BY SELLER */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* LEFT: CART ITEMS GROUPED BY SELLER */}
            <div className="space-y-4">
              {/* Delivery location bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3.5 border border-neutral-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#b5573a] shrink-0" />
                  <div className="text-xs">
                    <span className="text-neutral-500">Deliver to: </span>
                    <strong className="text-neutral-900">{deliveryLocation}</strong>
                  </div>
                </div>
                <button
                  onClick={openLocationModal}
                  className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-bold text-[#1f3a2e] hover:bg-neutral-50"
                >
                  Change
                </button>
              </div>

              {/* Notice if self items are present */}
              {hasAnySelfListing && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-900 border border-amber-200">
                  <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                  <span>
                    You have listed one or more of these items yourself. Campus policy requires sellers to remove their own listings before checkout.
                  </span>
                </div>
              )}

              {/* SELLER GROUPS */}
              {sellerGroups.map((group) => (
                <div
                  key={group.sellerName}
                  className={`rounded-xl bg-white border shadow-2xs divide-y divide-neutral-100 overflow-hidden ${
                    group.hasSelfListing ? 'border-amber-300 ring-1 ring-amber-200' : 'border-neutral-200/90'
                  }`}
                >
                  {/* Seller Header */}
                  <div className="p-3.5 bg-[#FAF5E9]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Store className="size-4 text-[#1f3a2e]" />
                      <span className="text-xs font-bold text-neutral-900">
                        Seller: {group.sellerName}
                      </span>
                      {group.hasSelfListing && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          (Your Listing)
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-neutral-600">
                      Seller Subtotal: <strong className="text-neutral-900 font-bold">৳{group.subtotal}</strong>
                    </div>
                  </div>

                  {/* Items for this seller */}
                  {group.items.map((item) => {
                    const product = item.product
                    const itemTotal = product.price * item.quantity
                    return (
                      <div
                        key={product.id}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-20 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">
                              {product.category}
                            </span>
                            <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-neutral-500">
                              Condition: <span className="font-semibold text-neutral-700">{product.tag || 'New'}</span>
                            </p>

                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-sm font-bold text-neutral-900">
                                ৳{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-neutral-400 line-through">
                                  ৳{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls: Quantity + Remove */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                          <div className="flex items-center rounded-lg border border-neutral-300">
                            <button
                              onClick={() => updateCartQuantity(product.id, -1)}
                              className="p-1.5 text-neutral-600 hover:bg-neutral-100"
                              title="Decrease quantity"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, 1)}
                              className="p-1.5 text-neutral-600 hover:bg-neutral-100"
                              title="Increase quantity"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-neutral-900 min-w-16 text-right">
                            ৳{itemTotal}
                          </span>

                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Student discount banner */}
              {!currentUser?.isBupVerified && (
                <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="size-5 text-[#1f3a2e] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1f3a2e]">
                        Have a BUP Student or Faculty ID?
                      </p>
                      <p className="text-[11px] text-neutral-600">
                        Sign in to unlock an extra 5% campus welfare discount on this order.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openAuth('bup')}
                    className="shrink-0 rounded-md bg-[#1f3a2e] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
                  >
                    Verify ID
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: FLIPKART-STYLE PRICE BREAKDOWN STICKY CARD */}
            <aside className="rounded-xl bg-white p-5 border border-neutral-200/90 shadow-2xs sticky top-24 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
                Price Details ({sellerGroups.length} Seller{sellerGroups.length > 1 ? 's' : ''})
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-700">
                  <span>Price ({cartItems.length} items)</span>
                  <span>৳{totalMRP}</span>
                </div>

                {productDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount on MRP</span>
                    <span>-৳{productDiscount}</span>
                  </div>
                )}

                {studentDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>BUP Student Verified (5%)</span>
                    <span>-৳{studentDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-700">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                </div>

                <div className="border-t border-dashed border-neutral-200 pt-3 flex justify-between text-sm sm:text-base font-bold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-serif text-[#b5573a] font-black">৳{totalAmount}</span>
                </div>
              </div>

              {/* Savings highlight in green */}
              {totalSavings > 0 && (
                <div className="rounded-lg bg-emerald-50 p-2.5 text-center text-xs font-bold text-emerald-700">
                  You will save ৳{totalSavings} on this order 🎉
                </div>
              )}

              {/* Payment selection */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('bkash')}
                    className={`p-2 rounded-md border text-center font-bold transition-all ${
                      selectedPayment === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('nagad')}
                    className={`p-2 rounded-md border text-center font-bold transition-all ${
                      selectedPayment === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('cod')}
                    className={`p-2 rounded-md border text-center font-bold transition-all ${
                      selectedPayment === 'cod'
                        ? 'border-[#1f3a2e] bg-[#1f3a2e]/10 text-[#1f3a2e]'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    COD
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleCheckout}
                disabled={hasAnySelfListing}
                className="w-full rounded-lg bg-[#b5573a] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#9c452b] transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasAnySelfListing ? 'Remove Self-Listings to Order' : 'Place Order (Split by Seller)'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Safe and Secure Payments • 100% Student Verified</span>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <LocationModal />
      <BecomeSellerModal />
      <ProductDetailModal />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        onSuccessLogin={loginUser}
        initialTab={authInitialTab}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        user={currentUser}
        onSignOut={logoutUser}
      />
    </div>
  )
}
