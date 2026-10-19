'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Sparkles,
  Shirt,
  BookOpen,
  UtensilsCrossed,
  Coffee,
  PenTool,
  Laptop,
  Store,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useBup } from '@/context/BupContext'

interface CategoryItem {
  id: string
  label: string
  icon: React.ReactNode
  slug: string
  href: string
}

const CATEGORY_TABS: CategoryItem[] = [
  { id: 'for-you', label: 'For You', icon: <Sparkles className="size-4" />, slug: 'all', href: '/' },
  { id: 'merch', label: 'Varsity Merch', icon: <Shirt className="size-4" />, slug: 'Merch', href: '/marketplace?category=Merch' },
  { id: 'books', label: 'Books & Notes', icon: <BookOpen className="size-4" />, slug: 'Textbooks', href: '/marketplace?category=Textbooks' },
  { id: 'canteen', label: 'Canteen', icon: <UtensilsCrossed className="size-4" />, slug: 'Dining & Canteen', href: '/marketplace?category=Dining+%26+Canteen' },
  { id: 'coffee', label: 'Coffee & Snacks', icon: <Coffee className="size-4" />, slug: 'Coffee & Snacks', href: '/marketplace?category=Coffee+%26+Snacks' },
  { id: 'stationery', label: 'Stationery', icon: <PenTool className="size-4" />, slug: 'Stationery', href: '/marketplace?category=Stationery' },
  { id: 'electronics', label: 'Electronics', icon: <Laptop className="size-4" />, slug: 'Electronics', href: '/marketplace?category=Electronics' },
  { id: 'stalls', label: 'Stall Spaces', icon: <Store className="size-4" />, slug: 'stalls', href: '/stall-spaces' },
  { id: 'services', label: 'Services', icon: <Layers className="size-4" />, slug: 'Services', href: '/campus-services' },
]

function CategoryBarContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategoryParam = searchParams.get('category') || ''

  const { activeCategory, setActiveCategory } = useBup()

  // Determine active tab
  const getIsActive = (tab: CategoryItem) => {
    if (pathname === '/stall-spaces' && tab.id === 'stalls') return true
    if (pathname === '/campus-services' && tab.id === 'services') return true
    if (pathname === '/marketplace') {
      return currentCategoryParam === tab.slug || (currentCategoryParam === '' && tab.id === 'for-you')
    }
    if (pathname === '/' && (activeCategory === tab.label || (activeCategory === 'For You' && tab.id === 'for-you'))) {
      return true
    }
    return false
  }

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="mx-auto max-w-7xl relative flex items-center px-2 sm:px-6 lg:px-8">
      {/* Left scroll chevron for desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-1 z-10 size-7 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-sm text-neutral-600 hover:text-black hover:bg-neutral-50"
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-4" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar scroll-smooth w-full px-2"
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = getIsActive(tab)
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveCategory(tab.label)}
              className={`relative group flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'text-[#1f3a2e] font-bold'
                  : 'text-neutral-600 hover:text-[#1f3a2e] hover:bg-neutral-50'
              }`}
            >
              <span
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#b5573a]' : 'text-neutral-500'
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>

              {/* Active blue-green underline indicator */}
              {isActive && (
                <span className="absolute bottom-[-10px] left-2 right-2 h-[2.5px] rounded-t-full bg-[#1f3a2e]" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Right scroll chevron for desktop */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-1 z-10 size-7 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-sm text-neutral-600 hover:text-black hover:bg-neutral-50"
        aria-label="Scroll right"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export function CategoryBar() {
  return (
    <nav
      aria-label="Campus categories"
      className="relative w-full bg-white border-b border-neutral-200 shadow-xs z-30"
    >
      <Suspense fallback={<div className="h-10 w-full animate-pulse bg-white" />}>
        <CategoryBarContent />
      </Suspense>
    </nav>
  )
}
