'use client'

import React, { use, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Store,
  ShieldCheck,
  Star,
  Package,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ArrowRight,
  Share2,
  Users,
  AlertTriangle,
  ThumbsUp,
  Flag,
  Calendar,
  X,
  PauseCircle,
  Truck,
  CheckCircle2
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { SEED_SELLER_PROFILES, SEED_USERS, generate100Listings } from '@/data/seed'
import { KNOWN_SELLER_SHOPS } from '@/data/accountMock'
import { ExtendedProduct, PRODUCTS } from '@/data/products'
import { useBup } from '@/context/BupContext'
import { SellerProfileData } from '@/lib/types'

export default function PublicShopPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = use(params)
  const identifier = resolvedParams.sellerId

  const {
    showToast,
    currentUser,
    followedShops,
    toggleFollowShop,
    isFollowingShop,
  } = useBup()

  const [activeTab, setActiveTab] = useState<'shop' | 'about' | 'reviews'>('shop')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('Prohibited item or misleading description')
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({
    'rev-1': 14,
    'rev-2': 8,
    'rev-3': 5,
  })

  // Lookup seller profile either by slug or by sellerId
  const seller: SellerProfileData = useMemo(() => {
    // 1. Direct match in KNOWN_SELLER_SHOPS
    if (KNOWN_SELLER_SHOPS[identifier]) {
      return KNOWN_SELLER_SHOPS[identifier]
    }

    // 2. Match currentUser's shop
    if (currentUser?.sellerProfile && (currentUser.sellerProfile.slug === identifier || currentUser.id === identifier)) {
      return currentUser.sellerProfile
    }

    // 3. Match by userId or storeName in SEED_SELLER_PROFILES
    const seedProfile = SEED_SELLER_PROFILES.find(
      (s) => s.userId === identifier || s.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === identifier
    ) || SEED_SELLER_PROFILES[0]

    return {
      id: seedProfile.id,
      userId: seedProfile.userId,
      shopName: seedProfile.storeName,
      slug: identifier,
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
      tagline: seedProfile.bio || 'Verified campus peer vendor on BUPCommon.',
      description: seedProfile.bio || 'Serving Mirpur Cantonment students with verified listings.',
      sellerType: 'Student',
      categories: ['Varsity Merch', 'Books & Notes', 'Stationery'],
      pickupPoints: [seedProfile.pickupLocation || 'Cafe Lake Promenade', 'FST Lobby'],
      openingHours: {
        'Sun - Thu': '09:00 AM - 05:00 PM',
        'Fri - Sat': '10:00 AM - 01:00 PM',
      },
      deliveryFee: 0,
      prepTime: '20 mins',
      phone: seedProfile.phone,
      pickupLocation: seedProfile.pickupLocation,
      payoutMethod: 'bkash',
      payoutNumber: seedProfile.payoutNumber,
      vacationUntil: null,
      verificationLevel: 'BUP_VERIFIED',
      policy: '48-hour return window for any discrepancies. Handover inspection encouraged.',
      announcement: `Welcome to ${seedProfile.storeName}! Certified BUP campus seller.`,
      rating: seedProfile.rating,
      totalSales: seedProfile.totalSales,
      balance: seedProfile.balance,
      followersCount: 184,
      responseRate: 98,
      avgResponseTime: '15 mins',
      onTimeDeliveryRate: 99,
      memberSince: 'March 2023',
      isTrusted: seedProfile.isTrusted,
    }
  }, [identifier, currentUser])

  const isFollowing = isFollowingShop(seller.slug)
  const isVacation = Boolean(seller.vacationUntil)

  // Listings for this seller
  const allListings = generate100Listings()
  const rawSellerListings = allListings.filter(
    (l) => l.sellerId === seller.userId || l.sellerId === identifier
  )

  const sellerProducts: ExtendedProduct[] = useMemo(() => {
    const list = rawSellerListings.length > 0 ? rawSellerListings : allListings.slice(0, 10)
    let mapped = list.map((l) => ({
      id: l.id,
      name: l.title,
      category: l.category,
      price: l.price,
      originalPrice: l.originalPrice,
      rating: l.rating,
      reviewsCount: l.reviewsCount,
      seller: seller.shopName,
      sellerSlug: seller.slug,
      sellerId: seller.userId,
      sellerType: 'Student Vendor' as const,
      isVerifiedSeller: true,
      image: l.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
      description: l.description,
      inStock: !isVacation && l.stock > 0,
      deliveryTime: l.deliveryTime,
      tag: isVacation ? 'On Vacation' : l.condition === 'NEW' ? 'Brand New' : 'Used – Good',
    }))

    // Filter by Category
    if (selectedCategory !== 'All') {
      mapped = mapped.filter((p) => p.category === selectedCategory)
    }

    // Sort
    if (sortBy === 'price-asc') mapped.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') mapped.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') mapped.sort((a, b) => b.rating - a.rating)

    return mapped
  }, [rawSellerListings, allListings, seller, isVacation, selectedCategory, sortBy])

  // Reviews Data
  const sampleReviews = [
    {
      id: 'rev-1',
      author: 'Tanvir Hossain (FST Intake 26)',
      rating: 5,
      date: '16 Oct 2026',
      comment: 'Super fast handover at Cafe Lake Promenade! The calculator was in mint condition and came with fresh batteries.',
      reply: 'Thanks Tanvir! Best of luck with your midterm exams.',
    },
    {
      id: 'rev-2',
      author: 'Sadia Rahman (FBS Intake 27)',
      rating: 5,
      date: '10 Oct 2026',
      comment: 'Official navy hoodie size matched perfectly. Fabric is 100% genuine BUP crest embroidery.',
      reply: 'Appreciate the feedback Sadia! Enjoy the winter season.',
    },
    {
      id: 'rev-3',
      author: 'Rafiqul Islam (FSSS)',
      rating: 4,
      date: '02 Oct 2026',
      comment: 'Great book condition. Arrived at pickup spot 5 mins late due to class overrun, but very polite seller.',
      reply: 'Apologies for the slight delay Rafiqul, professor held us late in lab! Thank you for your patience.',
    }
  ]

  const ratingBars = [
    { stars: 5, pct: 86, count: 122 },
    { stars: 4, pct: 10, count: 14 },
    { stars: 3, pct: 3, count: 4 },
    { stars: 2, pct: 1, count: 1 },
    { stars: 1, pct: 0, count: 1 },
  ]

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      showToast('Shop link copied to clipboard!')
    }
  }

  const handleVoteHelpful = (revId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1,
    }))
    showToast('Marked review as helpful.')
  }

  const handleReportSubmit = () => {
    setIsReportModalOpen(false)
    showToast('Report submitted to BUP Proctorial Registry for investigation.')
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-5 space-y-6">
        
        {/* VACATION MODE BANNER */}
        {isVacation && (
          <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/30 text-amber-900 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <PauseCircle className="size-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-xs sm:text-sm">
                  🏖️ Seller is Currently on Vacation
                </h3>
                <p className="text-xs text-amber-800">
                  Expected campus return: <strong>{seller.vacationUntil}</strong>. You can browse listings and chat, but checkout is temporarily paused.
                </p>
              </div>
            </div>
            <span className="rounded bg-amber-200/80 px-2.5 py-1 text-[11px] font-bold text-amber-900 shrink-0">
              Checkout Paused
            </span>
          </div>
        )}

        {/* SHOP HERO BANNER */}
        <div className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-44 sm:h-64 w-full bg-[#1f3a2e] overflow-hidden">
            <img
              src={seller.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80'}
              alt={seller.shopName}
              className="size-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Announcement Pill */}
            {seller.announcement && (
              <div className="absolute top-4 left-4 right-4 sm:right-auto inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-[#1f3a2e] shadow-md">
                <span className="size-2 rounded-full bg-[#b5573a] animate-pulse" />
                <span className="truncate">{seller.announcement}</span>
              </div>
            )}
          </div>

          {/* Shop Header Identity */}
          <div className="p-5 sm:p-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
              {/* Logo */}
              <div className="relative size-20 sm:size-24 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden shrink-0">
                <img
                  src={seller.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={seller.shopName}
                  className="size-full object-cover"
                />
              </div>

              {/* Action Buttons: Follow, Chat, Share, Report */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => toggleFollowShop(seller.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                    isFollowing
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      : 'bg-[#1f3a2e] text-white hover:bg-[#b5573a]'
                  }`}
                >
                  <Users className="size-3.5" />
                  <span>{isFollowing ? '✓ Following' : '+ Follow'}</span>
                </button>

                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-2xs"
                >
                  <MessageSquare className="size-3.5 text-[#1f3a2e]" />
                  <span>Chat</span>
                </Link>

                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-neutral-300 p-2 text-neutral-600 hover:bg-neutral-50"
                  title="Share Shop"
                >
                  <Share2 className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="rounded-lg border border-neutral-300 p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Report Shop"
                >
                  <Flag className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Shop Titles & Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900">
                  {seller.shopName}
                </h1>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-700" />
                  <span>{seller.verificationLevel === 'TRUSTED_SELLER' ? 'Trusted Campus Seller' : 'Verified Student Seller'}</span>
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                  {seller.sellerType}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
                {seller.tagline}
              </p>
            </div>

            {/* STATS ROW */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-neutral-100 pt-4 text-center">
              <div className="p-2">
                <span className="text-[11px] text-neutral-400 block">Rating</span>
                <div className="font-serif font-black text-base text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{seller.rating}</span>
                  <span className="text-xs text-neutral-400 font-normal">/5</span>
                </div>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-neutral-400 block">Followers</span>
                <span className="font-serif font-black text-base text-neutral-900 block mt-0.5">
                  {seller.followersCount + (isFollowing ? 1 : 0)}
                </span>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-neutral-400 block">Items Sold</span>
                <span className="font-serif font-black text-base text-neutral-900 block mt-0.5">
                  {seller.totalSales}
                </span>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-neutral-400 block">Response Time</span>
                <span className="font-bold text-xs text-emerald-700 block mt-1">
                  {seller.avgResponseTime || '15 mins'}
                </span>
              </div>
              <div className="p-2 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-neutral-400 block">Campus Member Since</span>
                <span className="font-bold text-xs text-neutral-700 block mt-1">
                  {seller.memberSince || 'March 2023'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: SHOP, ABOUT, REVIEWS */}
        <div className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="flex items-center border-b border-neutral-200 px-4">
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'shop'
                  ? 'border-[#1f3a2e] text-[#1f3a2e]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Shop Listings ({sellerProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'about'
                  ? 'border-[#1f3a2e] text-[#1f3a2e]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              About & Policies
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-[#1f3a2e] text-[#1f3a2e]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Campus Reviews ({sampleReviews.length})
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {/* TAB 1: SHOP LISTINGS */}
            {activeTab === 'shop' && (
              <div className="space-y-5">
                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['All', ...seller.categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          selectedCategory === cat
                            ? 'bg-[#1f3a2e] text-white shadow-2xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-400 font-semibold">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-lg border border-neutral-300 bg-white p-1.5 text-xs text-neutral-700"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Listings Grid */}
                {sellerProducts.length === 0 ? (
                  <div className="p-12 text-center text-xs text-neutral-500">
                    No listings found in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {sellerProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ABOUT & POLICIES */}
            {activeTab === 'about' && (
              <div className="space-y-6 text-xs max-w-3xl">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 mb-2">About This Shop</h3>
                  <p className="text-neutral-700 leading-relaxed text-xs sm:text-sm">
                    {seller.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10 space-y-2">
                    <span className="font-bold text-[#1f3a2e] flex items-center gap-1.5">
                      <MapPin className="size-4 text-[#b5573a]" />
                      <span>Campus Pickup Points</span>
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {seller.pickupPoints.map((pt) => (
                        <li key={pt} className="flex items-center gap-1.5">
                          <span className="size-1 rounded-full bg-[#1f3a2e]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10 space-y-2">
                    <span className="font-bold text-[#1f3a2e] flex items-center gap-1.5">
                      <Clock className="size-4 text-[#1f3a2e]" />
                      <span>Operating Handover Hours</span>
                    </span>
                    <div className="space-y-1 text-neutral-700">
                      {seller.openingHours &&
                        Object.entries(seller.openingHours).map(([days, hrs]) => (
                          <div key={days} className="flex justify-between">
                            <span className="font-medium">{days}:</span>
                            <span className="font-bold">{hrs}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {seller.policy && (
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 mb-1">
                      Return & Guarantee Policy
                    </h3>
                    <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      {seller.policy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REVIEWS & RATINGS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Breakdown Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl bg-neutral-50/70 p-6 border border-neutral-100">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-4xl sm:text-5xl font-black text-neutral-900">
                      {seller.rating}
                    </span>
                    <div className="mt-2 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="mt-1 text-xs text-neutral-500">
                      Based on {seller.totalSales} completed campus orders
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-1.5 text-xs">
                    {ratingBars.map((b) => (
                      <div key={b.stars} className="flex items-center gap-2">
                        <span className="w-12 text-neutral-600 font-semibold">{b.stars} stars</span>
                        <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${b.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-neutral-400">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {sampleReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-white p-4 border border-neutral-200 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">{rev.author}</span>
                        <span className="text-[11px] text-neutral-400">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-neutral-700 leading-relaxed">{rev.comment}</p>

                      {/* Seller reply */}
                      {rev.reply && (
                        <div className="ml-3 rounded-lg bg-[#FAF5E9] p-3 text-[11px] border border-[#213527]/10 space-y-0.5">
                          <span className="font-bold text-[#1f3a2e] flex items-center gap-1">
                            <Store className="size-3 text-[#b5573a]" />
                            {seller.shopName} (Seller):
                          </span>
                          <p className="text-neutral-700">{rev.reply}</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleVoteHelpful(rev.id)}
                          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-[11px]"
                        >
                          <ThumbsUp className="size-3.5" />
                          <span>Helpful ({helpfulVotes[rev.id] || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <ProductDetailModal />

      {/* REPORT SHOP MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-neutral-900">
                Report Shop to BUP Registry
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 text-neutral-400 hover:bg-neutral-100 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Flags are reviewed by the BUP Student Welfare Directorate and Proctorial team.
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Reason for Flag</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2 text-xs text-neutral-900"
              >
                <option value="Prohibited item or misleading description">Prohibited item or misleading description</option>
                <option value="Price gouging / unfair markup on university subsidized merch">Price gouging on subsidized merch</option>
                <option value="Unresponsive seller / missed pickup handovers">Unresponsive seller / missed handovers</option>
                <option value="Harassment or inappropriate behavior">Harassment or inappropriate behavior</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Submit Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
