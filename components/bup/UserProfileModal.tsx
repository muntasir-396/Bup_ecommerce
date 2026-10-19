'use client'

import React from 'react'
import {
  X,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  LogOut,
  Mail,
  Phone,
  CheckCircle,
  ShoppingBag,
  Store
} from 'lucide-react'
import { UserProfile } from '@/lib/types'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserProfile | null
  onSignOut: () => void
  onOpenStallBooking?: () => void
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onSignOut,
}: UserProfileModalProps) {
  if (!isOpen || !user) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#FAF5E9] shadow-2xl text-[#392525] border border-[#392525]/15">
        
        {/* Header */}
        <div className="bg-[#213527] p-6 text-[#FAF5E9] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close profile modal"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#E3E890] text-[#213527] text-2xl font-bold shadow-md">
              {user.role === 'student' ? '🎓' : user.role === 'faculty' ? '🏛️' : '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  user.isBupVerified
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-white/20 text-white'
                }`}>
                  {user.role === 'student' ? 'BUP Verified Student' : user.role === 'faculty' ? 'BUP Faculty' : 'Guest Account'}
                </span>
              </div>
              <h3 id="profile-title" className="font-serif text-2xl font-bold text-white mt-0.5">
                {user.name}
              </h3>
              {user.studentId && (
                <p className="text-xs text-[#FAF5E9]/80 font-mono">
                  ID: {user.studentId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="rounded-2xl border border-[#392525]/10 bg-white p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#392525]">
              <Mail className="size-4 text-[#728383] shrink-0" />
              <div>
                <span className="text-[10px] text-[#728383] block">Official Email:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
            </div>

            {user.department && (
              <div className="flex items-center gap-2.5 text-[#392525]">
                <GraduationCap className="size-4 text-[#728383] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#728383] block">Department & Faculty:</span>
                  <span className="font-semibold">{user.department}</span>
                  <p className="text-[11px] text-[#728383]">{user.faculty}</p>
                </div>
              </div>
            )}

            {user.phone && (
              <div className="flex items-center gap-2.5 text-[#392525]">
                <Phone className="size-4 text-[#728383] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#728383] block">Phone Contact:</span>
                  <span className="font-semibold">{user.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Privileges Badge */}
          <div className="rounded-2xl bg-[#E3E890]/40 border border-[#392525]/10 p-3.5 text-xs text-[#392525]">
            <p className="font-bold flex items-center gap-1.5 text-[#213527]">
              <ShieldCheck className="size-4 text-[#213527]" />
              <span>Active Account Privileges</span>
            </p>
            <ul className="mt-2 space-y-1 text-[11px] text-[#3E4734]/90 list-disc list-inside">
              {user.isBupVerified ? (
                <>
                  <li>5% automatic discount on all campus purchases</li>
                  <li>Free delivery anywhere inside Mirpur Cantonment</li>
                  <li>15% student club concession on stall space bookings</li>
                  <li>Direct order placement with BUP Smart Card</li>
                </>
              ) : (
                <>
                  <li>Campus merchandise ordering & delivery to Mirpur</li>
                  <li>Pop-up stall vendor registration privilege</li>
                  <li>Event ticketing & reservation access</li>
                </>
              )}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-[#392525]/20 py-3 text-xs font-bold hover:bg-white/60"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSignOut()
                onClose()
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-xs font-bold text-white hover:bg-red-800 transition-colors"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
