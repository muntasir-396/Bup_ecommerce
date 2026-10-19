'use client'

import React from 'react'
import { ShieldCheck, Truck, CreditCard, BookCheck } from 'lucide-react'

export function TrustStrip() {
  const trustItems = [
    {
      icon: <ShieldCheck className="size-6 text-[#1f3a2e]" />,
      title: 'BUP ID Verified Sellers',
      desc: '100% verified student clubs, alumni & registered university stalls',
    },
    {
      icon: <Truck className="size-6 text-[#b5573a]" />,
      title: 'Campus Runner Delivery',
      desc: 'Free handover at Central Library, Canteen, Lake Deck or Faculty lobbies',
    },
    {
      icon: <CreditCard className="size-6 text-[#1f3a2e]" />,
      title: 'Safe Student Payments',
      desc: 'Instant bKash, Nagad, card gateways or Cash on Pickup (COD)',
    },
    {
      icon: <BookCheck className="size-6 text-[#b5573a]" />,
      title: 'Course-Aligned Notes',
      desc: 'Verified syllabus midterms, past question sets & textbook exchanges',
    },
  ]

  return (
    <section
      aria-label="Student verification trust strip"
      className="my-5 rounded-xl bg-white p-5 border border-neutral-200/90 shadow-2xs"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
        {trustItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3.5 ${idx > 0 ? 'pt-3 sm:pt-0 sm:pl-4' : ''}`}
          >
            <div className="grid size-11 place-items-center rounded-xl bg-[#FAF5E9] shrink-0 border border-[#213527]/10">
              {item.icon}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
