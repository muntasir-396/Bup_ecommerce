'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react'
import { CAROUSEL_SLIDES, CarouselSlide } from '@/data/promos'

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = CAROUSEL_SLIDES

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      nextSlide()
    }, 4500)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  return (
    <section
      aria-label="Promotional highlights carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden rounded-xl bg-neutral-900 text-white shadow-md my-3 sm:my-4 select-none"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full relative flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 bg-gradient-to-r ${slide.bgGradient} min-h-[220px] sm:min-h-[280px] md:min-h-[320px]`}
          >
            {/* Background subtle noise pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FAF5E9 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Left text content */}
            <div className="relative z-10 max-w-xl text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3E890] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1f3a2e] shadow-xs">
                <Sparkles className="size-3 text-[#b5573a]" />
                {slide.badgeText}
              </span>

              <h2 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-md">
                {slide.subtitle}
              </p>

              <div className="mt-2 text-xs sm:text-sm font-bold text-[#E3E890]">
                {slide.highlight}
              </div>

              <div className="mt-4 sm:mt-6">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 rounded-md bg-[#b5573a] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#9c452b] transition-all hover:gap-3"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Right hero image preview */}
            <div className="relative z-10 mt-4 md:mt-0 max-w-[280px] sm:max-w-xs md:max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 hidden sm:block shrink-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-44 sm:h-52 md:h-60 object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Chevrons Left & Right */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 grid size-8 sm:size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-xs hover:bg-black/70 transition-all shadow-md"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 grid size-8 sm:size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-xs hover:bg-black/70 transition-all shadow-md"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all ${
              currentSlide === idx
                ? 'w-6 h-2 rounded-full bg-[#E3E890]'
                : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
