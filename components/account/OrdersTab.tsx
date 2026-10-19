'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Package,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  MessageSquare,
  Star,
  MapPin,
  ChevronRight,
  ExternalLink,
  Printer,
  X
} from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { AccountOrder } from '@/lib/types'

type OrderTabFilter = 'All' | 'To Pay' | 'To Receive' | 'Completed' | 'Cancelled' | 'Returns'

export function OrdersTab() {
  const {
    orders,
    cancelOrder,
    reorderItems,
    submitOrderReview,
    showToast,
  } = useBup()

  const [activeTab, setActiveTab] = useState<OrderTabFilter>('All')
  const [selectedOrder, setSelectedOrder] = useState<AccountOrder | null>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const tabs: OrderTabFilter[] = ['All', 'To Pay', 'To Receive', 'Completed', 'Cancelled', 'Returns']

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return orders
    return orders.filter((o) => o.status === activeTab)
  }, [orders, activeTab])

  const getStatusBadge = (status: AccountOrder['status']) => {
    switch (status) {
      case 'To Receive':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <Clock className="size-3" /> To Receive
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3" /> Completed
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 border border-neutral-200">
            <XCircle className="size-3" /> Cancelled
          </span>
        )
      case 'Returns':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <RotateCcw className="size-3" /> Return Requested
          </span>
        )
      case 'To Pay':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
            <Clock className="size-3" /> Payment Due
          </span>
        )
      default:
        return null
    }
  }

  const handleOpenReview = (order: AccountOrder) => {
    setSelectedOrder(order)
    setReviewRating(5)
    setReviewComment('')
    setIsReviewModalOpen(true)
  }

  const handleSendReview = () => {
    if (!selectedOrder) return
    submitOrderReview(selectedOrder.id, {
      rating: reviewRating,
      comment: reviewComment,
    })
    setIsReviewModalOpen(false)
  }

  const handlePrintInvoice = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* TABS ROW */}
      <div className="rounded-2xl bg-white p-2 border border-neutral-200/90 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const count = tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#1f3a2e] text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-[#b5573a] text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
            <Package className="size-8" />
          </div>
          <h3 className="font-serif font-black text-lg text-neutral-900">
            No orders found in "{activeTab}"
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            Explore varsity merchandise, cafeteria menus, or textbook notes to place your first campus order.
          </p>
          <div className="mt-5">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
            >
              Browse Campus Marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden"
            >
              {/* Card Header: Seller + Order ID + Status */}
              <div className="p-4 bg-[#FAF5E9]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-white text-[#1f3a2e] border border-neutral-200 shadow-2xs">
                    <Store className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shop/${order.sellerSlug || 'bup-official-merch'}`}
                        className="font-bold text-xs sm:text-sm text-neutral-900 hover:text-[#1f3a2e] hover:underline flex items-center gap-1"
                      >
                        <span>{order.seller}</span>
                        <ExternalLink className="size-3 text-neutral-400" />
                      </Link>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Order #{order.id} • Placed {order.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items row */}
              <div className="p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-14 rounded-lg object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} × ৳{item.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900 font-serif">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer: Handover location + Actions */}
              <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <MapPin className="size-3.5 text-[#b5573a] shrink-0" />
                  <span>Pickup: <strong>{order.pickupLocation}</strong></span>
                  <span>•</span>
                  <span>Total: <strong className="text-[#b5573a] font-serif text-sm">৳{order.total}</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Details / Timeline */}
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    Track Order
                  </button>

                  {/* Chat with seller */}
                  <Link
                    href="/messages"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    <MessageSquare className="size-3.5 text-[#1f3a2e]" />
                    <span>Chat</span>
                  </Link>

                  {/* Reorder if completed or cancelled */}
                  {(order.status === 'Completed' || order.status === 'Cancelled') && (
                    <button
                      type="button"
                      onClick={() => reorderItems(order.id)}
                      className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-200"
                    >
                      Reorder
                    </button>
                  )}

                  {/* Write review if completed and not reviewed */}
                  {order.status === 'Completed' && !order.isReviewed && (
                    <button
                      type="button"
                      onClick={() => handleOpenReview(order)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] shadow-xs"
                    >
                      <Star className="size-3.5 fill-current text-amber-300" />
                      <span>Write Review</span>
                    </button>
                  )}

                  {order.isReviewed && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      ✓ Reviewed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDER TRACKING & DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Order Details</span>
                <h3 className="font-serif font-black text-lg text-neutral-900">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* TRACKING TIMELINE */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                Live Fulfillment Timeline
              </h4>
              <div className="relative flex items-center justify-between px-2">
                <div className="absolute left-6 right-6 top-3 h-0.5 bg-neutral-200 -z-0" />
                <div
                  className="absolute left-6 top-3 h-0.5 bg-[#1f3a2e] transition-all duration-300 -z-0"
                  style={{ width: `${(selectedOrder.trackingStep / 3) * 100}%` }}
                />

                {['Confirmed', 'Packed', 'Ready/Shipped', 'Delivered'].map((step, idx) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                        selectedOrder.trackingStep >= idx
                          ? 'bg-[#1f3a2e] text-white shadow-xs'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {selectedOrder.trackingStep >= idx ? '✓' : idx + 1}
                    </div>
                    <span className="mt-1 text-[11px] font-semibold text-neutral-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller & Handover Info */}
            <div className="rounded-xl bg-[#FAF5E9] p-4 text-xs space-y-2 border border-[#213527]/10">
              <div className="flex justify-between">
                <span className="text-neutral-500">Seller Shop:</span>
                <Link
                  href={`/shop/${selectedOrder.sellerSlug || 'bup-official-merch'}`}
                  className="font-bold text-[#1f3a2e] hover:underline"
                >
                  {selectedOrder.seller}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Handover Location:</span>
                <span className="font-semibold text-neutral-900">{selectedOrder.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Selected:</span>
                <span className="font-semibold text-neutral-900">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Billed:</span>
                <span className="font-bold text-[#b5573a] text-sm">৳{selectedOrder.total}</span>
              </div>
            </div>

            {/* Actions: Invoice + Cancel/Return */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                <Download className="size-3.5 text-[#1f3a2e]" />
                <span>Download Invoice PDF</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.status === 'To Receive' && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelOrder(selectedOrder.id, 'Buyer requested cancellation')
                      setSelectedOrder(null)
                    }}
                    className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Cancel Order
                  </button>
                )}
                {selectedOrder.status === 'Completed' && (
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Return request submitted for seller review.')
                      setSelectedOrder(null)
                    }}
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
                  >
                    Request Return
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-6 text-[#392525]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-serif font-black text-2xl text-[#1f3a2e]">BUPCommon</h2>
                <p className="text-xs text-neutral-500">Official Campus Marketplace Invoice</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-neutral-900">{selectedOrder.invoiceId}</span>
                <p className="text-[11px] text-neutral-400">Date: {selectedOrder.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Seller</span>
                <p className="font-bold text-neutral-800">{selectedOrder.seller}</p>
                <p className="text-neutral-500">Campus Pickup Desk: {selectedOrder.pickupLocation}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Payment</span>
                <p className="font-bold text-neutral-800">{selectedOrder.paymentMethod}</p>
                <p className="text-emerald-700 font-bold uppercase">PAID & VERIFIED</p>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y text-xs">
              <div className="p-2.5 bg-neutral-50 font-bold flex justify-between">
                <span>Item</span>
                <span>Subtotal</span>
              </div>
              {selectedOrder.items.map((i) => (
                <div key={i.id} className="p-2.5 flex justify-between">
                  <span>{i.name} (×{i.quantity})</span>
                  <span className="font-bold">৳{i.price * i.quantity}</span>
                </div>
              ))}
              <div className="p-3 bg-[#FAF5E9] font-bold text-sm flex justify-between text-[#1f3a2e]">
                <span>Total Amount</span>
                <span className="font-serif font-black text-[#b5573a]">৳{selectedOrder.total}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a]"
              >
                <Printer className="size-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isReviewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-neutral-900">
                Rate Seller & Product
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 text-neutral-400 hover:bg-neutral-100 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Your feedback helps fellow BUPians identify prompt and reliable campus sellers.
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Star Rating</label>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`size-6 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-sm text-neutral-700">{reviewRating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Your Review</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience (e.g. pristine condition, fast handover at Cafe Lake)..."
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-3.5 py-1.5 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReview}
                className="rounded-lg bg-[#1f3a2e] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
