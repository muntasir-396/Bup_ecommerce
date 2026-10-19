'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Store,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Save,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Lock,
  PauseCircle,
  Truck,
  ArrowRight
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { useBup } from '@/context/BupContext'

export default function SellerProfilePage() {
  const { currentUser, updateSellerProfile, showToast } = useBup()

  const seller = currentUser?.sellerProfile

  // Editable Form State
  const [shopName, setShopName] = useState(seller?.shopName || 'Campus Shop')
  const [tagline, setTagline] = useState(seller?.tagline || '')
  const [description, setDescription] = useState(seller?.description || '')
  const [announcement, setAnnouncement] = useState(seller?.announcement || '')
  const [policy, setPolicy] = useState(seller?.policy || '')
  const [prepTime, setPrepTime] = useState(seller?.prepTime || '20 mins')
  const [deliveryFee, setDeliveryFee] = useState<number>(seller?.deliveryFee || 0)

  // Vacation Mode
  const [isVacationActive, setIsVacationActive] = useState(Boolean(seller?.vacationUntil))
  const [vacationDate, setVacationDate] = useState(seller?.vacationUntil || '2026-11-01')

  const handleSaveProfile = () => {
    updateSellerProfile({
      shopName,
      tagline,
      description,
      announcement,
      policy,
      prepTime,
      deliveryFee,
      vacationUntil: isVacationActive ? vacationDate : null,
    })
    showToast('Seller profile and shop policies updated!')
  }

  // Verification Levels
  const levels = [
    {
      level: 'EMAIL_VERIFIED',
      title: 'Email Verified',
      unlocked: true,
      perks: ['Can create up to 5 listings', 'Standard 48-hr admin moderation'],
    },
    {
      level: 'BUP_VERIFIED',
      title: 'BUP Student Verified',
      unlocked: Boolean(currentUser?.isBupVerified),
      perks: ['Verified Student badge on listings', 'Auto-approval for textbook notes', '5% campus fee discount'],
    },
    {
      level: 'TRUSTED_SELLER',
      title: 'Trusted Seller',
      unlocked: (seller?.totalSales || 0) >= 10 && (seller?.rating || 0) >= 4.5,
      perks: ['Instant 1-second auto-publish', 'Zero platform commission during campus exam week', 'Featured search boost badge'],
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-5xl w-full flex-1 px-4 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
            <span>/</span>
            <Link href="/seller" className="hover:text-[#1f3a2e]">Seller Hub</Link>
            <span>/</span>
            <span className="font-semibold text-neutral-900">Shop Profile & Settings</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${seller?.slug || 'muntasir-tech-books'}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-2xs"
            >
              <ExternalLink className="size-3.5 text-[#1f3a2e]" />
              <span>View Public Shop</span>
            </Link>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
            >
              <Save className="size-3.5" />
              <span>Save Shop Settings</span>
            </button>
          </div>
        </div>

        {/* SELLER STATS CARD */}
        <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="relative size-12 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                <img
                  src={
                    seller?.logo ||
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={shopName}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-lg text-neutral-900">{shopName}</h1>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    {seller?.sellerType || 'Student'} Seller
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Slug: /shop/{seller?.slug || 'my-shop'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-neutral-400">Available Payout Balance</span>
              <p className="font-serif font-black text-xl text-[#b5573a]">৳{seller?.balance || 8450}</p>
            </div>
          </div>

          {/* Stats Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">Rating</span>
              <div className="font-serif font-black text-base text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{seller?.rating || 4.9}</span>
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">Total Sales</span>
              <span className="font-serif font-black text-base text-neutral-900 block mt-0.5">
                {seller?.totalSales || 142} orders
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">Response Rate</span>
              <span className="font-serif font-black text-base text-emerald-700 block mt-0.5">
                {seller?.responseRate || 98}%
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">Avg Response</span>
              <span className="font-serif font-black text-base text-neutral-900 block mt-0.5">
                {seller?.avgResponseTime || '< 15 mins'}
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">On-Time Handover</span>
              <span className="font-serif font-black text-base text-neutral-900 block mt-0.5">
                {seller?.onTimeDeliveryRate || 99}%
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF5E9]/60 p-3 border border-[#213527]/10">
              <span className="text-[11px] text-neutral-500 block">Member Since</span>
              <span className="font-bold text-xs text-neutral-700 block mt-1">
                {seller?.memberSince || 'March 2023'}
              </span>
            </div>
          </div>
        </div>

        {/* VERIFICATION LEVELS CARD */}
        <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-700" />
              <span>Campus Seller Verification Tier Progression</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Level up through verified student credentials and reliable order handovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map((lvl, idx) => (
              <div
                key={lvl.level}
                className={`rounded-xl p-4 border space-y-3 relative ${
                  lvl.unlocked
                    ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-200'
                    : 'bg-neutral-50 border-neutral-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Tier {idx + 1}
                  </span>
                  {lvl.unlocked ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="rounded bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600 flex items-center gap-1">
                      <Lock className="size-3" /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-black text-sm text-neutral-900">{lvl.title}</h3>
                </div>

                <ul className="text-xs space-y-1.5 text-neutral-600">
                  {lvl.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* VACATION MODE & ANNOUNCEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vacation Mode */}
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <PauseCircle className="size-4 text-amber-600" />
                <h3 className="font-serif font-black text-sm text-neutral-800">
                  Vacation Mode (Pause Shop)
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVacationActive}
                  onChange={(e) => setIsVacationActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1f3a2e]" />
              </label>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Going home for semester break or studying for finals? Vacation mode keeps your shop visible, displays a banner, and pauses checkout until you return.
            </p>

            {isVacationActive && (
              <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 space-y-2 text-xs">
                <label className="block font-bold text-amber-900">
                  Expected Campus Return Date:
                </label>
                <input
                  type="date"
                  value={vacationDate}
                  onChange={(e) => setVacationDate(e.target.value)}
                  className="rounded-lg border border-amber-300 bg-white p-2 text-xs text-neutral-900"
                />
              </div>
            )}
          </div>

          {/* Policy Violations / Warnings */}
          <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
            <div className="border-b pb-3 flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-700" />
              <h3 className="font-serif font-black text-sm text-neutral-800">
                Registry Policy Standing
              </h3>
            </div>
            <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-700" />
                <span>Zero Policy Violations • Clean Standing</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Your shop complies with all BUP University campus regulations. Prohibited item checks: passed.
              </p>
            </div>
            <p className="text-[11px] text-neutral-400">
              Maintained by BUP Proctorial Registry & Student Welfare Directorate.
            </p>
          </div>
        </div>

        {/* EDITABLE DETAILS: ANNOUNCEMENT & POLICIES */}
        <div className="rounded-2xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800">
              Shop Announcement & Return Policies
            </h3>
            <p className="text-xs text-neutral-500">Visible to all campus buyers on your shop page</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Shop Announcement Banner Text
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Fresh winter hoodies arrived! Pickup at FST lounge."
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Return & Refund Policy Text
              </label>
              <textarea
                rows={3}
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="e.g. In-person inspection welcomed at Cafe Lake. 48-hour return window for any discrepancies."
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                <Save className="size-4" />
                <span>Save All Shop Details</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
