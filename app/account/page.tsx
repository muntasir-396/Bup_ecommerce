'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  User,
  Package,
  Heart,
  MessageSquare,
  MapPin,
  CreditCard,
  Star,
  Bell,
  Shield,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  LogIn
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { AccountSidebar, AccountTabKey } from '@/components/account/AccountSidebar'
import { ProfileTab } from '@/components/account/ProfileTab'
import { OrdersTab } from '@/components/account/OrdersTab'
import { WishlistTab } from '@/components/account/WishlistTab'
import { AddressesTab } from '@/components/account/AddressesTab'
import { PaymentMethodsTab } from '@/components/account/PaymentMethodsTab'
import { ReviewsTab } from '@/components/account/ReviewsTab'
import { NotificationsTab } from '@/components/account/NotificationsTab'
import { SecurityTab } from '@/components/account/SecurityTab'
import { useBup } from '@/context/BupContext'

function AccountPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, openAuth } = useBup()

  const queryTab = searchParams?.get('tab') as AccountTabKey | null
  const [activeTab, setActiveTab] = useState<AccountTabKey>(queryTab || 'profile')

  useEffect(() => {
    if (queryTab && [
      'profile',
      'orders',
      'wishlist',
      'messages',
      'addresses',
      'payments',
      'reviews',
      'notifications',
      'security',
      'help'
    ].includes(queryTab)) {
      setActiveTab(queryTab)
    }
  }, [queryTab])

  // Redirect if Messages is chosen
  const handleSelectTab = (tab: AccountTabKey) => {
    if (tab === 'messages') {
      router.push('/messages')
      return
    }
    setActiveTab(tab)
    router.replace(`/account?tab=${tab}`)
  }

  // Route Guard: Guests must sign in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
        <Header />
        <CategoryBar />

        <main className="mx-auto max-w-xl w-full flex-1 px-4 py-16 flex items-center justify-center">
          <div className="w-full rounded-2xl bg-white p-8 text-center border border-neutral-200 shadow-sm space-y-4">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#1f3a2e]/10 text-[#1f3a2e]">
              <ShieldAlert className="size-8" />
            </div>
            <h1 className="font-serif text-2xl font-black text-neutral-900">
              Sign In to Access Your BUP Account
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
              Please authenticate with your BUP Student/Faculty ID or registered email to view orders, campus addresses, and profile details.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuth('bup')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                <LogIn className="size-4" />
                <span>Sign In with BUP ID</span>
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto rounded-lg border border-neutral-300 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-[#1f3a2e]">Account</Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900 capitalize">{activeTab}</span>
        </div>

        {/* Layout: Sidebar + Tab Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <AccountSidebar activeTab={activeTab} onSelectTab={handleSelectTab} />

          <div className="flex-1 w-full min-w-0">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'wishlist' && <WishlistTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'payments' && <PaymentMethodsTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'help' && (
              <div className="rounded-2xl bg-white p-8 border border-neutral-200/90 shadow-2xs space-y-4">
                <h2 className="font-serif font-black text-lg text-neutral-900 flex items-center gap-2">
                  <HelpCircle className="size-5 text-[#1f3a2e]" />
                  <span>BUP Student Welfare & Marketplace Support</span>
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Need assistance with peer handovers, stall booking disputes, or bKash/Nagad transactions? Our campus student representative desk is available daily from 9:00 AM to 5:00 PM at Cafe Lake Promenade.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10">
                    <span className="font-bold text-[#1f3a2e]">Campus Helpdesk Email</span>
                    <p className="text-neutral-700 mt-1 font-mono">support.marketplace@bup.edu.bd</p>
                  </div>
                  <div className="rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10">
                    <span className="font-bold text-[#1f3a2e]">Emergency Campus Helpline</span>
                    <p className="text-neutral-700 mt-1 font-mono">+880 1769-021000 (Ext. 204)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5E9] flex items-center justify-center font-bold">Loading Account...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}
