'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  Sparkles,
  Store,
  GraduationCap,
  LogOut,
  Heart,
  Package,
  ShieldCheck,
  X,
  ExternalLink,
  PlusCircle,
  Plus,
  MessageSquare,
  ArrowLeftRight,
  Menu
} from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { PRODUCTS } from '@/data/products'
import { VerificationBadge } from '@/components/account/VerificationBadge'

export function Header() {
  const router = useRouter()
  const {
    totalCartCount,
    currentUser,
    openCart,
    openAuth,
    openSellerModal,
    openLocationModal,
    deliveryLocation,
    logoutUser,
    openProduct,
    openProfileModal,
    mode,
    setMode,
  } = useBup()

  const [searchInput, setSearchInput] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Filter search suggestions
  const searchSuggestions = searchInput.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5)
    : []

  // Close menus on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false)
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setIsSearchFocused(false)
      router.push(`/marketplace?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1f3a2e] text-[#FAF5E9] shadow-md border-b border-[#2d5241]">
      {/* ROW 1: BRANDING, SEARCH, USER ACTIONS, CART */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          aria-label="BUPCommon Homepage"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-[#E3E890] text-[#1f3a2e] shadow-sm transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="size-6 text-[#1f3a2e]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-serif text-2xl font-black tracking-tight text-white">
                BUP<span className="text-[#b5573a]">Common</span>
              </span>
              <span className="hidden sm:inline-block rounded bg-[#b5573a] px-1 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                Campus
              </span>
            </div>
            <span className="text-[10px] tracking-wide text-[#FAF5E9]/70 font-medium">
              Mirpur Cantonment • Dhaka
            </span>
          </div>
        </Link>

        {/* WIDE SEARCH BAR */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-2xl mx-1 sm:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for merch, books, notes, food and more"
              className="w-full rounded-md bg-[#FAF5E9] py-2 pl-3.5 pr-10 text-xs sm:text-sm text-[#392525] placeholder:text-neutral-500 placeholder:text-xs sm:placeholder:text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#b5573a] transition-all"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-9 text-neutral-400 hover:text-neutral-700"
              >
                <X className="size-4" />
              </button>
            ) : null}
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 bg-[#b5573a] text-white rounded-r-md hover:bg-[#9c452b] transition-colors flex items-center justify-center"
              aria-label="Submit search"
            >
              <Search className="size-4" />
            </button>
          </form>

          {/* Search suggestions dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 rounded-md bg-white p-2 shadow-2xl border border-neutral-200 z-50 text-[#392525]">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Quick Campus Results
              </div>
              {searchSuggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    openProduct(p)
                    setIsSearchFocused(false)
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#FAF5E9] cursor-pointer transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="size-10 rounded object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {p.category} • By {p.seller}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#b5573a] shrink-0">
                    ৳{p.price}
                  </span>
                </div>
              ))}
              <div
                onClick={() => {
                  router.push(`/marketplace?q=${encodeURIComponent(searchInput.trim())}`)
                  setIsSearchFocused(false)
                }}
                className="border-t border-neutral-100 mt-1 pt-2 px-3 py-1.5 text-center text-xs font-bold text-[#1f3a2e] hover:text-[#b5573a] cursor-pointer"
              >
                View all results for &quot;{searchInput}&quot; →
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS: LOGIN DROPDOWN, BECOME A SELLER, CART */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* USER / AUTH DROPDOWN */}
          <div ref={userMenuRef} className="relative">
            {currentUser ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span className="grid size-7 place-items-center rounded-full bg-[#E3E890] text-[#1f3a2e] text-xs font-black shadow-xs">
                  {currentUser.role === 'student' ? '🎓' : currentUser.role === 'faculty' ? '🏛️' : '👤'}
                </span>
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="font-bold text-xs truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#E3E890] font-mono">
                    {currentUser.studentId || 'Verified'}
                  </span>
                </div>
                <ChevronDown className="size-3 text-white/70" />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-xs font-bold text-[#1f3a2e] hover:bg-[#FAF5E9] transition-all shadow-xs"
                >
                  <User className="size-3.5 text-[#1f3a2e]" />
                  <span>Login</span>
                  <ChevronDown className="size-3 text-neutral-600" />
                </button>
              </div>
            )}

            {/* Dropdown mini-card */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white p-3 text-[#392525] shadow-2xl border border-neutral-200 z-50 animate-in fade-in slide-in-from-top-2">
                {currentUser ? (
                  <div className="space-y-2.5">
                    {/* User Mini-Card Header */}
                    <div className="flex items-center gap-3 p-2 bg-[#FAF5E9]/70 rounded-xl border border-[#213527]/10">
                      <div className="relative size-11 rounded-full overflow-hidden border border-[#1f3a2e]/30 bg-neutral-200 shrink-0">
                        <img
                          src={
                            currentUser.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={currentUser.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                          {currentUser.name}
                        </h4>
                        <div className="mt-0.5">
                          <VerificationBadge user={currentUser} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Mode Switch Toggle: Buying <-> Selling */}
                    <div className="p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          if (mode === 'buying') {
                            setMode('selling')
                            router.push('/seller')
                          } else {
                            setMode('buying')
                            router.push('/')
                          }
                        }}
                        className="w-full flex items-center justify-between rounded-xl bg-neutral-100 hover:bg-neutral-200/80 p-2 text-xs font-bold transition-all text-[#1f3a2e]"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="size-3.5 text-[#b5573a]" />
                          <span>
                            {mode === 'selling' ? 'Switch to: Buying Mode' : 'Switch to: Selling Mode'}
                          </span>
                        </div>
                        <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-700 shadow-2xs">
                          {mode === 'selling' ? 'Storefront' : 'Seller Hub'}
                        </span>
                      </button>
                    </div>

                    {/* Quick Account Links */}
                    <div className="divide-y divide-neutral-100 text-xs">
                      <div className="space-y-0.5 pb-1.5">
                        <Link
                          href="/account?tab=profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-neutral-700 hover:bg-[#FAF5E9] hover:text-[#1f3a2e] transition-colors"
                        >
                          <User className="size-4 text-neutral-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-neutral-700 hover:bg-[#FAF5E9] hover:text-[#1f3a2e] transition-colors"
                        >
                          <Package className="size-4 text-neutral-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/account?tab=wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-neutral-700 hover:bg-[#FAF5E9] hover:text-[#1f3a2e] transition-colors"
                        >
                          <Heart className="size-4 text-neutral-400" />
                          <span>Wishlist</span>
                        </Link>
                        <Link
                          href="/messages"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-neutral-700 hover:bg-[#FAF5E9] hover:text-[#1f3a2e] transition-colors"
                        >
                          <MessageSquare className="size-4 text-neutral-400" />
                          <span>Messages & Inquiries</span>
                        </Link>
                        {currentUser.isSeller ? (
                          <Link
                            href="/seller"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-bold text-[#1f3a2e] hover:bg-emerald-50 transition-colors"
                          >
                            <Store className="size-4 text-[#1f3a2e]" />
                            <span>Seller Hub</span>
                          </Link>
                        ) : (
                          <Link
                            href="/seller/setup"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-bold text-[#b5573a] hover:bg-amber-50 transition-colors"
                          >
                            <Store className="size-4 text-[#b5573a]" />
                            <span>Become a Seller</span>
                          </Link>
                        )}
                      </div>

                      {/* Sign out */}
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            logoutUser()
                          }}
                          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="size-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-2 border-b border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900">New to BUPCommon?</p>
                      <p className="text-[11px] text-neutral-500">
                        Sign in for exclusive student rates & instant ordering.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        openAuth('bup')
                      }}
                      className="w-full mt-1 flex items-center justify-between rounded-md bg-[#1f3a2e] px-3 py-2 text-xs font-bold text-white hover:bg-[#162920] transition-colors"
                    >
                      <span>Sign in with BUP ID</span>
                      <GraduationCap className="size-4 text-[#E3E890]" />
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        openAuth('outside-login')
                      }}
                      className="w-full mt-1.5 flex items-center justify-between rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>Guest / Outside Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        openAuth('outside-register')
                      }}
                      className="w-full mt-1 text-center py-1 text-[11px] font-semibold text-[#b5573a] hover:underline"
                    >
                      Register New Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* MESSAGES LINK */}
          {currentUser && (
            <Link
              href="/messages"
              className="hidden sm:flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition-colors"
              title="Campus Buyer & Seller Messages"
            >
              <MessageSquare className="size-4 text-[#E3E890]" />
              <span className="hidden lg:inline">Chats</span>
            </Link>
          )}

          {/* BECOME A SELLER / SELLER HUB LINK */}
          {(currentUser as any)?.isSeller ? (
            <Link
              href="/seller"
              className="flex items-center gap-1.5 rounded-md bg-[#E3E890] px-2.5 py-1.5 text-xs font-bold text-[#1f3a2e] hover:bg-white transition-colors shadow-2xs"
              title="Manage your listings, orders & earnings"
            >
              <Store className="size-3.5 text-[#1f3a2e]" />
              <span>Seller Hub</span>
            </Link>
          ) : (
            <Link
              href="/seller/onboard"
              className="hidden md:flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#E3E890] hover:bg-white/10 transition-colors"
              title="Start selling to 8,000+ campus students"
            >
              <Store className="size-3.5" />
              <span>Become a Seller</span>
            </Link>
          )}

          {/* QUICK SELL BUTTON */}
          <Link
            href="/seller"
            className="hidden lg:flex items-center gap-1 rounded-md bg-[#b5573a] px-2.5 py-1.5 text-xs font-black text-white hover:bg-[#9c452b] transition-colors shadow-2xs"
            title="Create a new listing"
          >
            <Plus className="size-3.5" />
            <span>Sell</span>
          </Link>

          {/* CART BUTTON WITH BADGE */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="size-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#b5573a] text-[10px] font-black text-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* ROW 2: DELIVER TO LOCATION SELECTOR */}
      <div className="bg-[#172d24] px-3 py-1.5 text-[11px] sm:text-xs text-[#FAF5E9]/90 border-t border-[#234234]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-1 sm:px-6 lg:px-8">
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1.5 hover:text-[#E3E890] transition-colors focus:outline-none"
          >
            <MapPin className="size-3.5 text-[#b5573a] shrink-0" />
            <span className="font-normal text-neutral-300">Deliver to:</span>
            <span className="font-bold text-white underline decoration-dotted underline-offset-2">
              {deliveryLocation}
            </span>
            <ChevronDown className="size-3 text-neutral-400" />
          </button>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-neutral-300 font-medium">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Central Canteen: <strong className="text-white">Open for Pre-order</strong>
            </span>
            <span className="text-neutral-500">•</span>
            <Link href="/stall-spaces" className="hover:text-[#E3E890] transition-colors">
              Pop-up Lake Stalls Available Today
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
