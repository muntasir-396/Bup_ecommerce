'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Store,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Flame,
  Clock,
  Compass
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { BannerCarousel } from '@/components/marketplace/BannerCarousel'
import { PromoCardsRow } from '@/components/marketplace/PromoCardsRow'
import { ProductRow } from '@/components/marketplace/ProductRow'
import { TrustStrip } from '@/components/marketplace/TrustStrip'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { AuthModal } from '@/components/bup/AuthModal'
import { UserProfileModal } from '@/components/bup/UserProfileModal'
import { PRODUCTS, ExtendedProduct } from '@/data/products'
import { STALLS } from '@/data/stalls'
import { useBup } from '@/context/BupContext'

export default function HomePage() {
  const {
    currentUser,
    isAuthOpen,
    closeAuth,
    loginUser,
    authInitialTab,
    isProfileModalOpen,
    closeProfileModal,
    logoutUser,
    toastMessage,
    recentlyViewed,
  } = useBup()

  // Filter specific product sets for horizontal rows
  const dealsOfTheDay = PRODUCTS.filter((p) =>
    (p.discountPercent && p.discountPercent >= 18) || p.tag === 'Bestseller' || p.tag === 'Midterm Essential'
  )

  const varsityMerch = PRODUCTS.filter((p) => p.category === 'Merch')

  const studyNotesAndBooks = PRODUCTS.filter(
    (p) => p.category === 'Textbooks' || p.category === 'Books & Notes'
  )

  const canteenAndCoffee = PRODUCTS.filter(
    (p) => p.category === 'Dining & Canteen' || p.category === 'Coffee & Snacks'
  )

  const fallbackRecent = PRODUCTS.slice(0, 5)
  const displayRecentlyViewed = recentlyViewed.length > 0 ? recentlyViewed : fallbackRecent

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#1f3a2e]/20 bg-[#1f3a2e] px-5 py-3 text-xs font-semibold text-[#FAF5E9] shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Sparkles className="size-4 text-[#E3E890]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STICKY HEADER (Two rows) */}
      <Header />

      {/* HORIZONTAL CATEGORY STRIP */}
      <CategoryBar />

      {/* MAIN MARKETPLACE BODY */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-3 pb-24 md:pb-8">
        
        {/* 1. AUTO-SLIDING BANNER CAROUSEL */}
        <BannerCarousel />

        {/* 2. ROW OF 3-4 PROMO CARDS (AD TAG + MIN 30% OFF) */}
        <PromoCardsRow />

        {/* 3. HORIZONTAL-SCROLL PRODUCT ROWS */}
        {/* ROW A: DEALS OF THE DAY (WITH COUNTDOWN TIMER) */}
        <ProductRow
          title="Deals of the Day"
          subtitle="Time-sensitive campus specials & flash midterm discounts"
          viewAllLink="/marketplace?category=All"
          products={dealsOfTheDay}
          isDealsRow={true}
        />

        {/* ROW B: VARSITY MERCH */}
        <ProductRow
          title="Varsity Merch"
          subtitle="Official BUP winter hoodies, crest pins, neckties & sports caps"
          viewAllLink="/marketplace?category=Merch"
          products={varsityMerch}
        />

        {/* ROW C: STUDY NOTES & BOOKS */}
        <ProductRow
          title="Study Notes & Books"
          subtitle="Thomas Calculus, HBR case study digests & past solved midterms"
          viewAllLink="/marketplace?category=Textbooks"
          products={studyNotesAndBooks}
        />

        {/* ROW D: CANTEEN & COFFEE */}
        <ProductRow
          title="Canteen & Coffee"
          subtitle="Mustard bhuna khichuri, fresh ilish fry, cold brew & afternoon shingara"
          viewAllLink="/marketplace?category=Dining+%26+Canteen"
          products={canteenAndCoffee}
        />

        {/* LAKESIDE POP-UP STALLS TEASER BANNER */}
        <section className="my-5 rounded-2xl bg-gradient-to-r from-[#1f3a2e] via-[#2d5241] to-[#12231b] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#E3E890 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3E890] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1f3a2e] shadow-xs">
                <Store className="size-3 text-[#b5573a]" />
                Mirpur Cantonment Campus
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-black text-white">
                Book a Pop-up Stall Space on Central Lake
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                Over 4,500 daily students circulate around the lakeside boardwalk and faculty concourses. Reserve modular 3x3m spots for student clubs, exhibitions, or food stalls starting from ৳320/day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/stall-spaces"
                className="inline-flex items-center gap-2 rounded-lg bg-[#b5573a] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#9c452b] transition-all"
              >
                <Compass className="size-4" />
                <span>Explore Interactive Map</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ROW E: RECENTLY VIEWED / RECOMMENDED */}
        <ProductRow
          title="Recently Viewed & Recommended"
          subtitle="Picks tailored to your browsing and popular campus interests"
          viewAllLink="/marketplace?category=All"
          products={displayRecentlyViewed}
        />

        {/* 4. STUDENT ID VERIFIED SELLERS TRUST STRIP */}
        <TrustStrip />

      </main>

      {/* 5. FOOTER WITH LINK COLUMNS, SOCIAL & PAYMENT ICONS */}
      <Footer />

      {/* MOBILE-ONLY FIXED BOTTOM TAB BAR (<768px, removed on desktop) */}
      <BottomNav />

      {/* MODALS */}
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
