'use client'

import React from 'react'
import Link from 'next/link'
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
  Store,
  LogOut,
  ChevronRight,
  ArrowLeftRight
} from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { VerificationBadge } from './VerificationBadge'

export type AccountTabKey =
  | 'profile'
  | 'orders'
  | 'wishlist'
  | 'messages'
  | 'addresses'
  | 'payments'
  | 'reviews'
  | 'notifications'
  | 'security'
  | 'help'

interface AccountSidebarProps {
  activeTab: AccountTabKey
  onSelectTab: (tab: AccountTabKey) => void
}

export function AccountSidebar({ activeTab, onSelectTab }: AccountSidebarProps) {
  const {
    currentUser,
    logoutUser,
    wishlist,
    orders,
    notifications,
    reviews,
    mode,
    toggleMode,
  } = useBup()

  const unreadNotifs = notifications.filter((n) => !n.isRead).length
  const activeOrdersCount = orders.filter((o) => o.status === 'To Receive' || o.status === 'To Pay').length

  const navItems: Array<{
    key: AccountTabKey
    label: string
    icon: React.ElementType
    badge?: number | string
  }> = [
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'orders', label: 'My Orders', icon: Package, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { key: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length > 0 ? wishlist.length : undefined },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'payments', label: 'Payment Methods', icon: CreditCard },
    { key: 'reviews', label: 'Reviews', icon: Star, badge: reviews.length > 0 ? reviews.length : undefined },
    { key: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { key: 'security', label: 'Security & Access', icon: Shield },
    { key: 'help', label: 'Help & Campus Support', icon: HelpCircle },
  ]

  return (
    <>
      {/* MOBILE HORIZONTAL SCROLL STRIP (< lg) */}
      <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 bg-white px-2 sticky top-28 z-20">
        <div className="flex items-center gap-1.5 min-w-max py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#1f3a2e] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-[#b5573a] text-white' : 'bg-neutral-300 text-neutral-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* DESKTOP SIDEBAR (lg+) */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-4">
        {/* User Mini Card */}
        <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-[#1f3a2e]/20 bg-neutral-100">
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={currentUser?.name || 'User'}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Welcome back
              </div>
              <h3 className="font-serif font-black text-sm text-neutral-900 truncate">
                {currentUser?.name || 'Campus Student'}
              </h3>
              <div className="mt-1">
                <VerificationBadge user={currentUser} size="sm" />
              </div>
            </div>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="mt-4 pt-3 border-t border-neutral-100">
            <button
              onClick={toggleMode}
              className="w-full flex items-center justify-between rounded-xl bg-[#FAF5E9] px-3 py-2 text-xs font-bold text-[#1f3a2e] hover:bg-[#FAF5E9]/80 border border-[#213527]/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="size-3.5 text-[#b5573a]" />
                <span>Mode: {mode === 'selling' ? 'Selling (Seller Hub)' : 'Buying (Storefront)'}</span>
              </div>
              <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-700 shadow-2xs">
                Switch
              </span>
            </button>
          </div>

          {/* Seller Hub shortcut if user is seller */}
          {currentUser?.isSeller ? (
            <Link
              href="/seller"
              className="mt-2.5 flex items-center justify-between rounded-xl bg-[#1f3a2e]/5 px-3 py-2 text-xs font-bold text-[#1f3a2e] hover:bg-[#1f3a2e]/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="size-3.5 text-[#1f3a2e]" />
                <span>Go to Seller Hub</span>
              </div>
              <ChevronRight className="size-3.5 text-neutral-400" />
            </Link>
          ) : (
            <Link
              href="/seller/setup"
              className="mt-2.5 flex items-center justify-between rounded-xl bg-[#b5573a]/10 px-3 py-2 text-xs font-bold text-[#b5573a] hover:bg-[#b5573a]/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="size-3.5 text-[#b5573a]" />
                <span>Become a Campus Seller</span>
              </div>
              <ChevronRight className="size-3.5 text-neutral-400" />
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="rounded-2xl bg-white p-2.5 border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100">
          <div className="space-y-0.5 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#1f3a2e] text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? 'text-[#E3E890]' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-[#b5573a] text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="size-4 text-rose-500" />
              <span>Sign Out of BUPCommon</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
