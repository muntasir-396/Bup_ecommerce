'use client'

import React from 'react'
import {
  ShoppingBag,
  Store,
  Search,
  ShoppingCart,
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  CalendarDays
} from 'lucide-react'
import { UserProfile } from '@/lib/types'

interface BottomDockProps {
  cartCount: number
  currentUser: UserProfile | null
  onOpenCart: () => void
  onOpenAuth: () => void
  onOpenSearch: () => void
  onOpenStallBooking?: () => void
  onOpenEvents?: () => void
  activeSection: string
}

export function BottomDock({
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onOpenSearch,
  activeSection,
}: BottomDockProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <aside
      aria-label="Campus quick navigation dock"
      className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-[#211515]/95 p-1.5 text-[#FAF5E9] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all sm:gap-2 sm:p-2"
    >
      {/* Home / Top */}
      <button
        onClick={() => scrollTo('top')}
        className={`flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold transition-all hover:bg-white/15 sm:px-4 ${
          activeSection === 'top' ? 'bg-white/20 text-[#FAF5E9]' : 'text-[#FAF5E9]/80'
        }`}
        title="Go to Campus Overview"
      >
        <span className="text-sm">🏛️</span>
        <span className="hidden md:inline">BUP Home</span>
      </button>

      {/* Shop / Market */}
      <button
        onClick={() => scrollTo('market')}
        className={`flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold transition-all hover:bg-white/15 sm:px-4 ${
          activeSection === 'market' ? 'bg-[#FAF5E9] text-[#211515] shadow-sm' : 'text-[#FAF5E9]'
        }`}
        title="Browse Campus Marketplace"
      >
        <ShoppingBag className="size-4 shrink-0" />
        <span className="hidden sm:inline">Market</span>
      </button>

      {/* Book a Stall Space */}
      <button
        onClick={() => scrollTo('stalls')}
        className={`flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold transition-all ${
          activeSection === 'stalls'
            ? 'bg-[#E3E890] text-[#211515] shadow-sm'
            : 'bg-[#E3E890]/90 text-[#211515] hover:bg-[#E3E890]'
        } sm:px-4`}
        title="Book a Campus Stall or Pop-up Space"
      >
        <Store className="size-4 shrink-0 text-[#211515]" />
        <span className="font-bold">Stalls</span>
      </button>

      {/* Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold text-[#FAF5E9]/85 transition-all hover:bg-white/15 sm:px-3.5"
        title="Search items, books, food and stalls"
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden lg:inline">Search</span>
      </button>

      {/* Divider */}
      <div className="h-6 w-px bg-white/20 mx-0.5" />

      {/* Cart with live Badge */}
      <button
        onClick={onOpenCart}
        className="relative flex items-center gap-2 rounded-full bg-[#B25D3E] px-3.5 py-2.5 text-xs font-bold text-[#FAF5E9] shadow-md transition-all hover:bg-[#c26543] active:scale-95 sm:px-4"
        title="View Shopping Bag"
      >
        <ShoppingCart className="size-4 shrink-0" />
        <span className="hidden sm:inline">Bag</span>
        {cartCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#FAF5E9] text-[10px] font-black text-[#B25D3E] shadow-sm">
            {cartCount}
          </span>
        )}
      </button>

      {/* User / Auth Button */}
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-[#FAF5E9] transition-all hover:bg-white/20 sm:px-3.5"
        title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign in with BUP ID or register'}
      >
        {currentUser ? (
          <div className="flex items-center gap-1.5">
            <span className="grid size-6 place-items-center rounded-full bg-[#E3E890] text-[11px] font-black text-[#211515]">
              {currentUser.role === 'student' ? '🎓' : currentUser.role === 'faculty' ? '🏛️' : '👤'}
            </span>
            <span className="hidden max-w-[90px] truncate text-left font-medium md:inline">
              {currentUser.studentId || currentUser.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <User className="size-4 shrink-0 text-[#E3E890]" />
            <span className="hidden sm:inline">Sign In</span>
          </div>
        )}
      </button>
    </aside>
  )
}
