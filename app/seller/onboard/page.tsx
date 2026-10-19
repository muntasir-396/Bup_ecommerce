'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store,
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building,
  Phone
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { useBup } from '@/context/BupContext'

export default function SellerOnboardingPage() {
  const router = useRouter()
  const { currentUser, loginUser, showToast, openAuth } = useBup()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: Profile
  const [storeName, setStoreName] = useState(currentUser ? `${currentUser.name.split(' ')[0]}'s Campus Store` : '')
  const [department, setDepartment] = useState(currentUser?.department || 'Information & Communication Engineering (ICE)')
  const [bio, setBio] = useState('Senior engineering student offering verified study notes, textbooks, and campus essentials.')

  // Step 2: Pickup & Payout
  const [phone, setPhone] = useState(currentUser?.phone || '+880 1711 234567')
  const [pickupLocation, setPickupLocation] = useState('Faculty of Science & Technology (FST) Ground Floor Lobby')
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [payoutNumber, setPayoutNumber] = useState('01711234567')

  // Step 3: Terms agreement
  const [agreedToRules, setAgreedToRules] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
        <Header />
        <main className="mx-auto max-w-md w-full flex-1 px-4 py-16 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
            <Store className="size-12 text-[#b5573a] mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Sign in to Start Selling</h2>
            <p className="text-xs text-neutral-500 mt-2">
              Every BUP student and faculty member can sell on BUPCommon. Please sign in or register to enable your seller account.
            </p>
            <button
              onClick={() => openAuth('bup')}
              className="mt-6 w-full rounded-lg bg-[#1f3a2e] py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/seller?action=onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          storeName,
          bio,
          phone,
          pickupLocation,
          payoutMethod,
          payoutNumber,
        }),
      })
      const data = await res.json()

      // Update user state to seller
      const updatedUser = { ...currentUser, isSeller: true }
      loginUser(updatedUser)

      showToast('🎉 Seller setup complete! Welcome to the BUP Seller Hub.')
      router.push('/seller')
    } catch (e) {
      showToast('Error enabling seller profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      <Header />

      <main className="mx-auto max-w-xl w-full flex-1 px-4 py-8">
        
        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-600 mb-2">
            <span className={step >= 1 ? 'text-[#1f3a2e]' : 'text-neutral-400'}>
              1. Store Profile
            </span>
            <span className={step >= 2 ? 'text-[#1f3a2e]' : 'text-neutral-400'}>
              2. Pickup & Payout
            </span>
            <span className={step >= 3 ? 'text-[#1f3a2e]' : 'text-neutral-400'}>
              3. Confirm & Launch
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1f3a2e] to-[#b5573a] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: STORE PROFILE */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-4 animate-in fade-in">
            <div className="border-b border-neutral-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#b5573a]">Step 1 of 3</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                Setup Your Campus Shop Profile
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Tell fellow BUPians who you are and what you offer.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Store / Display Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Tanvir Notes & Lab Guides"
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                BUP Department / Faculty *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Faculty of Science & Technology (FST)"
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Short Bio / Description
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your listings, handovers, or club merchandise..."
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PICKUP LOCATION & PAYOUT */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-4 animate-in fade-in">
            <div className="border-b border-neutral-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#b5573a]">Step 2 of 3</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                Pickup Spot & Payout Number
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Where will you hand over items, and where should we transfer your earnings?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Campus Handover / Pickup Spot *
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. FST Ground Floor Lobby or Central Library Lawn"
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Payout Method *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bkash')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      payoutMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]'
                        : 'border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('nagad')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      payoutMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]'
                        : 'border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    Nagad
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {payoutMethod.toUpperCase()} Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Back
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIRM & LAUNCH */}
        {step === 3 && (
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-4 animate-in fade-in">
            <div className="border-b border-neutral-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#b5573a]">Step 3 of 3</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                Confirm Seller Details
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Review your shop summary before launching your seller dashboard.
              </p>
            </div>

            <div className="rounded-xl bg-[#FAF5E9] p-4 text-xs space-y-2.5 border border-[#213527]/10">
              <div className="flex justify-between">
                <span className="text-neutral-500">Store Name:</span>
                <strong className="text-neutral-900">{storeName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Department:</span>
                <span className="text-neutral-900">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Campus Pickup Spot:</span>
                <span className="text-neutral-900">{pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payout Account:</span>
                <span className="font-mono text-neutral-900">{payoutMethod.toUpperCase()} ({payoutNumber})</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold">
                <span className="text-neutral-600">Platform Commission:</span>
                <span className="text-emerald-700">5% standard (You keep 95%)</span>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-neutral-700 pt-1 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-0.5 rounded accent-[#1f3a2e]"
              />
              <span>
                I agree to the BUP Student Honor Code: no prohibited items, exam leak materials, or fraudulent listings. Items must be genuine and delivered directly on campus.
              </span>
            </label>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!agreedToRules || isSubmitting}
                onClick={handleFinalSubmit}
                className="rounded-lg bg-[#b5573a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#9c452b] transition-colors disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? 'Activating Shop...' : 'Launch Seller Hub 🚀'}
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
