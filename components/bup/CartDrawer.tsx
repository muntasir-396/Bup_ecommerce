'use client'

import React, { useState } from 'react'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react'
import { CartItem, UserProfile } from '@/lib/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  currentUser: UserProfile | null
  onOpenAuth: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOpenAuth,
}: CartDrawerProps) {
  const [deliveryLocation, setDeliveryLocation] = useState('Central Library Ground Floor Study Zone')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'student-card' | 'cod'>('bkash')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null)

  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = subtotal > 1000 || (currentUser?.isBupVerified) ? 0 : 30
  const discount = currentUser?.isBupVerified ? Math.round(subtotal * 0.05) : 0 // 5% BUP Student discount
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount)

  const handlePlaceOrder = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      const orderId = `BUP-${Math.floor(100000 + Math.random() * 900000)}`
      setIsCheckingOut(false)
      setOrderConfirmed(orderId)
      onClearCart()
    }, 900)
  }

  const handleClose = () => {
    setOrderConfirmed(null)
    onClose()
  }

  const handleCloseSuccess = () => {
    setOrderConfirmed(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF5E9] shadow-2xl flex flex-col text-[#392525]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#392525]/15 bg-[#392525] px-6 py-5 text-[#FAF5E9]">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[#E3E890] text-[#392525]">
                <ShoppingBag className="size-5" />
              </span>
              <div>
                <h2 id="cart-title" className="font-serif text-xl font-bold">
                  BUP Campus Bag
                </h2>
                <p className="text-xs text-[#FAF5E9]/75">
                  {items.length} {items.length === 1 ? 'item' : 'items'} ready for order
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-[#FAF5E9]/80 hover:bg-white/10 hover:text-white"
              aria-label="Close cart"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {orderConfirmed ? (
              <div className="my-auto flex flex-col items-center justify-center py-10 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg">
                  <CheckCircle2 className="size-10" />
                </div>
                <span className="mt-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Order Received • Confirmed
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#392525]">
                  Thank you for your order!
                </h3>
                <p className="mt-2 text-sm text-[#3E4734]/80">
                  Your campus order reference code is:
                </p>
                <div className="mt-2 rounded-xl border border-dashed border-[#2d4734] bg-white px-5 py-2.5 font-mono text-xl font-bold text-[#2d4734] shadow-inner">
                  #{orderConfirmed}
                </div>
                <div className="mt-6 w-full rounded-2xl bg-white/70 p-4 text-left text-xs text-[#3E4734] space-y-2 border border-[#392525]/10">
                  <p><strong>Campus Drop-off:</strong> {deliveryLocation}</p>
                  <p><strong>Payment Mode:</strong> {paymentMethod.toUpperCase()}</p>
                  <p className="text-[11px] text-[#728383]">
                    The seller has received your notification. You will receive an SMS when your items arrive at the location.
                  </p>
                </div>
                <button
                  onClick={handleCloseSuccess}
                  className="mt-6 w-full rounded-full bg-[#392525] py-3.5 text-sm font-semibold text-[#FAF5E9] hover:bg-[#201414]"
                >
                  Back to Campus Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="grid size-20 place-items-center rounded-full bg-[#E3E890]/50 text-[#392525]">
                  <ShoppingBag className="size-10 opacity-70" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold">Your bag is empty</h3>
                <p className="mt-2 max-w-xs text-sm text-[#3E4734]/70">
                  Explore BUP winter hoodies, canteen platters, textbooks, or tech gadgets to fill your bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-[#392525] px-6 py-3 text-sm font-semibold text-[#FAF5E9] hover:bg-[#683226]"
                >
                  Explore Common Market
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Items List */}
                <div className="divide-y divide-[#392525]/10">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 py-4 first:pt-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="size-20 rounded-2xl object-cover shrink-0 border border-[#392525]/10"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-[#392525] leading-snug line-clamp-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-[#728383] hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-[#728383]">
                            Sold by {item.product.seller}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-serif text-base font-bold text-[#B25D3E]">
                            ৳{item.product.price * item.quantity}
                          </span>
                          <div className="flex items-center gap-2 rounded-full border border-[#392525]/20 bg-white px-2 py-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="text-[#392525] hover:text-[#B25D3E]"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#392525]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="text-[#392525] hover:text-[#B25D3E]"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Campus Delivery Location */}
                <div className="rounded-2xl border border-[#392525]/15 bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E4734]">
                    <MapPin className="size-4 text-[#B25D3E]" />
                    <span>Campus Drop-off / Delivery Point</span>
                  </div>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#392525]/20 bg-white p-2.5 text-xs font-semibold text-[#392525] outline-none"
                  >
                    <option value="Central Library Ground Floor Study Zone">Central Library Study Zone</option>
                    <option value="Faculty of Science & Tech (FST) Lounge">FST Ground Lounge</option>
                    <option value="Faculty of Business Studies (FBS) Atrium">FBS Atrium Corridor</option>
                    <option value="Central Canteen Table Counter">Central Canteen Main Table Counter</option>
                    <option value="BUP Lake Pavilion Gazebo">Lake Promenade Gazebo</option>
                    <option value="Vista Hall Dormitory Gate">Vista Hall Dormitory Front Gate</option>
                    <option value="Campus Main Gate (Mirpur-12)">BUP Main Gate (Mirpur Cantonment)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Specific room or contact instructions (optional)"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#392525]/20 bg-white p-2.5 text-xs outline-none"
                  />
                </div>

                {/* Payment Methods */}
                <div className="rounded-2xl border border-[#392525]/15 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#3E4734]">
                    Payment Mode
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 transition-all ${
                        paymentMethod === 'bkash'
                          ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]'
                          : 'border-[#392525]/20 bg-white text-[#392525]'
                      }`}
                    >
                      <Smartphone className="size-4" />
                      <span>bKash Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('student-card')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 transition-all ${
                        paymentMethod === 'student-card'
                          ? 'border-[#2d4734] bg-[#2d4734]/10 text-[#2d4734]'
                          : 'border-[#392525]/20 bg-white text-[#392525]'
                      }`}
                    >
                      <CreditCard className="size-4" />
                      <span>BUP ID Smart Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 transition-all ${
                        paymentMethod === 'nagad'
                          ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]'
                          : 'border-[#392525]/20 bg-white text-[#392525]'
                      }`}
                    >
                      <Smartphone className="size-4" />
                      <span>Nagad Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#392525] bg-[#392525]/10 text-[#392525]'
                          : 'border-[#392525]/20 bg-white text-[#392525]'
                      }`}
                    >
                      <Building className="size-4" />
                      <span>Cash on Campus</span>
                    </button>
                  </div>
                </div>

                {/* BUP Verification Perks Notice */}
                {currentUser?.isBupVerified ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                    <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong>BUP Verified Student Discount:</strong> 5% discount + Free Campus Delivery applied automatically!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-[#E3E890]/40 border border-[#392525]/10 p-3 text-xs text-[#392525]">
                    <span>Are you a BUP student or faculty?</span>
                    <button
                      onClick={onOpenAuth}
                      className="font-bold text-[#B25D3E] underline"
                    >
                      Sign In for Discounts
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          {!orderConfirmed && items.length > 0 && (
            <div className="border-t border-[#392525]/15 bg-white/90 p-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#3E4734]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#392525]">৳{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>BUP Student Discount (5%)</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#3E4734]">
                  <span>Campus Delivery</span>
                  <span className="font-bold text-[#392525]">
                    {deliveryFee === 0 ? <span className="text-emerald-700 uppercase font-black">Free</span> : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#392525] pt-2 border-t border-[#392525]/10">
                  <span>Grand Total</span>
                  <span className="font-serif text-xl text-[#B25D3E]">৳{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#392525] py-4 text-sm font-bold text-[#FAF5E9] shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
              >
                {isCheckingOut ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing BUP Campus Order...
                  </span>
                ) : (
                  <>
                    <span>Confirm Order • ৳{finalTotal}</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
