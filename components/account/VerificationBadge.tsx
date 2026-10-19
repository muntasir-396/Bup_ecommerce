'use client'

import React from 'react'
import { ShieldCheck, GraduationCap, Store, Clock, AlertCircle } from 'lucide-react'
import { UserProfile } from '@/lib/types'

interface VerificationBadgeProps {
  user: UserProfile | null
  size?: 'sm' | 'md' | 'lg'
  showSeller?: boolean
}

export function VerificationBadge({
  user,
  size = 'md',
  showSeller = true,
}: VerificationBadgeProps) {
  if (!user) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
        Guest Visitor
      </span>
    )
  }

  const isSeller = Boolean(user.isSeller || (user as any).sellerProfile)
  const isBupVerified = user.isBupVerified || user.verificationStatus === 'VERIFIED'
  const isPending = user.verificationStatus === 'PENDING'

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1 font-bold',
  }[size]

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {isBupVerified ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold ${sizeClasses}`}
        >
          <GraduationCap className="size-3.5 text-emerald-700" />
          <span>Verified Student</span>
        </span>
      ) : isPending ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold ${sizeClasses}`}
        >
          <Clock className="size-3 text-amber-600" />
          <span>Verification Pending</span>
        </span>
      ) : (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 font-medium ${sizeClasses}`}
        >
          <AlertCircle className="size-3 text-neutral-400" />
          <span>Unverified ID</span>
        </span>
      )}

      {showSeller && isSeller && (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-[#1f3a2e]/10 text-[#1f3a2e] border border-[#1f3a2e]/20 font-bold ${sizeClasses}`}
        >
          <Store className="size-3 text-[#1f3a2e]" />
          <span>Campus Seller</span>
        </span>
      )}
    </div>
  )
}
