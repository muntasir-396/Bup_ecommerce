'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { useBup } from '@/context/BupContext'

export default function RegisterPage() {
  const router = useRouter()
  const { loginUser, currentUser } = useBup()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser({
      id: `user_guest_${Date.now()}`,
      name: name || 'Mirpur Cantonment Guest',
      email: email || 'guest@example.com',
      role: 'outside',
      phone: phone || '+880 1700 000000',
      isBupVerified: false,
    })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />

      <main className="mx-auto max-w-md w-full flex-1 px-4 py-12 flex flex-col justify-center">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200">
          
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#b5573a] text-white shadow-sm mb-3">
              <User className="size-7" />
            </div>
            <h1 className="font-serif text-2xl font-black text-neutral-900">
              Guest / Outside Registration
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              For visitors, DOHS residents, and patrons ordering canteen items & merchandise
            </p>
          </div>

          {currentUser ? (
            <div className="mt-6 text-center">
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                <CheckCircle2 className="size-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-900">
                  Logged in as {currentUser.name}
                </p>
              </div>
              <Link
                href="/marketplace"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kazi Murshed"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#b5573a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#b5573a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +880 1711 234567"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#b5573a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#b5573a]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#b5573a] py-2.5 text-xs font-bold text-white hover:bg-[#9c452b] transition-colors shadow-xs mt-2"
              >
                Complete Registration
              </button>

              <div className="text-center text-xs text-neutral-500 pt-2">
                Already have a BUP ID?{' '}
                <Link href="/sign-in" className="font-bold text-[#1f3a2e] hover:underline">
                  Sign In with Student ID
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <LocationModal />
      <BecomeSellerModal />
    </div>
  )
}
