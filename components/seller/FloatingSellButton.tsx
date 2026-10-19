'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useBup } from '@/context/BupContext'

export function FloatingSellButton() {
  const pathname = usePathname()
  const { currentUser } = useBup()

  // Hide on seller hub itself
  if (pathname?.startsWith('/seller')) {
    return null
  }

  const destination = currentUser
    ? currentUser.role === 'student' || (currentUser as any).isSeller
      ? '/seller'
      : '/seller/onboard'
    : '/seller/onboard'

  return (
    <div className="fixed bottom-18 md:bottom-6 right-4 z-40">
      <Link
        href={destination}
        className="flex items-center gap-2 rounded-full bg-[#b5573a] px-4 py-3 text-xs sm:text-sm font-black text-white shadow-2xl hover:bg-[#9c452b] transition-all hover:scale-105 active:scale-95 border-2 border-white/30"
        title="Sell on BUPCommon"
      >
        <Plus className="size-5 stroke-[2.5]" />
        <span>Sell</span>
        <span className="hidden sm:inline-block rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
          0% fee
        </span>
      </Link>
    </div>
  )
}

