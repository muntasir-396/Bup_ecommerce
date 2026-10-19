'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Flame } from 'lucide-react'
import { ExtendedProduct } from '@/data/products'
import { ProductCard } from './ProductCard'

interface ProductRowProps {
  title: string
  subtitle?: string
  viewAllLink: string
  products: ExtendedProduct[]
  isDealsRow?: boolean
}

export function ProductRow({
  title,
  subtitle,
  viewAllLink,
  products,
  isDealsRow = false,
}: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Countdown timer for Deals of the Day (e.g., 14h 23m 45s)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 23,
    seconds: 45,
  })

  useEffect(() => {
    if (!isDealsRow) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isDealsRow])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (products.length === 0) return null

  return (
    <section className="my-4 rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs">
      
      {/* ROW HEADER: TITLE, COUNTDOWN TIMER & VIEW ALL BUTTON */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                {title}
              </h2>
              {isDealsRow && (
                <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-200">
                  <Flame className="size-3 text-[#b5573a] fill-current" />
                  Flash Deals
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>

          {/* Flipkart-style Countdown timer badge */}
          {isDealsRow && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-mono font-bold text-neutral-700 border border-neutral-200">
              <Clock className="size-3.5 text-[#b5573a]" />
              <span>Ends in:</span>
              <span className="text-[#b5573a]">
                {String(timeLeft.hours).padStart(2, '0')}h :{' '}
                {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          )}
        </div>

        {/* View All button */}
        <div className="flex items-center gap-2">
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 rounded-md bg-[#1f3a2e] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>

          {/* Desktop Left / Right Scroll Chevrons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="grid size-7 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
              aria-label="Scroll products left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="grid size-7 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors"
              aria-label="Scroll products right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL PRODUCT SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[180px] sm:w-[210px] md:w-[230px] shrink-0 flex"
          >
            <div className="w-full">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
