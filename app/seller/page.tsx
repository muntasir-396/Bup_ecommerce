'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  Star,
  Settings,
  Plus,
  Store,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Eye,
  Trash2,
  Edit,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Pause,
  Play
} from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { Footer } from '@/components/marketplace/Footer'
import { StatCard } from '@/components/seller/StatCard'
import { OrderTable } from '@/components/seller/OrderTable'
import { ListingForm } from '@/components/seller/ListingForm'
import { ChatWindow } from '@/components/seller/ChatWindow'
import { useBup } from '@/context/BupContext'
import { DbListing, DbOrderItem, DbPayout, DbConversation } from '@/data/seed'

export default function SellerHubPage() {
  const router = useRouter()
  const { currentUser, showToast, openAuth } = useBup()

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'listings' | 'new-listing' | 'orders' | 'messages' | 'earnings' | 'reviews' | 'settings'
  >('dashboard')

  // Seller data state
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [myListings, setMyListings] = useState<DbListing[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [myPayouts, setMyPayouts] = useState<DbPayout[]>([])
  const [myConversations, setMyConversations] = useState<DbConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [editingListing, setEditingListing] = useState<DbListing | null>(null)

  // Status filter for listings
  const [listingFilter, setListingFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'DRAFT'>('ALL')

  // Payout request modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState<number>(2000)
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [payoutAccount, setPayoutAccount] = useState('01711234567')

  // Load seller data
  const loadSellerData = async (userId: string) => {
    try {
      const res = await fetch(`/api/seller?userId=${userId}`)
      const data = await res.json()
      if (data.sellerProfile) {
        setSellerProfile(data.sellerProfile)
      } else {
        // Automatically redirect to onboarding if user hasn't set up store
        router.push('/seller/onboard')
        return
      }
      setMyListings(data.listings || [])
      setMyOrders(data.orders || [])

      // Load payouts
      const pRes = await fetch(`/api/payouts?sellerId=${userId}`)
      const pData = await pRes.json()
      setMyPayouts(pData.payouts || [])

      // Load chats
      const cRes = await fetch(`/api/chat?userId=${userId}`)
      const cData = await cRes.json()
      setMyConversations(cData.conversations || [])
      if (cData.conversations?.length > 0) {
        setActiveConversationId(cData.conversations[0].id)
      }
    } catch (e) {
      console.error('Error fetching seller data', e)
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadSellerData(currentUser.id)
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
        <Header />
        <main className="mx-auto max-w-md w-full flex-1 px-4 py-16 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
            <Store className="size-12 text-[#b5573a] mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Sign in to Access Seller Hub</h2>
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
      </div>
    )
  }

  // Handle listing creation
  const handleSaveListing = async (listingData: any) => {
    try {
      const res = await fetch('/api/seller?action=create-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...listingData,
          sellerId: currentUser.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(
          listingData.isDraft
            ? 'Listing saved as draft.'
            : '🎉 Listing published successfully to BUP Marketplace!'
        )
        setMyListings((prev) => [data.listing, ...prev])
        setActiveTab('listings')
        setEditingListing(null)
      } else {
        showToast(data.error || 'Failed to publish listing')
      }
    } catch (e) {
      showToast('Error saving listing')
    }
  }

  // Toggle status: Pause / Activate / Mark Sold
  const handleToggleListingStatus = async (listing: DbListing, newStatus: string) => {
    try {
      const res = await fetch('/api/seller?action=update-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: currentUser.id,
          updates: { status: newStatus },
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Listing marked as ${newStatus.toLowerCase()}.`)
        setMyListings((prev) =>
          prev.map((l) => (l.id === listing.id ? { ...l, status: newStatus as any } : l))
        )
      }
    } catch (e) {
      showToast('Error updating listing status')
    }
  }

  // Delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      const res = await fetch('/api/seller?action=delete-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, sellerId: currentUser.id }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('Listing deleted.')
        setMyListings((prev) => prev.filter((l) => l.id !== listingId))
      }
    } catch (e) {
      showToast('Error deleting listing')
    }
  }

  // Order status update
  const handleUpdateOrderStatus = async (
    orderItemId: string,
    newStatus: 'CONFIRMED' | 'PACKED' | 'READY' | 'DELIVERED' | 'CANCELLED',
    reason?: string
  ) => {
    try {
      const res = await fetch('/api/orders?action=update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItemId,
          sellerId: currentUser.id,
          newStatus,
          reason,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Order status updated to ${newStatus.toLowerCase()}!`)
        setMyOrders((prev) =>
          prev.map((item) =>
            item.id === orderItemId
              ? { ...item, status: newStatus, cancellationReason: reason }
              : item
          )
        )
        // Refresh balance if delivered
        if (newStatus === 'DELIVERED') {
          loadSellerData(currentUser.id)
        }
      }
    } catch (e) {
      showToast('Error updating order status')
    }
  }

  // Handle payout request
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: currentUser.id,
          amount: payoutAmount,
          method: payoutMethod,
          accountNumber: payoutAccount,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`৳${payoutAmount} payout requested via ${payoutMethod.toUpperCase()}!`)
        setIsPayoutModalOpen(false)
        setMyPayouts((prev) => [data.payout, ...prev])
        setSellerProfile((prev: any) => ({ ...prev, balance: data.remainingBalance }))
      } else {
        showToast(data.error || 'Failed to request payout')
      }
    } catch (e) {
      showToast('Error requesting payout')
    }
  }

  // Send chat message
  const handleSendMessage = async (text: string) => {
    if (!activeConversationId) return
    try {
      const res = await fetch('/api/chat?action=send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          senderId: currentUser.id,
          senderName: sellerProfile?.storeName || currentUser.name,
          text,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMyConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, messages: [...c.messages, data.message] }
              : c
          )
        )
      }
    } catch (e) {}
  }

  // Filter listings
  const filteredListings = myListings.filter((l) => {
    if (listingFilter === 'ALL') return true
    return l.status === listingFilter
  })

  // Low stock alerts
  const lowStockListings = myListings.filter((l) => l.stock > 0 && l.stock <= 2 && l.status === 'ACTIVE')

  const activeConversation = myConversations.find((c) => c.id === activeConversationId)

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      <Header />

      {/* TOP SELLER BANNER & STORE INFO */}
      <section className="bg-gradient-to-r from-[#1f3a2e] to-[#264536] text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-[#2d5241]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-[#E3E890] text-[#1f3a2e] font-black text-lg shadow-sm">
              <Store className="size-6 text-[#1f3a2e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-black text-white">
                  {sellerProfile?.storeName || 'BUP Seller Hub'}
                </h1>
                {currentUser.isBupVerified && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-[#E3E890] border border-[#E3E890]/30 px-2 py-0.5 text-[10px] font-bold">
                    <ShieldCheck className="size-3" /> Verified Student Seller
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Pickup Point: <strong className="text-white">{sellerProfile?.pickupLocation || 'Campus Handover'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${currentUser.sellerSlug || currentUser.sellerProfile?.slug || currentUser.id}`}
              className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Public Shop →
            </Link>
            <button
              onClick={() => {
                setEditingListing(null)
                setActiveTab('new-listing')
              }}
              className="flex items-center gap-1.5 rounded-md bg-[#b5573a] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#9c452b] transition-colors"
            >
              <Plus className="size-4" />
              <span>Create Listing</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN SELLER HUB LAYOUT: SIDEBAR + CONTENT */}
      <div className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
          
          {/* DESKTOP SIDEBAR NAV */}
          <aside className="hidden md:block rounded-xl bg-white p-3 border border-neutral-200/90 shadow-2xs space-y-1 sticky top-24">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
              { id: 'listings', label: 'My Listings', icon: <Package className="size-4" />, count: myListings.length },
              { id: 'orders', label: 'Orders', icon: <ShoppingBag className="size-4" />, count: myOrders.filter(o => o.status === 'CONFIRMED').length },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="size-4" />, count: myConversations.length },
              { id: 'earnings', label: 'Earnings & Payouts', icon: <DollarSign className="size-4" /> },
              { id: 'reviews', label: 'Reviews', icon: <Star className="size-4" /> },
              { id: 'settings', label: 'Store Settings', icon: <Settings className="size-4" /> },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  if (nav.id === 'listings') setEditingListing(null)
                  setActiveTab(nav.id as any)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === nav.id
                    ? 'bg-[#1f3a2e] text-white shadow-2xs'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={activeTab === nav.id ? 'text-[#E3E890]' : 'text-neutral-500'}>
                    {nav.icon}
                  </span>
                  <span>{nav.label}</span>
                </div>
                {nav.count !== undefined && nav.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      activeTab === nav.id
                        ? 'bg-[#b5573a] text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {nav.count}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className="space-y-6">
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* STATS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <StatCard
                    label="Today's Sales"
                    value={`৳${myOrders.reduce((sum, o) => sum + o.price * o.quantity, 0)}`}
                    subtext="Campus orders today"
                    trend="+18%"
                    icon={<TrendingUp className="size-6 text-[#1f3a2e]" />}
                  />
                  <StatCard
                    label="Pending Orders"
                    value={myOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PACKED').length}
                    subtext="Awaiting packaging"
                    icon={<Clock className="size-6 text-[#b5573a]" />}
                  />
                  <StatCard
                    label="Total Balance"
                    value={`৳${sellerProfile?.balance || 0}`}
                    subtext="95% Net earnings"
                    icon={<DollarSign className="size-6 text-emerald-700" />}
                  />
                  <StatCard
                    label="Product Views"
                    value={myListings.reduce((sum, l) => sum + l.viewsCount, 0)}
                    subtext="Student impressions"
                    icon={<Eye className="size-6 text-[#1f3a2e]" />}
                  />
                </div>

                {/* LOW STOCK ALERTS */}
                {lowStockListings.length > 0 && (
                  <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
                      <AlertTriangle className="size-4 text-amber-600" />
                      <span>Low Stock Alert ({lowStockListings.length} items with &le; 2 units left)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lowStockListings.map((l) => (
                        <div key={l.id} className="flex items-center justify-between rounded-lg bg-white p-2 border border-amber-200/80 text-xs">
                          <span className="font-semibold text-neutral-800 truncate max-w-[200px]">{l.title}</span>
                          <span className="font-bold text-amber-700 shrink-0">{l.stock} left</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 30-DAY SALES CHART SIMULATION */}
                <div className="rounded-xl bg-white p-5 border border-neutral-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">30-Day Campus Sales Velocity</h3>
                      <p className="text-xs text-neutral-500">Student purchases across midterms, varsity drops, and daily meals</p>
                    </div>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      Active Semester Peak
                    </span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="h-44 w-full flex items-end gap-1 sm:gap-2 pt-4 px-1 border-b border-neutral-200">
                    {[35, 45, 60, 25, 40, 80, 95, 65, 50, 75, 90, 110, 85, 70, 95, 120, 140, 115, 90, 80, 105, 130, 150, 125, 140, 160, 175, 150, 165, 190].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-[#1f3a2e] hover:bg-[#b5573a] transition-all rounded-t-xs relative group cursor-pointer"
                        style={{ height: `${(val / 200) * 100}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          ৳{val * 40}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-2">
                    <span>30 Days Ago</span>
                    <span>15 Days Ago</span>
                    <span>Today</span>
                  </div>
                </div>

                {/* RECENT ORDERS TABLE PREVIEW */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900">Recent Campus Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#b5573a] hover:underline">
                      View all orders →
                    </button>
                  </div>
                  <OrderTable orders={myOrders.slice(0, 5)} onUpdateStatus={handleUpdateOrderStatus} />
                </div>

              </div>
            )}

            {/* 2. MY LISTINGS VIEW */}
            {activeTab === 'listings' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      My Campus Listings ({myListings.length})
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage active inventory, stock levels, and pricing for your store.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1 text-xs font-bold">
                      {(['ALL', 'ACTIVE', 'PENDING', 'SOLD', 'DRAFT'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setListingFilter(st)}
                          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                            listingFilter === st
                              ? 'bg-[#1f3a2e] text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setEditingListing(null)
                        setActiveTab('new-listing')
                      }}
                      className="rounded-md bg-[#b5573a] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#9c452b] transition-colors flex items-center gap-1"
                    >
                      <Plus className="size-3.5" />
                      <span>New Listing</span>
                    </button>
                  </div>
                </div>

                {/* Listings Table */}
                {filteredListings.length === 0 ? (
                  <div className="rounded-xl bg-white p-12 text-center border border-neutral-200">
                    <Package className="size-10 text-neutral-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-neutral-800">You haven&apos;t listed anything here yet</h3>
                    <p className="text-xs text-neutral-500 mt-1">Sell your first textbook, varsity hoodie, or canteen meal.</p>
                    <button
                      onClick={() => {
                        setEditingListing(null)
                        setActiveTab('new-listing')
                      }}
                      className="mt-4 rounded-md bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
                    >
                      Sell Your First Item
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white border border-neutral-200/90 shadow-2xs overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-700">
                      <thead className="bg-[#FAF5E9]/60 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Category & Condition</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Views</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredListings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-neutral-50/70 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={listing.images[0]}
                                  alt=""
                                  className="size-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-neutral-900 line-clamp-1">{listing.title}</p>
                                  <p className="text-[10px] text-neutral-400">ID: #{listing.id}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="font-semibold text-neutral-800">{listing.category}</span>
                              <p className="text-[10px] text-neutral-500">
                                {listing.condition === 'NEW' ? 'Brand New' : listing.condition.replace(/_/g, ' ')}
                              </p>
                            </td>

                            <td className="p-3">
                              <span className="font-serif font-black text-sm text-[#1f3a2e]">৳{listing.price}</span>
                              {listing.originalPrice && (
                                <span className="ml-1 text-[11px] text-neutral-400 line-through">৳{listing.originalPrice}</span>
                              )}
                            </td>

                            <td className="p-3">
                              <span className={`font-bold ${listing.stock <= 2 ? 'text-amber-600' : 'text-neutral-800'}`}>
                                {listing.stock} units
                              </span>
                            </td>

                            <td className="p-3">
                              {listing.status === 'ACTIVE' && (
                                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  Active
                                </span>
                              )}
                              {listing.status === 'PENDING' && (
                                <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                  Pending Approval
                                </span>
                              )}
                              {listing.status === 'SOLD' && (
                                <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                                  Sold Out
                                </span>
                              )}
                              {listing.status === 'DRAFT' && (
                                <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                                  Draft
                                </span>
                              )}
                            </td>

                            <td className="p-3 font-mono text-neutral-600">
                              {listing.viewsCount}
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {listing.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => handleToggleListingStatus(listing, 'DRAFT')}
                                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500"
                                    title="Pause listing"
                                  >
                                    <Pause className="size-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleListingStatus(listing, 'ACTIVE')}
                                    className="p-1.5 rounded hover:bg-neutral-100 text-emerald-700 font-bold"
                                    title="Activate listing"
                                  >
                                    <Play className="size-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setEditingListing(listing)
                                    setActiveTab('new-listing')
                                  }}
                                  className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
                                  title="Edit listing"
                                >
                                  <Edit className="size-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                                  title="Delete listing"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. CREATE / EDIT LISTING VIEW */}
            {activeTab === 'new-listing' && (
              <div className="animate-in fade-in">
                <ListingForm
                  initialListing={editingListing}
                  onSubmit={handleSaveListing}
                  onCancel={() => {
                    setEditingListing(null)
                    setActiveTab('listings')
                  }}
                />
              </div>
            )}

            {/* 4. ORDERS VIEW */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      Orders to Fulfill ({myOrders.length})
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Pack items and hand them over directly at your designated campus spot.
                    </p>
                  </div>
                </div>

                <OrderTable orders={myOrders} onUpdateStatus={handleUpdateOrderStatus} />
              </div>
            )}

            {/* 5. MESSAGES VIEW */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 items-start animate-in fade-in">
                
                {/* Conversation List */}
                <div className="rounded-xl bg-white border border-neutral-200/90 shadow-2xs p-3 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 mb-2 px-1">
                    Buyer Inquiries ({myConversations.length})
                  </h3>
                  {myConversations.length === 0 ? (
                    <p className="text-xs text-neutral-400 p-2">No active messages.</p>
                  ) : (
                    myConversations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setActiveConversationId(c.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                          activeConversationId === c.id
                            ? 'border-[#1f3a2e] bg-[#FAF5E9]/70 font-bold'
                            : 'border-transparent hover:bg-neutral-50'
                        }`}
                      >
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {c.buyerName}
                        </p>
                        {c.listingTitle && (
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            Re: {c.listingTitle}
                          </p>
                        )}
                        <p className="text-[10px] text-neutral-400 mt-1 truncate">
                          {c.messages[c.messages.length - 1]?.text || 'No messages yet'}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Active Chat Window */}
                {activeConversation ? (
                  <ChatWindow
                    conversation={activeConversation}
                    currentUserId={currentUser.id}
                    onSendMessage={handleSendMessage}
                    onReport={(reason) => showToast(`Report filed: ${reason}`)}
                  />
                ) : (
                  <div className="rounded-xl bg-white border border-neutral-200 p-12 text-center text-neutral-400">
                    <MessageSquare className="size-8 mx-auto mb-2" />
                    <p className="text-xs">Select a conversation to reply</p>
                  </div>
                )}
              </div>
            )}

            {/* 6. EARNINGS & PAYOUTS VIEW */}
            {activeTab === 'earnings' && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* Balance Summary Card */}
                <div className="rounded-xl bg-gradient-to-r from-[#1f3a2e] to-[#2e5442] text-white p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-neutral-300 uppercase tracking-wider font-semibold">
                      Available Net Balance
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-black mt-1">
                      ৳{sellerProfile?.balance || 0}
                    </h2>
                    <p className="text-xs text-neutral-300 mt-1">
                      5% platform commission already deducted. 100% of this amount is payable to you.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="rounded-lg bg-[#b5573a] px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#9c452b] transition-colors shadow-md"
                  >
                    Request Payout →
                  </button>
                </div>

                {/* Payout History Table */}
                <div className="rounded-xl bg-white border border-neutral-200/90 shadow-2xs">
                  <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-neutral-900">Payout Transfer History</h3>
                    <span className="text-xs text-neutral-400">Direct bKash / Nagad Transfers</span>
                  </div>

                  {myPayouts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      No payout requests yet. Hand over campus orders to accrue balance.
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 text-xs">
                      {myPayouts.map((p) => (
                        <div key={p.id} className="p-4 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-900">৳{p.amount} Requested</span>
                            <p className="text-[11px] text-neutral-500">
                              Via {p.method.toUpperCase()} ({p.accountNumber}) • Net: ৳{p.netAmount}
                            </p>
                            <span className="text-[10px] text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span
                            className={`rounded px-2.5 py-1 text-xs font-bold ${
                              p.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. REVIEWS VIEW */}
            {activeTab === 'reviews' && (
              <div className="rounded-xl bg-white p-6 border border-neutral-200/90 shadow-2xs animate-in fade-in space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Customer Ratings & Reviews</h2>
                    <p className="text-xs text-neutral-500">Feedback from verified students and faculty on campus.</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-amber-800 font-bold text-xs border border-amber-200">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span>{sellerProfile?.rating || 5.0} Store Rating</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { author: 'Zareen Subah', date: 'Yesterday', rating: 5, comment: 'Received hoodie at Library plaza within 30 mins. Great quality and warm!' },
                    { author: 'Farhan Kabir', date: '3 days ago', rating: 5, comment: 'Calculus solved notes matched our mock questions exactly. Lifesaver!' },
                    { author: 'Saif Chowdhury', date: '1 week ago', rating: 5, comment: 'Pristine packaging and smooth bKash payment. Highly recommended seller.' },
                  ].map((rev, i) => (
                    <div key={i} className="rounded-lg bg-[#FAF5E9]/50 p-3 border border-neutral-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-neutral-900">
                        <span>{rev.author}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 my-1">
                        {Array.from({ length: rev.rating }).map((_, r) => (
                          <Star key={r} className="size-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-neutral-700">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. STORE SETTINGS VIEW */}
            {activeTab === 'settings' && (
              <div className="rounded-xl bg-white p-6 border border-neutral-200/90 shadow-2xs animate-in fade-in space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <h2 className="text-base font-bold text-neutral-900">Store Settings</h2>
                  <p className="text-xs text-neutral-500">Update pickup location, payout accounts, and contact info.</p>
                </div>

                <div className="space-y-3 max-w-lg text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      defaultValue={sellerProfile?.storeName}
                      className="w-full rounded-lg border border-neutral-300 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Campus Pickup Location</label>
                    <input
                      type="text"
                      defaultValue={sellerProfile?.pickupLocation}
                      className="w-full rounded-lg border border-neutral-300 p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Payout Account</label>
                    <input
                      type="text"
                      defaultValue={sellerProfile?.payoutNumber}
                      className="w-full rounded-lg border border-neutral-300 p-2.5 font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => showToast('Store settings saved successfully!')}
                      className="rounded-lg bg-[#1f3a2e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
                    >
                      Save Settings
                    </button>
                    <Link
                      href="/seller/profile"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-[#1f3a2e] hover:bg-neutral-50 shadow-2xs"
                    >
                      <span>Full Shop Profile, Vacation Mode & Verification Tiers →</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>

      {/* MOBILE SELLER HUB BOTTOM TAB BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-xl px-2 py-1.5 flex items-center justify-around text-neutral-600">
        {[
          { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard className="size-4" /> },
          { id: 'listings', label: 'Listings', icon: <Package className="size-4" /> },
          { id: 'orders', label: 'Orders', icon: <ShoppingBag className="size-4" /> },
          { id: 'messages', label: 'Chats', icon: <MessageSquare className="size-4" /> },
          { id: 'earnings', label: 'Payouts', icon: <DollarSign className="size-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'listings') setEditingListing(null)
              setActiveTab(tab.id as any)
            }}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
              activeTab === tab.id ? 'text-[#1f3a2e] font-bold' : ''
            }`}
          >
            <div className={activeTab === tab.id ? 'text-[#b5573a]' : ''}>{tab.icon}</div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* REQUEST PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200">
            <h3 className="font-serif text-lg font-bold text-neutral-900">Request Payout</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Available Balance: <strong>৳{sellerProfile?.balance || 0}</strong>
            </p>

            <form onSubmit={handleRequestPayout} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Amount to Withdraw (৳)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={sellerProfile?.balance || 10000}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 p-2 font-bold text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Payout Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bkash')}
                    className={`py-2 rounded-lg border font-bold ${
                      payoutMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]' : 'border-neutral-200'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('nagad')}
                    className={`py-2 rounded-lg border font-bold ${
                      payoutMethod === 'nagad' ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]' : 'border-neutral-200'
                    }`}
                  >
                    Nagad
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 p-2 font-mono"
                />
              </div>

              <div className="rounded-lg bg-neutral-50 p-2 text-[11px] text-neutral-500">
                Net transfer after 5% platform commission: <strong>৳{Math.round(payoutAmount * 0.95)}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1f3a2e] px-4 py-1.5 font-bold text-white hover:bg-[#b5573a]"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
