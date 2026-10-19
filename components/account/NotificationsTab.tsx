'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell, Check, Clock, Package, MessageSquare, Tag, ShieldCheck, Settings } from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { UserNotification } from '@/lib/types'

export function NotificationsTab() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
  } = useBup()

  const [filter, setFilter] = useState<'all' | 'orders' | 'messages' | 'offers' | 'system'>('all')

  // Notification Preferences State
  const [prefOrdersInApp, setPrefOrdersInApp] = useState(true)
  const [prefOrdersEmail, setPrefOrdersEmail] = useState(true)
  const [prefOrdersSms, setPrefOrdersSms] = useState(true)

  const [prefMessagesInApp, setPrefMessagesInApp] = useState(true)
  const [prefMessagesEmail, setPrefMessagesEmail] = useState(false)
  const [prefMessagesSms, setPrefMessagesSms] = useState(true)

  const [prefOffersInApp, setPrefOffersInApp] = useState(true)
  const [prefOffersEmail, setPrefOffersEmail] = useState(true)
  const [prefOffersSms, setPrefOffersSms] = useState(false)

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true
    return n.category === filter
  })

  const getIcon = (category: UserNotification['category']) => {
    switch (category) {
      case 'orders':
        return <Package className="size-4 text-[#b5573a]" />
      case 'messages':
        return <MessageSquare className="size-4 text-[#1f3a2e]" />
      case 'offers':
        return <Tag className="size-4 text-emerald-600" />
      case 'system':
        return <ShieldCheck className="size-4 text-blue-600" />
    }
  }

  const handleSavePreferences = () => {
    showToast('Notification alert preferences saved!')
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
            <Bell className="size-5 text-[#1f3a2e]" />
            <span>Campus Notifications & Alerts</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Handover updates, chat pings, and BUP welfare discount announcements
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-[#1f3a2e] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'orders', 'messages', 'offers', 'system'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
              filter === cat
                ? 'bg-[#1f3a2e] text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
            <p className="text-xs text-neutral-500">No notifications in this category.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                n.isRead
                  ? 'bg-white border-neutral-200/80'
                  : 'bg-[#FAF5E9]/70 border-[#1f3a2e]/30 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-white border border-neutral-200 shrink-0">
                  {getIcon(n.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="size-2 rounded-full bg-[#b5573a]" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-neutral-400 mt-1 inline-block">{n.date}</span>
                </div>
              </div>

              {n.linkUrl && (
                <Link
                  href={n.linkUrl}
                  className="rounded-lg bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 text-[11px] font-bold text-neutral-700 shrink-0"
                >
                  View
                </Link>
              )}
            </div>
          ))
        )}
      </div>

      {/* NOTIFICATION PREFERENCES MATRIX */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="border-b pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-[#1f3a2e]" />
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800">
              Notification Delivery Channels
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="rounded-lg bg-[#1f3a2e] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#b5573a]"
          >
            Save Preferences
          </button>
        </div>

        <div className="divide-y text-xs">
          {/* Order Updates */}
          <div className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-neutral-800">Order & Handover Updates</p>
              <p className="text-neutral-500 text-[11px]">When seller packs, dispatches, or arrives at pickup point</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrdersInApp}
                  onChange={(e) => setPrefOrdersInApp(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>In-App</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrdersEmail}
                  onChange={(e) => setPrefOrdersEmail(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrdersSms}
                  onChange={(e) => setPrefOrdersSms(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>SMS</span>
              </label>
            </div>
          </div>

          {/* Messages */}
          <div className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-neutral-800">Direct Chat Pings</p>
              <p className="text-neutral-500 text-[11px]">When peer buyers or sellers reply regarding listings</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefMessagesInApp}
                  onChange={(e) => setPrefMessagesInApp(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>In-App</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefMessagesEmail}
                  onChange={(e) => setPrefMessagesEmail(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefMessagesSms}
                  onChange={(e) => setPrefMessagesSms(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>SMS</span>
              </label>
            </div>
          </div>

          {/* Offers */}
          <div className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-neutral-800">Campus Flash Deals & Early Merch</p>
              <p className="text-neutral-500 text-[11px]">Discounts on winter varsity jackets, books & canteen tokens</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOffersInApp}
                  onChange={(e) => setPrefOffersInApp(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>In-App</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOffersEmail}
                  onChange={(e) => setPrefOffersEmail(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOffersSms}
                  onChange={(e) => setPrefOffersSms(e.target.checked)}
                  className="rounded text-[#1f3a2e]"
                />
                <span>SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
