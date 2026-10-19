'use client'

import React from 'react'
import {
  X,
  Compass,
  Sun,
  Moon,
  ArrowRight,
  Store,
  Users,
  Zap,
  CheckCircle2,
  Maximize2
} from 'lucide-react'
import { Stall, UserProfile } from '@/lib/types'
import { BupArchitecturalMap } from './BupArchitecturalMap'

interface ExpandedMasterplanModalProps {
  isOpen: boolean
  onClose: () => void
  stalls: Stall[]
  activeStallId: string
  onSelectStall: (stallId: string) => void
  onConfirmBooking: (stall: Stall) => void
  isNightMode: boolean
  onToggleNightMode: () => void
  currentUser: UserProfile | null
  selectedZone: string
  onSelectZone: (zone: string) => void
}

const ZONES = [
  'All Zones',
  'Lakeside & Vista',
  'Academic Wing (FST/FBS)',
  'Auditorium Plaza',
  'Central Library',
  'Sports Grounds',
] as const

export function ExpandedMasterplanModal({
  isOpen,
  onClose,
  stalls,
  activeStallId,
  onSelectStall,
  onConfirmBooking,
  isNightMode,
  onToggleNightMode,
  currentUser,
  selectedZone,
  onSelectZone,
}: ExpandedMasterplanModalProps) {
  if (!isOpen) return null

  const activeStall = stalls.find((s) => s.id === activeStallId) || stalls[0]

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expanded-map-title"
    >
      {/* Top Navigation & Controls Header */}
      <div className="flex items-center justify-between border-b border-white/15 bg-[#141e17] px-6 py-4 text-[#FAF5E9]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#E3E890] text-[#141e17] font-bold">
            <Compass className="size-6" />
          </span>
          <div>
            <h2 id="expanded-map-title" className="font-serif text-xl font-bold leading-tight">
              BUP Campus Spatial Masterplan (Expanded View)
            </h2>
            <p className="text-xs text-[#FAF5E9]/70">
              Mirpur Cantonment, Dhaka-1216 • Click any spot on the architectural map to select
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Day / Night Fest Toggle */}
          <button
            onClick={onToggleNightMode}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
          >
            {isNightMode ? (
              <>
                <Sun className="size-3.5 text-[#E3E890]" />
                <span>Day View</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-[#E3E890]" />
                <span>Night Glow</span>
              </>
            )}
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close expanded masterplan"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Zone Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 bg-[#0f1712] px-6 py-2.5 text-xs scrollbar-none">
        <span className="font-bold text-white/50 shrink-0">Filter Zone:</span>
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => onSelectZone(zone)}
            className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
              selectedZone === zone
                ? 'bg-[#E3E890] text-[#141e17] font-bold shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Main Expansive Architectural Canvas */}
      <div className="relative flex-1 p-4 overflow-hidden">
        <BupArchitecturalMap
          stalls={stalls}
          activeStallId={activeStallId}
          onSelectStall={onSelectStall}
          isNightMode={isNightMode}
          isExpanded={true}
        />
      </div>

      {/* Floating Bottom Quick Selection & Confirmation Bar */}
      {activeStall && (
        <div className="border-t border-white/15 bg-[#141e17] px-6 py-3.5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeStall.image}
              alt={activeStall.name}
              className="size-14 rounded-xl object-cover border border-white/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#E3E890] px-2 py-0.5 text-[10px] font-black text-[#141e17]">
                  STALL {activeStall.id}
                </span>
                <span className="text-xs font-bold text-[#E3E890]">
                  {activeStall.zone}
                </span>
                <span className="text-xs text-white/60">•</span>
                <span className="text-xs text-white/75">{activeStall.dimensions}</span>
              </div>
              <h4 className="font-serif text-base font-bold text-white mt-0.5">
                {activeStall.name}
              </h4>
              <p className="text-xs text-white/70 flex items-center gap-2">
                <span className="text-[#E3E890] font-black">৳{activeStall.dailyRate}/day</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="size-3 text-[#E3E890]" /> {activeStall.footfall}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="rounded-full border border-white/30 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10"
            >
              Close & Keep Viewing
            </button>
            <button
              onClick={() => {
                onClose()
                onConfirmBooking(activeStall)
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full bg-[#E3E890] px-6 py-2.5 text-xs font-black text-[#141e17] shadow-lg hover:bg-white transition-all"
            >
              <span>Choose & Reserve Stall {activeStall.id}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
