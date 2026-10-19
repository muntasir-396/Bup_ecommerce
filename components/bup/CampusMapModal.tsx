'use client'

import React from 'react'
import {
  X,
  MapPin,
  Building,
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react'

interface CampusMapModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectZone?: (zoneName: string) => void
}

export function CampusMapModal({ isOpen, onClose }: CampusMapModalProps) {
  if (!isOpen) return null

  const locations = [
    { name: 'Faculty of Science & Technology (FST)', type: 'Academic', desc: 'Robotics lab, ICE dept, ground floor tech hub.' },
    { name: 'Faculty of Business Studies (FBS)', type: 'Academic', desc: 'BBA/MBA classrooms, corridor stalls, business incubator.' },
    { name: 'Central Library & Reading Hall', type: 'Study', desc: 'Quiet air-conditioned study decks, book collection zone.' },
    { name: 'BUP Central Lake & Promenade', type: 'Recreation', desc: 'Lake view cafes, evening open pop-up stalls, gazebo.' },
    { name: 'Central Canteen & Food Deck', type: 'Dining', desc: 'Student lunches, coffee points, and pre-order counters.' },
    { name: 'Vista Hall & Student Hostels', type: 'Residential', desc: 'Dormitory living, late night food drop point.' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-[#FAF5E9] shadow-2xl text-[#392525] border border-[#392525]/15">
        
        {/* Header */}
        <div className="bg-[#728383] p-6 text-[#FAF5E9] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close map modal"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#E3E890] uppercase tracking-wider">
            <Compass className="size-4" />
            <span>Interactive Guide</span>
          </div>
          <h2 id="map-modal-title" className="font-serif text-3xl font-bold mt-1 text-white">
            BUP Mirpur Campus Layout
          </h2>
          <p className="text-xs text-[#FAF5E9]/80 mt-1">
            Bangladesh University of Professionals • Mirpur Cantonment, Dhaka
          </p>
        </div>

        {/* Visual Map Blueprint Diagram */}
        <div className="p-6">
          <div className="relative rounded-2xl bg-[#392525] p-5 text-white overflow-hidden border border-[#392525]/20 shadow-inner">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#FAF5E9 1.5px, transparent 1.5px)',
                backgroundSize: '18px 18px',
              }}
            />
            
            <div className="relative flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#E3E890]">
              <span>East Campus (FST & Labs)</span>
              <span>Central Lake Promenade</span>
              <span>West Campus (FBS & Sports)</span>
            </div>

            {/* Layout schematic */}
            <div className="my-6 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <p className="font-bold text-[#E3E890]">Stall A-01 / A-02</p>
                <p className="text-[10px] text-white/70">Garden Walk Promenade</p>
              </div>

              <div className="rounded-xl border border-[#B25D3E] bg-[#B25D3E]/30 p-3">
                <p className="font-bold text-white">Stall B-07 (Prime)</p>
                <p className="text-[10px] text-white/70">Lake Deck Pavilion</p>
              </div>

              <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                <p className="font-bold text-[#E3E890]">Stall C-03 / C-04</p>
                <p className="text-[10px] text-white/70">West Quad & Sports Corridor</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/60">
              <span>Main Gate (Mirpur-12)</span>
              <span>Campus Security Checkpoint 1</span>
              <span>North Gate (Lake Exit)</span>
            </div>
          </div>

          {/* Key Campus Landmarks */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {locations.map((loc) => (
              <div key={loc.name} className="rounded-xl border border-[#392525]/10 bg-white p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#392525] truncate">{loc.name}</span>
                  <span className="text-[10px] bg-[#FAF5E9] px-2 py-0.5 rounded font-semibold text-[#728383]">
                    {loc.type}
                  </span>
                </div>
                <p className="text-[11px] text-[#3E4734]/70 mt-1">{loc.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-full bg-[#392525] px-6 py-2.5 text-xs font-semibold text-[#FAF5E9] hover:bg-[#201414]"
            >
              Back to Campus
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
