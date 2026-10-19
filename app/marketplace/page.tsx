'use client'

import React, { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Star,
  Search,
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { AuthModal } from '@/components/bup/AuthModal'
import { UserProfileModal } from '@/components/bup/UserProfileModal'
import { PRODUCTS, ExtendedProduct } from '@/data/products'
import { useBup } from '@/context/BupContext'

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = searchParams.get('category') || 'All'
  const initialQuery = searchParams.get('q') || ''

  const { currentUser, isAuthOpen, closeAuth, loginUser, authInitialTab, isProfileModalOpen, closeProfileModal, logoutUser } = useBup()

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [priceRange, setPriceRange] = useState<number>(3000)
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)

  // Update category when URL changes
  React.useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
    const q = searchParams.get('q')
    if (q !== null) setSearchQuery(q)
  }, [searchParams])

  const categories = [
    'All',
    'Merch',
    'Dining & Canteen',
    'Coffee & Snacks',
    'Textbooks',
    'Books & Notes',
    'Electronics',
    'Stationery',
    'Services',
  ]

  const sellerTypes = [
    'BUP Official',
    'Student Society',
    'Student Vendor',
    'Campus Canteen',
    'Outside Partner',
  ]

  const toggleSellerType = (type: string) => {
    setSelectedSellerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const resetFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
    setSelectedSellerTypes([])
    setMinRating(0)
    setPriceRange(3000)
    setOnlyVerified(false)
    setSortBy('popularity')
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category match
      if (selectedCategory !== 'All') {
        const pCat = p.category.toLowerCase()
        const sCat = selectedCategory.toLowerCase()
        if (!pCat.includes(sCat) && !sCat.includes(pCat)) {
          // Special handle books/textbooks
          if (
            (sCat.includes('book') || sCat.includes('note')) &&
            (pCat.includes('book') || pCat.includes('textbook'))
          ) {
            // match
          } else {
            return false
          }
        }
      }

      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = p.name.toLowerCase().includes(q)
        const matchDesc = p.description.toLowerCase().includes(q)
        const matchSeller = p.seller.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchSeller) return false
      }

      // Seller Type match
      if (selectedSellerTypes.length > 0 && !selectedSellerTypes.includes(p.sellerType)) {
        return false
      }

      // Rating match
      if (minRating > 0 && p.rating < minRating) {
        return false
      }

      // Price match
      if (p.price > priceRange) {
        return false
      }

      // Only Verified match
      if (onlyVerified && !p.isVerifiedSeller) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      // Popularity default
      return b.reviewsCount - a.reviewsCount
    })
  }, [selectedCategory, searchQuery, selectedSellerTypes, minRating, priceRange, onlyVerified, sortBy])

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-5">
        
        {/* BREADCRUMB & TITLE */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
              <span>/</span>
              <span className="font-semibold text-neutral-900">Marketplace</span>
              {selectedCategory !== 'All' && (
                <>
                  <span>/</span>
                  <span className="font-bold text-[#b5573a]">{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="mt-1 font-serif text-xl sm:text-2xl font-black text-neutral-900">
              {selectedCategory === 'All' ? 'Campus Catalog' : selectedCategory}
              <span className="ml-2 text-xs sm:text-sm font-sans font-normal text-neutral-500">
                ({filteredProducts.length} items found)
              </span>
            </h1>
          </div>

          {/* Sort bar & Mobile filter button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold shadow-2xs hover:bg-neutral-50"
            >
              <SlidersHorizontal className="size-3.5 text-[#b5573a]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-1 text-xs">
              <span className="hidden sm:inline text-neutral-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated (★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs sticky top-24">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-900">
                <SlidersHorizontal className="size-4 text-[#b5573a]" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-[#b5573a] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Filter by Category */}
            <div className="mt-4 border-b border-neutral-100 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#1f3a2e] text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="size-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="mt-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-[#b5573a]">৳{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#1f3a2e]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>৳100</span>
                <span>৳3,000</span>
              </div>
            </div>

            {/* Seller Types */}
            <div className="mt-4 border-b border-neutral-100 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Seller Type
              </h3>
              <div className="space-y-1.5">
                {sellerTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-black"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSellerTypes.includes(type)}
                      onChange={() => toggleSellerType(type)}
                      className="rounded accent-[#1f3a2e]"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Rating */}
            <div className="mt-4 border-b border-neutral-100 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Min. Customer Rating
              </h3>
              <div className="space-y-1">
                {[4, 3, 0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                      minRating === stars
                        ? 'bg-[#FAF5E9] font-bold text-[#1f3a2e]'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {stars > 0 ? (
                      <div className="flex items-center gap-1 text-amber-600">
                        <span>{stars}★ & above</span>
                      </div>
                    ) : (
                      <span>All Ratings</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Only Verified */}
            <div className="mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded accent-[#1f3a2e]"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>BUP Verified Sellers Only</span>
                </span>
              </label>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <section>
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center border border-neutral-200">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
                  <Search className="size-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">No items match your filters</h3>
                <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing some filter options or adjusting your search term to see more campus offerings.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset all filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white p-5 h-full overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-bold text-sm text-neutral-900">Filters</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-black"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Mobile filters content */}
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-neutral-700 mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setIsMobileFilterOpen(false)
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded ${
                        selectedCategory === cat ? 'bg-[#1f3a2e] text-white font-bold' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <div className="flex justify-between font-bold mb-1">
                  <span>Max Price</span>
                  <span className="text-[#b5573a]">৳{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#1f3a2e]"
                />
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <button
                  onClick={() => {
                    resetFilters()
                    setIsMobileFilterOpen(false)
                  }}
                  className="w-full rounded bg-neutral-100 py-2 font-bold text-neutral-700"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full mt-2 rounded bg-[#1f3a2e] py-2 font-bold text-white"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5E9] flex items-center justify-center font-bold">Loading BUP Marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  )
}
