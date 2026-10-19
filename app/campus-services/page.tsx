'use client'

import React from 'react'
import Link from 'next/link'
import {
  Layers,
  Printer,
  BookOpen,
  UtensilsCrossed,
  MapPin,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { AuthModal } from '@/components/bup/AuthModal'
import { UserProfileModal } from '@/components/bup/UserProfileModal'
import { CampusEventsModal } from '@/components/bup/CampusEventsModal'
import { CampusMapModal } from '@/components/bup/CampusMapModal'
import { CAMPUS_EVENTS } from '@/lib/mock-data'
import { useBup } from '@/context/BupContext'

export default function CampusServicesPage() {
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
    isEventsModalOpen,
    openEventsModal,
    closeEventsModal,
    isMapModalOpen,
    openMapModal,
    closeMapModal,
  } = useBup()

  const services = [
    {
      icon: <Printer className="size-6 text-[#1f3a2e]" />,
      title: 'Fast Thesis Spiral Binding & Plotting',
      desc: 'Submit PDF online, pick up printed hardbound thesis or laser plots at Central Library in 30 mins.',
      status: 'Open (30m Queue)',
      actionText: 'Order Print Run',
      link: '/marketplace?category=Services',
    },
    {
      icon: <BookOpen className="size-6 text-[#b5573a]" />,
      title: 'Peer Textbook & Study Notes Exchange',
      desc: 'Pass on your completed semester textbooks or get solved midterms verified by faculty toppers.',
      status: 'Active Exchange',
      actionText: 'Browse Textbooks',
      link: '/marketplace?category=Textbooks',
    },
    {
      icon: <UtensilsCrossed className="size-6 text-[#1f3a2e]" />,
      title: 'Central Canteen Express Pre-Order',
      desc: 'Pre-order daily lunch khichuri, fried ilish, or lake cold brew to skip the rush between lectures.',
      status: 'Accepting Lunch Orders',
      actionText: 'View Today’s Menu',
      link: '/marketplace?category=Dining+%26+Canteen',
    },
    {
      icon: <CalendarDays className="size-6 text-[#b5573a]" />,
      title: 'University Notices & Club Events',
      desc: 'Stay informed on upcoming robotics hackathons, business case competitions, and cultural festivals.',
      status: '3 Major Events Scheduled',
      actionText: 'Open Events Calendar',
      onClick: openEventsModal,
    },
    {
      icon: <MapPin className="size-6 text-[#1f3a2e]" />,
      title: 'Interactive Architectural Campus Map',
      desc: 'Explore 3D spatial layout of BUP: faculties, lake promenade, sports grounds, and auditorium.',
      status: 'Live 3D View',
      actionText: 'Launch Campus Map',
      onClick: openMapModal,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Campus Services</span>
        </div>

        {/* Title */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1f3a2e] to-[#2b5241] p-6 sm:p-10 text-white shadow-md mb-8">
          <span className="rounded-full bg-[#E3E890] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1f3a2e]">
            BUP Student Welfare & Administration
          </span>
          <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-black tracking-tight">
            Campus Services & Utilities
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-200 max-w-xl leading-relaxed">
            Essential student services operating inside Mirpur Cantonment. Everything you need to excel in your academic journey and daily life at BUP.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white p-5 border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-xl bg-[#FAF5E9] border border-[#1f3a2e]/10">
                    {svc.icon}
                  </div>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {svc.status}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-neutral-900">
                  {svc.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100">
                {svc.link ? (
                  <Link
                    href={svc.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f3a2e] hover:text-[#b5573a] transition-colors"
                  >
                    <span>{svc.actionText}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={svc.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b5573a] hover:underline transition-colors"
                  >
                    <span>{svc.actionText}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
      <CampusEventsModal
        isOpen={isEventsModalOpen}
        onClose={closeEventsModal}
        events={CAMPUS_EVENTS}
      />
      <CampusMapModal
        isOpen={isMapModalOpen}
        onClose={closeMapModal}
      />
    </div>
  )
}
