'use client'

import React, { useState } from 'react'
import {
  X,
  Star,
  ShieldCheck,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  Check,
  Share2
} from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { SellerCard } from '@/components/seller/SellerCard'

export function ProductDetailModal() {
  const {
    selectedProduct,
    closeProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    showToast,
    openCart,
    currentUser,
  } = useBup()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  if (!selectedProduct) return null

  const wishlisted = isWishlisted(selectedProduct.id)

  const galleryImages = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image]

  const discount = selectedProduct.discountPercent || (selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0)

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedQuantity)
  }

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedQuantity)
    closeProduct()
    openCart()
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      showToast('Product link copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-[#392525]">
        
        {/* Sticky Close Button */}
        <button
          onClick={closeProduct}
          className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-500 shadow-md hover:bg-white hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* LEFT: IMAGE GALLERY */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
              <img
                src={galleryImages[activeImageIndex] || selectedProduct.image}
                alt={selectedProduct.name}
                className="size-full object-cover transition-all duration-300"
              />

              {/* Tag pill */}
              {selectedProduct.tag && (
                <span className="absolute left-3 top-3 rounded bg-[#1f3a2e] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                  {selectedProduct.tag}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-400 shadow-xs hover:bg-white hover:text-rose-500 transition-colors"
              >
                <Heart
                  className={`size-5 ${
                    wishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail selector */}
            {galleryImages.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#1f3a2e] scale-95 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now */}
            {currentUser && ((selectedProduct as any).sellerId === currentUser.id || selectedProduct.seller === currentUser.name) ? (
              <div className="mt-6 rounded-lg bg-amber-50 p-3 text-center text-xs font-bold text-amber-800 border border-amber-200">
                You are the seller of this listing. Sellers cannot purchase their own items.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#b5573a] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#9c452b] transition-all active:scale-98"
                >
                  <ShoppingCart className="size-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#1f3a2e] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#15271f] transition-all active:scale-98"
                >
                  <Zap className="size-4 text-[#E3E890]" />
                  <span>Buy Now</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, PRICE, SPECS, SELLER & REVIEWS */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold uppercase tracking-wider">{selectedProduct.category}</span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-[#1f3a2e]">
                <Share2 className="size-3.5" />
                <span>Share</span>
              </button>
            </div>

            <h1 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {selectedProduct.name}
            </h1>

            {/* Rating and Verification */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded bg-[#388e3c] px-2 py-0.5 text-xs font-bold text-white">
                <span>{selectedProduct.rating}</span>
                <Star className="size-3 fill-current" />
              </div>
              <span className="text-xs text-neutral-500">
                {selectedProduct.reviewsCount} Campus Ratings & Reviews
              </span>
              {selectedProduct.isVerifiedSeller && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck className="size-3.5" /> BUP Verified
                </span>
              )}
            </div>

            {/* Price Block */}
            <div className="mt-4 rounded-xl bg-[#FAF5E9]/80 p-4 border border-[#213527]/10">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-black text-neutral-900">
                  ৳{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ৳{selectedProduct.originalPrice}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-[#388e3c]">
                    {discount}% off
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-600">
                Inclusive of all campus student subsidies & taxes.
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-neutral-300">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-neutral-900 min-w-8 text-center">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="size-3.5" /> In Stock on Campus
              </span>
            </div>

            {/* Delivery & Seller Highlights */}
            <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-[#1f3a2e] shrink-0" />
                <span>
                  Delivery: <strong>{selectedProduct.deliveryTime}</strong> (Free Handover)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#b5573a] shrink-0" />
                <span>
                  Seller: <strong>{selectedProduct.seller}</strong> ({selectedProduct.sellerType})
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Description
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Seller Information Card */}
            <SellerCard
              sellerId={(selectedProduct as any).sellerId || 'user-1'}
              sellerName={selectedProduct.seller}
              storeName={selectedProduct.seller}
              rating={selectedProduct.rating}
              itemsSold={selectedProduct.reviewsCount * 2 + 10}
              pickupLocation={(selectedProduct as any).pickupOption || selectedProduct.deliveryTime}
              isVerified={selectedProduct.isVerifiedSeller}
              listingId={selectedProduct.id}
              listingTitle={selectedProduct.name}
            />

            {/* Specifications Table */}
            {selectedProduct.specs && (
              <div className="mt-4 border-t border-neutral-100 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Specifications
                </h3>
                <div className="rounded-lg border border-neutral-200 divide-y divide-neutral-100 text-xs">
                  {Object.entries(selectedProduct.specs).map(([key, value]) => (
                    <div key={key} className="flex p-2">
                      <span className="w-1/3 text-neutral-500 font-medium">{key}</span>
                      <span className="w-2/3 text-neutral-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campus Reviews Preview */}
            {selectedProduct.reviewsList && selectedProduct.reviewsList.length > 0 && (
              <div className="mt-4 border-t border-neutral-100 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Student Reviews
                </h3>
                <div className="space-y-2">
                  {selectedProduct.reviewsList.map((rev) => (
                    <div key={rev.id} className="rounded-lg bg-neutral-50 p-2.5 text-xs border border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">{rev.author}</span>
                        <span className="text-[10px] text-neutral-400">{rev.date}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-amber-600">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="size-3 fill-current" />
                        ))}
                      </div>
                      <p className="mt-1 text-neutral-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
