'use client'

import React, { useState, useMemo } from 'react'
import {
  Store,
  MapPin,
  Sparkles,
  Zap,
  Users,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  Search,
  Filter,
  Maximize2,
  Compass,
  Layers,
  Flame,
  ShieldCheck,
  ChevronRight,
  Plus,
  Info
} from 'lucide-react'
import { Stall, UserProfile } from '@/lib/types'
import { BupArchitecturalMap } from './BupArchitecturalMap'
import { ExpandedMasterplanModal } from './ExpandedMasterplanModal'

interface ExtravagantStallSectionProps {
  stalls: Stall[]
  onSelectStallForBooking: (stall: Stall) => void
  currentUser: UserProfile | null
  onOpenAuth: () => void
}

const ZONES = [
  'All Zones',
  'Lakeside & Vista',
  'Academic Wing (FST/FBS)',
  'Auditorium Plaza',
  'Central Library',
  'Sports Grounds',
] as const

interface AddOnOption {
  id: string
  label: string
  price: number
}

const ADD_ONS: AddOnOption[] = [
  { id: 'table', label: '1.8m Exhibition Table', price: 50 },
  { id: 'banner', label: 'Modular Banner Frame', price: 30 },
  { id: 'led', label: 'Directional Canopy Spotlights', price: 80 },
  { id: 'sound', label: 'PA & Wireless Mic Authorization', price: 150 },
]

