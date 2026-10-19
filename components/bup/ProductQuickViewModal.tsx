'use client'

import React, { useState } from 'react'
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  Share2
} from 'lucide-react'
import { Product } from '@/lib/types'

interface ProductQuickViewModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductQuickViewModal({
  product,
  onClose,
  onAddToCart,
}: ProductQuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    onAddToCart(product, quantity)
    setAddedNotice(true)
    setTimeout(() => {
      setAddedNotice(false)
      onClose()
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-[#FAF5E9] shadow-2xl text-[#392525] border border-[#392525]/15 grid md:grid-cols-2">
        
        {/* Product Image */}
        <div className="relative h-64 md:h-full bg-stone-200">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 rounded-full bg-[#E3E890] px-3 py-1 text-xs font-bold text-[#392525] shadow-md">
              {product.tag}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/80 text-[#392525] hover:bg-white transition-colors"
            aria-label="Close product view"
          >
            <X className="size-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#728383]">
                {product.category}
              </span>
              <span className="text-xs text-[#728383]">•</span>
              <span className="text-[11px] font-semibold text-[#B25D3E]">
                {product.sellerType}
              </span>
            </div>

            <h3 id="product-detail-title" className="mt-2 font-serif text-2xl font-bold leading-tight">
              {product.name}
            </h3>

            {/* Rating and Seller */}
            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="size-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-[#728383] font-normal">({product.reviewsCount} reviews)</span>
              </div>
              <span className="text-[#728383]">|</span>
              <span className="text-[#3E4734] font-medium">By {product.seller}</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#B25D3E]">৳{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm line-through text-[#728383]">৳{product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs leading-5 text-[#3E4734]/80">
              {product.description}
            </p>

            {/* Delivery indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-[#213527] font-semibold bg-[#213527]/5 p-2.5 rounded-xl border border-[#213527]/10">
              <Clock className="size-4 shrink-0 text-[#213527]" />
              <span>Campus Delivery: {product.deliveryTime}</span>
            </div>
          </div>

          {/* Add to Bag Controls */}
          <div className="mt-6 pt-4 border-t border-[#392525]/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-[#392525]/20 bg-white px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#392525] hover:text-[#B25D3E]"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#392525] hover:text-[#B25D3E]"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#392525] px-6 py-3.5 text-sm font-bold text-[#FAF5E9] shadow-md transition-all hover:bg-[#201414] active:scale-95"
              >
                {addedNotice ? (
                  <span className="inline-flex items-center gap-2 text-[#E3E890]">
                    <CheckCircle2 className="size-4" /> Added to Bag!
                  </span>
                ) : (
                  <>
                    <ShoppingBag className="size-4" />
                    <span>Add to Bag • ৳{product.price * quantity}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
