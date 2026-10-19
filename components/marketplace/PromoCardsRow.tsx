'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { PROMO_CARDS } from '@/data/promos'

export function PromoCardsRow() {
  return (
    <section aria-label="Campus promotional offers" className="my-3 sm:my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {PROMO_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white p-3 border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            {/* Top row with AD badge and category */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-neutral-500 uppercase tracking-wider">
                {card.category}
              </span>
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-bold text-neutral-400 border border-neutral-200">
                AD
              </span>
            </div>

            {/* Middle: Image preview */}
            <div className="my-2 aspect-[16/10] w-full overflow-hidden rounded-md bg-neutral-100">
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Bottom info */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate group-hover:text-[#b5573a] transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] text-neutral-500 truncate">
                {card.subtitle}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-black text-emerald-700">
                  {card.discount}
                </span>
                <span className="text-[11px] font-bold text-[#1f3a2e] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Shop <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
