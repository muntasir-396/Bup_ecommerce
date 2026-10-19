'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Share2, Sparkles, ArrowRight } from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { PRODUCTS } from '@/data/products'

export function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart, showToast } = useBup()

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))

  const handleShareWishlist = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      showToast('Wishlist link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
            <Heart className="size-5 fill-rose-500 text-rose-500" />
            <span>My Campus Wishlist ({wishlist.length})</span>
          </h2>
          <p className="text-xs text-neutral-500">Saved varsity gear, study notes, and canteen favorites</p>
        </div>

        {wishlist.length > 0 && (
          <button
            type="button"
            onClick={handleShareWishlist}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
          >
            <Share2 className="size-3.5 text-[#1f3a2e]" />
            <span>Share Wishlist</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-rose-50 text-rose-400 mb-3">
            <Heart className="size-8" />
          </div>
          <h3 className="font-serif font-black text-lg text-neutral-900">Your wishlist is empty</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
            Tap the heart on any varsity hoodie, textbook, or canteen meal to save it for later.
          </p>
          <div className="mt-5">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistedProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#1f3a2e]/30 transition-all"
              >
                <div>
                  <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute left-2.5 top-2.5 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {discount}% OFF
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Seller: <span className="font-semibold text-neutral-700">{product.seller}</span>
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-base font-black text-neutral-900">
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

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, 1)
                      toggleWishlist(product.id)
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1f3a2e] py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
