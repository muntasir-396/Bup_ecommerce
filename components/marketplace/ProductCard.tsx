'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Heart, ShieldCheck, ShoppingCart, Check } from 'lucide-react'
import { ExtendedProduct } from '@/data/products'
import { useBup } from '@/context/BupContext'

interface ProductCardProps {
  product: ExtendedProduct
  dense?: boolean
}

export function ProductCard({ product, dense = false }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart, openProduct } = useBup()
  const wishlisted = isWishlisted(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    addToCart(product, 1)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleWishlist(product.id)
  }

  // Calculate discount if not provided
  const discount = product.discountPercent || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0)

  return (
    <div
      onClick={() => openProduct(product)}
      className="group relative flex flex-col justify-between rounded-lg bg-white p-3 border border-neutral-200/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none"
    >
      {/* TOP: IMAGE & WISHLIST BUTTON & TAG */}
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Tag badge & Condition badge */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 items-start">
            {product.tag && (
              <span className="rounded bg-[#1f3a2e] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                {product.tag}
              </span>
            )}
            <span className="rounded bg-black/60 backdrop-blur-xs px-1.5 py-0.2 text-[9px] font-bold text-white shadow-2xs">
              {(product as any).condition
                ? (product as any).condition === 'NEW'
                  ? 'Brand New'
                  : (product as any).condition.replace(/_/g, ' ')
                : 'Campus Verified'}
            </span>
          </div>

          {/* Wishlist Heart button */}
          <button
            onClick={handleWishlistClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-neutral-400 shadow-xs hover:bg-white hover:text-rose-500 transition-colors"
          >
            <Heart
              className={`size-4 transition-colors ${
                wishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'
              }`}
            />
          </button>
        </div>

        {/* CONTENT DETAILS */}
        <div className="mt-2.5">
          {/* Verified Seller badge */}
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="text-neutral-500 font-medium truncate">
              {product.category}
            </span>
            {product.isVerifiedSeller ? (
              <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 shrink-0">
                <ShieldCheck className="size-3" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 truncate">
                {product.seller.slice(0, 16)}
              </span>
            )}
          </div>

          {/* Title (max 2 lines) */}
          <h3 className="font-sans text-xs sm:text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#b5573a] transition-colors">
            {product.name}
          </h3>

          {/* Rating Pill (green badge) */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-[#388e3c] px-1.5 py-0.5 text-[11px] font-bold text-white">
              <span>{product.rating}</span>
              <Star className="size-2.5 fill-current" />
            </span>
            <span className="text-[11px] text-neutral-400">
              ({product.reviewsCount})
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM: PRICE, MRP, DISCOUNT & QUICK ADD */}
      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-neutral-900">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-[11px] font-bold text-[#388e3c]">
              {discount}% off
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="rounded bg-[#1f3a2e] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-2xs active:scale-95 flex items-center gap-1"
          title="Add to campus bag"
        >
          <ShoppingCart className="size-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  )
}