export function ExtravagantStallSection({
  stalls,
  onSelectStallForBooking,
  currentUser,
  onOpenAuth,
}: ExtravagantStallSectionProps) {
  const [selectedZone, setSelectedZone] = useState<string>('All Zones')
  const [searchQuery, setSearchQuery] = useState('')
  const [isNightMode, setIsNightMode] = useState(false)
  const [activeStallId, setActiveStallId] = useState<string>(stalls[0]?.id || 'LAKE-01')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [bookingDays, setBookingDays] = useState<number>(1)
  const [hoveredStall, setHoveredStall] = useState<Stall | null>(null)
  const [mobileTab, setMobileTab] = useState<'map' | 'details'>('map')
  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false)

  // Filtered Stalls
  const filteredStalls = useMemo(() => {
    return stalls.filter((s) => {
      const matchZone = selectedZone === 'All Zones' || s.zone === selectedZone
      const matchQuery =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.side.toLowerCase().includes(searchQuery.toLowerCase())
      return matchZone && matchQuery
    })
  }, [stalls, selectedZone, searchQuery])

  // Active Stall object
  const activeStall = useMemo(() => {
    return stalls.find((s) => s.id === activeStallId) || stalls[0]
  }, [stalls, activeStallId])

  // Addon toggler
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }

  // Cost calculation
  const baseRate = activeStall?.dailyRate || 0
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = ADD_ONS.find((a) => a.id === id)
    return sum + (item ? item.price : 0)
  }, 0)
  const dailyTotal = baseRate + addonsTotal
  const grossTotal = dailyTotal * bookingDays
  const studentDiscount = currentUser?.isBupVerified ? Math.round(grossTotal * 0.15) : 0
  const netTotal = Math.max(0, grossTotal - studentDiscount)

  return (
    <section id="stalls" className="relative px-5 py-20 lg:px-10 lg:py-28 overflow-hidden transition-colors duration-700">
      
      {/* Background ambient lighting */}
      <div
        className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
          isNightMode
            ? 'bg-gradient-to-b from-[#09120c] via-[#0e1a12] to-[#09120c]'
            : 'bg-gradient-to-b from-[#FAF5E9] via-[#FAF5E9] to-[#FAF5E9]'
        }`}
      />

      <div className="relative mx-auto max-w-7xl">
        
        {/* SECTION HEADER & CONTROL BAR */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-[#392525]/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#213527]/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#213527] shadow-sm mb-3">
              <Compass className="size-4 text-[#B25D3E]" />
              BUP Spatial Masterplan • Mirpur Cantonment
            </div>
            <h2 className={`font-serif text-4xl sm:text-6xl font-bold tracking-tight transition-colors duration-500 ${
              isNightMode ? 'text-white' : 'text-[#392525]'
            }`}>
              Reserve Your Corner,{' '}
              <span className="text-[#B25D3E] underline decoration-[#E3E890] decoration-wavy decoration-2">
                Live in Bird&apos;s-Eye View.
              </span>
            </h2>
            <p className={`mt-3 max-w-2xl text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
              isNightMode ? 'text-[#FAF5E9]/80' : 'text-[#3E4734]/85'
            }`}>
              Architectural bird&apos;s-eye layout of Bangladesh University of Professionals. Click the map to open an enlarged view, inspect live student footfall, and pick your stall by the lake or academic corridors.
            </p>
          </div>

          {/* Ambience & Theme Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
                isNightMode
                  ? 'bg-[#E3E890] text-[#141f17] hover:bg-white'
                  : 'bg-[#213527] text-[#FAF5E9] hover:bg-[#18261c]'
              }`}
              title="Toggle Day / Night Fest Illumination"
            >
              {isNightMode ? (
                <>
                  <Sun className="size-4 text-[#B25D3E]" />
                  <span>Daylight View</span>
                </>
              ) : (
                <>
                  <Moon className="size-4 text-[#E3E890]" />
                  <span>Night Fest Glow</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsExpandedModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#213527]/30 bg-white px-4 py-2.5 text-xs font-bold text-[#213527] shadow-md hover:bg-[#FAF5E9] transition-all hover:scale-105"
            >
              <Maximize2 className="size-3.5 text-[#B25D3E]" />
              <span>Expand Map (Full View)</span>
            </button>
          </div>
        </div>

        {/* ZONE SELECTOR & SEARCH BAR */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Zone Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {ZONES.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedZone === zone
                    ? 'bg-[#213527] text-[#FAF5E9] shadow-md scale-105'
                    : isNightMode
                    ? 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                    : 'bg-white/90 text-[#3E4734] hover:bg-white hover:text-[#213527] border border-[#392525]/10 shadow-2xs'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#728383]" />
            <input
              type="text"
              placeholder="Search stall ID or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-full border py-2.5 pl-9 pr-4 text-xs font-semibold outline-none transition focus:border-[#B25D3E] ${
                isNightMode
                  ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15'
                  : 'bg-white border-[#392525]/15 text-[#392525] placeholder:text-[#728383] shadow-sm'
              }`}
            />
          </div>
        </div>

        {/* MOBILE VIEW TOGGLE */}
        <div className="mt-6 flex md:hidden rounded-2xl bg-white/90 p-1 border border-[#392525]/15 shadow-sm">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'map' ? 'bg-[#213527] text-[#FAF5E9] shadow-sm' : 'text-[#3E4734]'
            }`}
          >
            Site Masterplan
          </button>
          <button
            onClick={() => setMobileTab('details')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'details' ? 'bg-[#213527] text-[#FAF5E9] shadow-sm' : 'text-[#3E4734]'
            }`}
          >
            Plot Specifications
          </button>
        </div>

        {/* MAIN STAGE: BIRD'S-EYE ARCHITECTURAL CANVAS & CONTROL COCKPIT */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE ARCHITECTURAL BIRD'S-EYE MAP (7 COLS) */}
          <div
            className={`lg:col-span-7 ${
              mobileTab === 'map' ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="relative group cursor-pointer" onClick={() => setIsExpandedModalOpen(true)}>
              <BupArchitecturalMap
                stalls={filteredStalls}
                activeStallId={activeStallId}
                onSelectStall={(id) => {
                  setActiveStallId(id)
                  setMobileTab('details')
                }}
                isNightMode={isNightMode}
                onExpandMap={() => setIsExpandedModalOpen(true)}
                hoveredStall={hoveredStall}
                setHoveredStall={setHoveredStall}
              />
              
              {/* Subtle hover expand banner */}
              <div className="absolute inset-x-0 bottom-14 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="rounded-full bg-[#121c15]/95 text-white px-4 py-1.5 text-xs font-medium shadow-xl backdrop-blur-md border border-white/20">
                  Click masterplan to view in full resolution
                </span>
              </div>
            </div>

            {/* Quick Landmark Jump Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-mono font-semibold ${isNightMode ? 'text-white/60' : 'text-[#728383]'}`}>
                Key Locations:
              </span>
              <button
                onClick={() => setActiveStallId('LAKE-01')}
                className={`rounded-lg px-3 py-1 font-mono text-[11px] transition-all ${
                  isNightMode
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    : 'bg-white border border-[#392525]/15 text-[#392525] hover:border-[#213527]'
                }`}
              >
                Plot L-01: Central Lake
              </button>
              <button
                onClick={() => setActiveStallId('VISTA-01')}
                className={`rounded-lg px-3 py-1 font-mono text-[11px] transition-all ${
                  isNightMode
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    : 'bg-white border border-[#392525]/15 text-[#392525] hover:border-[#213527]'
                }`}
              >
                Plot V-01: Vista Entry
              </button>
              <button
                onClick={() => setActiveStallId('PLAZA-01')}
                className={`rounded-lg px-3 py-1 font-mono text-[11px] transition-all ${
                  isNightMode
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    : 'bg-white border border-[#392525]/15 text-[#392525] hover:border-[#213527]'
                }`}
              >
                Plot P-01: Bijoy Plaza
              </button>
              <button
                onClick={() => setActiveStallId('FST-01')}
                className={`rounded-lg px-3 py-1 font-mono text-[11px] transition-all ${
                  isNightMode
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    : 'bg-white border border-[#392525]/15 text-[#392525] hover:border-[#213527]'
                }`}
              >
                Plot T-01: FST Atrium
              </button>
            </div>
          </div>

          {/* RIGHT: THE STALL CONTROL & RESERVATION COCKPIT (5 COLS) */}
          <div
            className={`lg:col-span-5 ${
              mobileTab === 'details' ? 'block' : 'hidden md:block'
            }`}
          >
            {activeStall ? (
              <div className="rounded-[2.5rem] bg-white border border-[#392525]/15 shadow-2xl p-6 sm:p-7 text-[#392525] flex flex-col justify-between">
                
                {/* Stall Header & Photo */}
                <div>
                  <div className="relative h-48 sm:h-56 w-full rounded-3xl overflow-hidden shadow-md">
                    <img
                      src={activeStall.image}
                      alt={activeStall.name}
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    <span className="absolute top-4 left-4 rounded-full bg-[#E3E890] px-3.5 py-1 text-xs font-black text-[#211515] shadow-md">
                      STALL {activeStall.id}
                    </span>

                    <span
                      className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md ${
                        activeStall.status === 'Popular'
                          ? 'bg-[#B25D3E]'
                          : activeStall.status === 'Reserved'
                          ? 'bg-neutral-800'
                          : 'bg-emerald-700'
                      }`}
                    >
                      {activeStall.status === 'Reserved'
                        ? 'Booked by ' + (activeStall.reservedBy?.slice(0, 16) || 'Club')
                        : activeStall.status}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E3E890]">
                        {activeStall.zone}
                      </p>
                      <h3 className="font-serif text-2xl font-bold leading-tight text-white mt-0.5">
                        {activeStall.name}
                      </h3>
                      <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                        <MapPin className="size-3 text-[#E3E890]" /> {activeStall.side} • {activeStall.dimensions}
                      </p>
                    </div>
                  </div>

                  {/* Footfall & Rush Analytics Meter */}
                  <div className="mt-4 rounded-2xl bg-[#FAF5E9]/80 p-4 border border-[#392525]/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-[#213527]">
                        <Users className="size-4 text-[#B25D3E]" />
                        <span>Daily Student Footfall:</span>
                      </span>
                      <span className="font-extrabold text-[#B25D3E] text-sm">
                        {activeStall.footfall}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-[#392525]/10 pt-2 text-[#3E4734]">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Clock className="size-3.5 text-[#213527]" />
                        <span>Peak Rush:</span>
                      </span>
                      <span className="font-bold text-[11px] text-[#213527]">
                        {activeStall.peakHours}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 text-[11px] text-[#3E4734]/85 leading-relaxed border border-[#392525]/10 shadow-2xs">
                      <strong>Atmosphere:</strong> {activeStall.ambience}
                    </div>
                  </div>

                  {/* Power & Grid Amenities */}
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#3E4734]">
                      Stall Amenities & Power Hookup
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {activeStall.features.map((feat) => (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1 rounded-full bg-[#FAF5E9] px-3 py-1 text-xs font-semibold text-[#213527] border border-[#392525]/10 shadow-2xs"
                        >
                          <Zap className="size-3 text-[#B25D3E]" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add-on Equipment Selection */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#3E4734]">
                        Equipment Add-ons
                      </p>
                      <span className="text-[10px] text-[#728383]">Optional</span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      {ADD_ONS.map((addon) => {
                        const isSelected = selectedAddons.includes(addon.id)
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleAddon(addon.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#213527] bg-[#213527]/10 text-[#213527] font-bold shadow-2xs'
                                : 'border-[#392525]/15 bg-[#FAF5E9]/50 text-[#392525] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`size-3.5 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#213527] border-[#213527] text-white' : 'border-[#392525]/30 bg-white'
                              }`}>
                                {isSelected && <CheckCircle2 className="size-3" />}
                              </span>
                              <span className="truncate text-[11px] font-medium">{addon.label}</span>
                            </div>
                            <span className="font-bold shrink-0 ml-1 text-[#B25D3E] text-[11px]">
                              +৳{addon.price}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Booking Duration */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#392525]/10 pt-4 text-xs font-bold">
                    <span className="text-[#3E4734]">Reservation Duration:</span>
                    <select
                      value={bookingDays}
                      onChange={(e) => setBookingDays(Number(e.target.value))}
                      className="rounded-xl border border-[#392525]/20 bg-[#FAF5E9] px-3 py-1.5 text-xs font-bold text-[#213527] outline-none"
                    >
                      <option value={1}>1 Campus Day</option>
                      <option value={2}>2 Campus Days</option>
                      <option value={3}>3 Days (Fest Weekend)</option>
                      <option value={5}>5 Days (Weekly Expo)</option>
                    </select>
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="mt-4 rounded-2xl bg-[#FAF5E9] p-4 border border-[#392525]/15 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#3E4734]">
                      <span>Base Rate ({bookingDays} {bookingDays === 1 ? 'day' : 'days'})</span>
                      <span className="font-bold">৳{baseRate * bookingDays}</span>
                    </div>

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-[#3E4734]">
                        <span>Add-on Equipment</span>
                        <span className="font-bold text-[#B25D3E]">+৳{addonsTotal * bookingDays}</span>
                      </div>
                    )}

                    {currentUser?.isBupVerified ? (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>BUP Student Club Concession (15%)</span>
                        <span>-৳{studentDiscount}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-[#728383] text-[11px]">
                        <span>Student discount</span>
                        <button
                          type="button"
                          onClick={onOpenAuth}
                          className="text-[#B25D3E] underline font-bold"
                        >
                          Sign in for 15% off
                        </button>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-2 border-t border-[#392525]/10 text-base font-bold text-[#392525]">
                      <span>Total Rent:</span>
                      <span className="font-serif text-2xl text-[#B25D3E]">
                        ৳{netTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <div className="mt-6">
                  {activeStall.status === 'Reserved' ? (
                    <div className="rounded-full bg-neutral-200 py-3.5 text-center text-xs font-bold text-neutral-600">
                      Currently Reserved by {activeStall.reservedBy || 'Campus Society'}
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectStallForBooking(activeStall)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#213527] py-4 text-sm font-bold text-[#FAF5E9] shadow-lg transition-all hover:bg-[#152319] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Proceed with Stall {activeStall.id}</span>
                      <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>

              </div>
            ) : null}
          </div>

        </div>

      </div>

      {/* EXPANDED FULLSCREEN MASTERPLAN MODAL */}
      <ExpandedMasterplanModal
        isOpen={isExpandedModalOpen}
        onClose={() => setIsExpandedModalOpen(false)}
        stalls={filteredStalls}
        activeStallId={activeStallId}
        onSelectStall={(id) => setActiveStallId(id)}
        onConfirmBooking={(stall) => {
          setIsExpandedModalOpen(false)
          onSelectStallForBooking(stall)
        }}
        isNightMode={isNightMode}
        onToggleNightMode={() => setIsNightMode(!isNightMode)}
        currentUser={currentUser}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />
    </section>
  )
}
