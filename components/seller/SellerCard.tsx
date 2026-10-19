'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Star, MessageSquare, Store, MapPin, Package } from 'lucide-react'
import { useBup } from '@/context/BupContext'

interface SellerCardProps {
  sellerId: string
  sellerName: string
  storeName?: string
  rating?: number
  itemsSold?: number
  pickupLocation?: string
  isVerified?: boolean
  listingId?: string
  listingTitle?: string
}

export function SellerCard({
  sellerId,
  sellerName,
  storeName,
  rating = 4.9,
  itemsSold = 42,
  pickupLocation = 'BUP Campus Handover',
  isVerified = true,
  listingId,
  listingTitle,
}: SellerCardProps) {
  const router = useRouter()
  const { currentUser, openAuth } = useBup()

  const handleStartChat = () => {
    if (!currentUser) {
      openAuth('bup')
      return
    }
    // Navigate to messages with preselected seller and listing
    router.push(`/messages?sellerId=${sellerId}&listingId=${listingId || ''}`)
  }

  return (
    <div className="rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs my-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-[#1f3a2e] text-[#E3E890] font-black text-sm shrink-0">
            {storeName ? storeName.charAt(0) : sellerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm text-neutral-900 leading-tight">
                {storeName || sellerName}
              </h4>
              {isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="size-3" />
                  <span>Verified Student</span>
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-500 mt-0.5">
              By {sellerName}
            </p>

            <div className="mt-1.5 flex items-center gap-3 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-bold text-neutral-900">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span>{rating}</span>
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1">
                <Package className="size-3.5 text-neutral-400" />
                <span>{itemsSold} campus orders</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus pickup spot */}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#FAF5E9] p-2 text-xs text-neutral-700 border border-[#213527]/10">
        <MapPin className="size-3.5 text-[#b5573a] shrink-0" />
        <span className="truncate">
          Pickup: <strong>{pickupLocation}</strong>
        </span>
      </div>

      {/* Action Buttons: Chat with seller & View shop */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={handleStartChat}
          className="flex items-center justify-center gap-1.5 rounded-md border border-[#1f3a2e] bg-white py-2 text-xs font-bold text-[#1f3a2e] hover:bg-[#FAF5E9] transition-colors"
        >
          <MessageSquare className="size-3.5" />
          <span>Chat with Seller</span>
        </button>

        <Link
          href={`/shop/${sellerId}`}
          className="flex items-center justify-center gap-1.5 rounded-md bg-[#1f3a2e] py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
        >
          <Store className="size-3.5" />
          <span>View Shop</span>
        </Link>
      </div>
    </div>
  )
}
