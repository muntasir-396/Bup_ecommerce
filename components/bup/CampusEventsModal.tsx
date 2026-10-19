'use client'

import React from 'react'
import {
  X,
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { CampusEvent } from '@/lib/types'

interface CampusEventsModalProps {
  isOpen: boolean
  onClose: () => void
  events: CampusEvent[]
}

export function CampusEventsModal({ isOpen, onClose, events }: CampusEventsModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="events-modal-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-[#FAF5E9] shadow-2xl text-[#392525] border border-[#392525]/15">
        
        {/* Header */}
        <div className="bg-[#213527] p-6 text-[#FAF5E9] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close events modal"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#E3E890] uppercase tracking-wider">
            <Sparkles className="size-4" />
            <span>BUP Campus Pulse</span>
          </div>
          <h2 id="events-modal-title" className="font-serif text-3xl font-bold mt-1 text-white">
            What&apos;s On at Campus
          </h2>
          <p className="text-xs text-[#FAF5E9]/80 mt-1">
            Upcoming club carnivals, business competitions, and pop-up market days at Mirpur Cantonment.
          </p>
        </div>

        {/* List of Events */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[#392525]/15 bg-white p-5 shadow-sm hover:border-[#213527] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#E3E890] px-3 py-0.5 text-[11px] font-bold text-[#213527]">
                  {event.badge}
                </span>
                <span className="text-xs font-semibold text-[#728383]">{event.date}</span>
              </div>

              <h3 className="font-serif text-xl font-bold mt-2 text-[#392525]">
                {event.title}
              </h3>
              <p className="text-xs font-semibold text-[#B25D3E] mt-0.5">
                Organized by {event.organizer}
              </p>
              <p className="text-xs text-[#3E4734]/80 mt-2 leading-relaxed">
                {event.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#728383] border-t border-[#392525]/10 pt-3">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-[#213527]" /> {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-[#B25D3E]" /> {event.location}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#392525]/10 bg-white/50 p-4 text-center">
          <button
            onClick={onClose}
            className="rounded-full bg-[#392525] px-6 py-2.5 text-xs font-semibold text-[#FAF5E9] hover:bg-[#201414]"
          >
            Close Notice Board
          </button>
        </div>

      </div>
    </div>
  )
}
