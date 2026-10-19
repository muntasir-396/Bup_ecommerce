'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  Store,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Filter,
  Users
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { ExtravagantStallSection } from '@/components/bup/ExtravagantStallSection'
import { StallBookingModal } from '@/components/bup/StallBookingModal'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { AuthModal } from '@/components/bup/AuthModal'
import { UserProfileModal } from '@/components/bup/UserProfileModal'
import { STALLS } from '@/data/stalls'
import { Stall } from '@/lib/types'
import { useBup } from '@/context/BupContext'

export default function StallSpacesPage() {
  const {
    currentUser,
    openAuth,
    showToast,
    isAuthOpen,
    closeAuth,
    loginUser,
    authInitialTab,
    isProfileModalOpen,
    closeProfileModal,
    logoutUser,
  } = useBup()

  const [stallsList, setStallsList] = useState<Stall[]>(STALLS)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)

  // Booking confirmation
  const handleBookingConfirmed = (stallId: string, bookingDetails: any) => {
    setStallsList((prev) =>
      prev.map((s) =>
        s.id === stallId
          ? { ...s, status: 'Reserved', reservedBy: bookingDetails.clubName }
          : s
      )
    )
    showToast(`Stall space #${stallId} reserved for ${bookingDetails.clubName}! Confirmation sent.`)
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
              <span>/</span>
              <span className="font-semibold text-neutral-900">Stall Spaces</span>
            </div>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-black text-neutral-900">
              Campus Pop-up & Exhibition Stalls
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-2xl">
              Reserve prime exhibition spaces around BUP Central Lake, FST/FBS concourses, and Bijoy Auditorium Plaza for student club exhibitions, book fairs, and food kiosks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>7 Spaces Available Today</span>
            </span>
          </div>
        </div>

        {/* INTEGRATED EXTRAVAGANT SPATIAL MAP & BOOKING SECTION */}
        <ExtravagantStallSection
          stalls={stallsList}
          onSelectStallForBooking={(stall) => setSelectedStall(stall)}
          currentUser={currentUser}
          onOpenAuth={() => openAuth('bup')}
        />

        {/* MODAL: STALL RESERVATION FORM */}
        <StallBookingModal
          stall={selectedStall}
          onClose={() => setSelectedStall(null)}
          currentUser={currentUser}
          onOpenAuth={() => openAuth('bup')}
          onBookingConfirmed={handleBookingConfirmed}
        />
      </main>

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
