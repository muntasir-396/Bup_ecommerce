'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
  MapPin,
  Clock,
  CreditCard,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Truck
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { useBup } from '@/context/BupContext'
import { isValidBdPhone } from '@/components/account/ProfileTab'

export default function SellerSetupPage() {
  const router = useRouter()
  const { currentUser, updateUserProfile, updateSellerProfile, showToast, openAuth } = useBup()

  const [step, setStep] = useState(1)

  // Step 1: Shop Identity
  const [shopName, setShopName] = useState(currentUser?.name ? `${currentUser.name}'s Campus Store` : '')
  const [slug, setSlug] = useState(currentUser?.username ? `${currentUser.username}-shop` : 'campus-store')
  const [tagline, setTagline] = useState('Quality campus verified textbooks, tech accessories & varsity merchandise.')
  const [description, setDescription] = useState('Serving BUP students with authentic items and quick handovers across Mirpur Cantonment campus.')
  const [logo, setLogo] = useState(
    currentUser?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  )
  const [banner, setBanner] = useState(
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
  )

  // Step 2: Seller Type & Categories
  const [sellerType, setSellerType] = useState<'Student' | 'Faculty' | 'Staff' | 'Stall Vendor' | 'Canteen'>('Student')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Varsity Merch',
    'Books & Notes'
  ])

  // Step 3: Pickup & Delivery
  const [selectedPickupPoints, setSelectedPickupPoints] = useState<string[]>([
    'Cafe Lake Promenade',
    'FST Ground Floor lobby'
  ])
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true)
  const [deliveryFee, setDeliveryFee] = useState<number>(0)
  const [prepTime, setPrepTime] = useState('20 mins')
  const [hoursSunThu, setHoursSunThu] = useState('09:00 AM - 05:00 PM')
  const [hoursFriSat, setHoursFriSat] = useState('10:00 AM - 02:00 PM')

  // Step 4: Payout & Terms
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [accountHolder, setAccountHolder] = useState(currentUser?.name || '')
  const [payoutNumber, setPayoutNumber] = useState(currentUser?.phone || '')
  const [otpInput, setOtpInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const allCategories = [
    'Varsity Merch',
    'Books & Notes',
    'Canteen & Dining',
    'Coffee & Snacks',
    'Stationery',
    'Electronics',
    'Stall Spaces',
    'Services'
  ]

  const availablePickupPoints = [
    'Cafe Lake Promenade',
    'Central Canteen Counter A',
    'FST Ground Floor lobby',
    'FBS Dean Office Front',
    'Library Annex 1st Floor',
    'BUP Main Gate Mirpur 12',
    'Auditorium Plaza Stairs',
    'Mirpur DOHS Hall Gate'
  ]

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const togglePickupPoint = (point: string) => {
    setSelectedPickupPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    )
  }

  // Handle Slug generation
  const handleShopNameChange = (val: string) => {
    setShopName(val)
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated || 'shop')
  }

  const handleSendPayoutOtp = () => {
    if (!isValidBdPhone(payoutNumber)) {
      setPhoneError('Please enter a valid 11-digit BD number (+8801XXXXXXXXX or 01XXXXXXXXX)')
      return
    }
    setPhoneError(null)
    setOtpSent(true)
    showToast(`Verification OTP sent to ${payoutNumber} (Enter 829104 for demo)`)
  }

  const handleCompleteSetup = () => {
    if (!agreeTerms) {
      showToast('Please agree to the BUP Student Marketplace Terms to continue.')
      return
    }
    if (!otpSent || otpInput.trim() !== '829104') {
      showToast('Please verify your payout wallet with the OTP code 829104.')
      return
    }

    // Save seller profile
    updateSellerProfile({
      id: `seller-${Date.now()}`,
      userId: currentUser?.id || 'user-1',
      shopName,
      slug,
      logo,
      banner,
      tagline,
      description,
      sellerType,
      categories: selectedCategories,
      pickupPoints: selectedPickupPoints,
      openingHours: {
        'Sun - Thu': hoursSunThu,
        'Fri - Sat': hoursFriSat,
      },
      deliveryFee,
      prepTime,
      phone: payoutNumber,
      pickupLocation: selectedPickupPoints[0] || 'Cafe Lake Promenade',
      payoutMethod,
      payoutNumber,
      vacationUntil: null,
      verificationLevel: currentUser?.isBupVerified ? 'BUP_VERIFIED' : 'EMAIL_VERIFIED',
      policy: 'Handover inspection welcomed at pickup point. 48-hour return window for item discrepancies.',
      announcement: `Welcome to ${shopName}! Official BUP campus partner.`,
      rating: 5.0,
      totalSales: 0,
      balance: 0,
      followersCount: 1,
      responseRate: 100,
      avgResponseTime: 'Under 10 mins',
      onTimeDeliveryRate: 100,
      memberSince: 'October 2026',
      isTrusted: Boolean(currentUser?.isBupVerified),
    })

    updateUserProfile({
      isSeller: true,
      sellerSlug: slug,
    })

    showToast(`🎉 Seller Hub activated for "${shopName}"!`)
    router.push('/seller')
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
        <Header />
        <CategoryBar />
        <main className="mx-auto max-w-md w-full flex-1 px-4 py-16 flex items-center justify-center">
          <div className="w-full rounded-2xl bg-white p-8 text-center border border-neutral-200 shadow-sm space-y-4">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#1f3a2e]/10 text-[#1f3a2e]">
              <Store className="size-8" />
            </div>
            <h1 className="font-serif text-2xl font-black text-neutral-900">
              Sign In to Open a Campus Shop
            </h1>
            <p className="text-xs text-neutral-600">
              Every registered BUP student can sell varsity gear, books, snacks, or services.
            </p>
            <button
              onClick={() => openAuth('bup')}
              className="w-full rounded-lg bg-[#1f3a2e] py-2.5 text-xs font-bold text-white hover:bg-[#b5573a]"
            >
              Sign In with BUP ID
            </button>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  const stepTitles = [
    'Shop Identity & URL',
    'Seller Type & Categories',
    'Campus Pickup & Delivery',
    'Payout Wallet & Agreement'
  ]

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-3xl w-full flex-1 px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-[#1f3a2e]">Account</Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Seller Onboarding</span>
        </div>

        {/* ONBOARDING HEADER & PROGRESS BAR */}
        <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b5573a]">
                Step {step} of 4: {stepTitles[step - 1]}
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-black text-neutral-900">
                Setup Your Campus Shop
              </h1>
            </div>
            <span className="rounded-full bg-[#FAF5E9] px-3 py-1 text-xs font-bold text-[#1f3a2e] border border-[#213527]/10">
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1f3a2e] to-[#b5573a] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: SHOP IDENTITY */}
        {step === 1 && (
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in">
            <div className="border-b pb-3">
              <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
                <Store className="size-5 text-[#1f3a2e]" />
                <span>1. Shop Identity & Campus URL</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Choose a memorable name and custom URL slug for your public shop page
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => handleShopNameChange(e.target.value)}
                  placeholder="e.g. Muntasir Tech & Book Exchange"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Public Shop URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 overflow-hidden">
                  <span className="px-3 text-neutral-400 font-mono text-[11px] bg-neutral-100 py-2.5 border-r border-neutral-300">
                    /shop/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    placeholder="my-campus-store"
                    className="flex-1 bg-transparent p-2.5 font-mono text-xs text-neutral-900 focus:outline-hidden"
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 font-mono">
                  Live URL: https://bupcommon.edu.bd/shop/<strong>{slug || 'your-slug'}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Tagline (Short Headline)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Verified engineering notes, graphing calculators & winter hoodies"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Shop Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your items, handover timing, and quality guarantees..."
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  if (!shopName.trim() || !slug.trim()) {
                    showToast('Please enter both shop name and URL slug.')
                    return
                  }
                  setStep(2)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                <span>Continue: Seller Type</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELLER TYPE & CATEGORIES */}
        {step === 2 && (
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in">
            <div className="border-b pb-3">
              <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
                <Sparkles className="size-5 text-[#1f3a2e]" />
                <span>2. Seller Type & Categories</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Help campus peers find your listings in the right departments
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-2">Seller Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Student', 'Faculty', 'Staff', 'Stall Vendor', 'Canteen'] as const).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSellerType(type)}
                        className={`p-3 rounded-xl border text-center font-bold transition-all ${
                          sellerType === type
                            ? 'border-[#1f3a2e] bg-[#1f3a2e] text-white shadow-xs'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-2">
                  Categories You Plan to Sell (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#1f3a2e] text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedCategories.length === 0) {
                    showToast('Please select at least one category.')
                    return
                  }
                  setStep(3)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                <span>Continue: Pickup & Delivery</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PICKUP & DELIVERY */}
        {step === 3 && (
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in">
            <div className="border-b pb-3">
              <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
                <MapPin className="size-5 text-[#b5573a]" />
                <span>3. Campus Pickup Points & Operating Hours</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Where and when students can meet you for handovers
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-2">
                  Campus Handover Points (Select your preferred locations)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availablePickupPoints.map((point) => {
                    const isSelected = selectedPickupPoints.includes(point)
                    return (
                      <button
                        key={point}
                        type="button"
                        onClick={() => togglePickupPoint(point)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-[#1f3a2e] bg-[#FAF5E9] text-[#1f3a2e]'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{point}</span>
                        {isSelected && <span className="font-bold text-[#1f3a2e]">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Typical Preparation / Assembly Time
                  </label>
                  <select
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900"
                  >
                    <option value="15 mins">15 mins (Quick snacks / in-stock notes)</option>
                    <option value="30 mins">30 mins (Standard campus handover)</option>
                    <option value="1 hour">1 hour</option>
                    <option value="Same Day">Same Day (Between classes)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Delivery Fee (৳ 0 = Free on campus)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Sun - Thu Hours (Class Days)
                  </label>
                  <input
                    type="text"
                    value={hoursSunThu}
                    onChange={(e) => setHoursSunThu(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Fri - Sat Hours (Weekend / Club Days)
                  </label>
                  <input
                    type="text"
                    value={hoursFriSat}
                    onChange={(e) => setHoursFriSat(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedPickupPoints.length === 0) {
                    showToast('Please select at least one pickup point.')
                    return
                  }
                  setStep(4)
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                <span>Continue: Payout & Terms</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYOUT & CONFIRMATION */}
        {step === 4 && (
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in">
            <div className="border-b pb-3">
              <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
                <CreditCard className="size-5 text-[#1f3a2e]" />
                <span>4. Mobile Payout Wallet & Agreement</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Earnings from student orders will be paid directly to your verified MFS wallet
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Payout Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bkash')}
                    className={`py-2 rounded-lg border text-center font-bold transition-all ${
                      payoutMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    bKash Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('nagad')}
                    className={`py-2 rounded-lg border text-center font-bold transition-all ${
                      payoutMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Nagad Wallet
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="e.g. Muntasir Mamun"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  MFS Wallet Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={payoutNumber}
                  onChange={(e) => {
                    setPayoutNumber(e.target.value)
                    setPhoneError(null)
                  }}
                  placeholder="017XXXXXXXX"
                  className={`w-full rounded-lg border p-2.5 font-mono text-neutral-900 focus:outline-hidden ${
                    phoneError ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-300 focus:border-[#1f3a2e]'
                  }`}
                />
                {phoneError && <p className="text-[10px] text-rose-600 mt-1">{phoneError}</p>}
              </div>

              {/* OTP confirmation box */}
              <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10 space-y-3">
                <span className="font-bold text-[#1f3a2e] block">
                  Verify MFS Wallet Ownership
                </span>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendPayoutOtp}
                    className="rounded-lg bg-[#1f3a2e] px-4 py-2 font-bold text-white hover:bg-[#b5573a] transition-colors"
                  >
                    Send OTP to {payoutNumber || 'Wallet'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-emerald-800">
                      OTP code sent! Enter <strong>829104</strong> to confirm.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="829104"
                      className="w-48 rounded-lg border border-neutral-300 p-2 font-mono font-bold tracking-widest text-center text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#1f3a2e] focus:ring-[#1f3a2e]"
                />
                <span className="text-neutral-600 text-xs leading-relaxed">
                  I accept the <strong>BUPCommon Student Seller Code of Conduct</strong>: I agree to honest item descriptions, punctual campus lake/canteen handovers, zero prohibited items, and standard 5% campus welfare commission on completed orders.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleCompleteSetup}
                disabled={!agreeTerms}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-md disabled:opacity-50"
              >
                <CheckCircle2 className="size-4" />
                <span>Activate Seller Hub</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
