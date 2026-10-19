'use client'

import React from 'react'
import { MapPin, X, Check, Building, Sparkles } from 'lucide-react'
import { useBup } from '@/context/BupContext'

const CAMPUS_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'BUP Campus, Mirpur Cantonment',
    detail: 'Standard Mirpur 12 Entrance & Security Checkpoint',
    type: 'Primary Campus',
  },
  {
    id: 'loc-2',
    name: 'BUP Central Library Plaza',
    detail: 'Ground Floor Lounge & Study Courtyard',
    type: 'Academic Hub',
  },
  {
    id: 'loc-3',
    name: 'Faculty of Science & Technology (FST)',
    detail: 'Atrium Entrance & ICE / CSE Labs',
    type: 'Academic Wing',
  },
  {
    id: 'loc-4',
    name: 'Faculty of Business Studies (FBS)',
    detail: 'West Academic Lobby & Career Club Corner',
    type: 'Academic Wing',
  },
  {
    id: 'loc-5',
    name: 'Vista & Central Canteen Counter',
    detail: 'Express Pre-order Counter #2',
    type: 'Dining Zone',
  },
  {
    id: 'loc-6',
    name: 'Lake Promenade Boardwalk',
    detail: 'Bench #4 Waterfront Shaded Pavilion',
    type: 'Recreational Area',
  },
  {
    id: 'loc-7',
    name: 'BUP Central Athletics Ground',
    detail: 'Pavilion Spectator Gallery & Track',
    type: 'Sports Ground',
  },
]

export function LocationModal() {
  const {
    isLocationModalOpen,
    closeLocationModal,
    deliveryLocation,
    setDeliveryLocation,
  } = useBup()

  if (!isLocationModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[#FAF5E9] text-[#b5573a]">
              <MapPin className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Choose Delivery Spot
              </h3>
              <p className="text-xs text-neutral-500">
                Campus runners deliver directly to your spot
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Location List */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1">
          {CAMPUS_LOCATIONS.map((loc) => {
            const isSelected = deliveryLocation === loc.name
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setDeliveryLocation(loc.name)
                  closeLocationModal()
                }}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#1f3a2e] bg-[#FAF5E9]/60 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 size-2 rounded-full ${isSelected ? 'bg-[#b5573a]' : 'bg-neutral-300'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-neutral-900">
                        {loc.name}
                      </p>
                      <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-500">
                        {loc.type}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{loc.detail}</p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="size-4 text-[#1f3a2e] shrink-0 mt-0.5" />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>⚡ Free delivery on all campus locations</span>
          <button
            onClick={closeLocationModal}
            className="rounded-md bg-[#1f3a2e] px-4 py-2 font-bold text-white hover:bg-[#b5573a] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
