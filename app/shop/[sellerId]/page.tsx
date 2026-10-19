'use client'

import React, { use } from 'react'
import Link from 'next/link'
import {
  Store,
  ShieldCheck,
  Star,
  Package,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  Share2
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { FloatingSellButton } from '@/components/seller/FloatingSellButton'
import { SEED_SELLER_PROFILES, SEED_USERS, generate100Listings } from '@/data/seed'
import { ExtendedProduct } from '@/data/products'
import { useBup } from '@/context/BupContext'

export default function PublicShopPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = use(params)
  const sellerId = resolvedParams.sellerId

  const { showToast, openAuth, currentUser } = useBup()

  const sellerProfile =
    SEED_SELLER_PROFILES.find((s) => s.userId === sellerId) || SEED_SELLER_PROFILES[0]
  const user = SEED_USERS.find((u) => u.id === sellerId) || SEED_USERS[0]

  const allListings = generate100Listings()
  const sellerListings = allListings.filter((l) => l.sellerId === sellerId)

  // Map to ExtendedProduct format for ProductCard
  const products: ExtendedProduct[] = (sellerListings.length > 0 ? sellerListings : allListings.slice(0, 8)).map(
    (l) => ({
      id: l.id,
      name: l.title,
      category: l.category,
      price: l.price,
      originalPrice: l.originalPrice,
      rating: l.rating,
      reviewsCount: l.reviewsCount,
      seller: sellerProfile.storeName,
      sellerType: 'Student Vendor',
      isVerifiedSeller: user.isBupVerified,
      image: l.images[0],
      description: l.description,
      inStock: l.stock > 0,
      deliveryTime: l.deliveryTime,
      tag: l.condition === 'NEW' ? 'Brand New' : 'Verified Pre-owned',
    })
  )

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      showToast('Shop link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-5">
        
        {/* SHOP BANNER CARD */}
        <section className="rounded-2xl bg-gradient-to-r from-[#1f3a2e] via-[#2a4d3c] to-[#12231b] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="grid size-16 sm:size-20 place-items-center rounded-2xl bg-[#E3E890] text-[#1f3a2e] font-serif text-3xl font-black shadow-md shrink-0">
                {sellerProfile.storeName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-black text-white">
                    {sellerProfile.storeName}
                  </h1>
                  {user.isBupVerified && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-[#E3E890] border border-[#E3E890]/30 px-2 py-0.5 text-xs font-bold">
                      <ShieldCheck className="size-3.5" /> Verified Student Seller
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 mt-1 max-w-xl leading-relaxed">
                  {sellerProfile.bio}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                  <span className="flex items-center gap-1 font-bold text-white">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span>{sellerProfile.rating} Store Rating</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Package className="size-4 text-[#E3E890]" />
                    <span>{sellerProfile.totalSales}+ Campus Orders Completed</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4 text-[#b5573a]" />
                    <span>{sellerProfile.pickupLocation}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors flex items-center gap-1.5"
              >
                <Share2 className="size-3.5" />
                <span>Share Shop</span>
              </button>

              <Link
                href={`/messages?sellerId=${sellerId}`}
                className="rounded-md bg-[#b5573a] px-4 py-2 text-xs font-bold text-white hover:bg-[#9c452b] transition-colors flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="size-3.5" />
                <span>Message Seller</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SHOP LISTINGS GRID */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Store Catalog ({products.length} items)
              </h2>
              <p className="text-xs text-neutral-500">All genuine items available for immediate campus pickup.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* STORE REVIEWS SECTION */}
        <section className="mt-10 rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs">
          <h3 className="font-serif text-lg font-bold text-neutral-900 mb-3">
            Campus Feedback & Student Experiences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { author: 'Tanvir A.', comment: 'Super fast delivery to FST lounge. Item exactly as described.', rating: 5, date: '2 days ago' },
              { author: 'Sadman S.', comment: 'High quality materials and friendly communication. 5/5 stars.', rating: 5, date: '1 week ago' },
              { author: 'Ayesha K.', comment: 'Very responsive seller! Solved notes were extremely clear.', rating: 5, date: '2 weeks ago' },
            ].map((rev, idx) => (
              <div key={idx} className="rounded-xl bg-[#FAF5E9]/60 p-4 border border-neutral-100 text-xs">
                <div className="flex items-center justify-between font-bold text-neutral-900">
                  <span>{rev.author}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 my-1.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <ProductDetailModal />
    </div>
  )
}
