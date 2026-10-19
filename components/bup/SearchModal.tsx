'use client'

import React, { useState, useMemo } from 'react'
import {
  X,
  Search,
  ShoppingBag,
  Store,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react'
import { Product, Stall, CampusEvent } from '@/lib/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  stalls: Stall[]
  events: CampusEvent[]
  onSelectProduct: (product: Product) => void
  onSelectStall: (stall: Stall) => void
  onAddToCart: (product: Product) => void
}

export function SearchModal({
  isOpen,
  onClose,
  products,
  stalls,
  events,
  onSelectProduct,
  onSelectStall,
  onAddToCart,
}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'products' | 'stalls' | 'events'>('all')

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4)
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }, [products, query])

  const filteredStalls = useMemo(() => {
    if (!query.trim()) return stalls.slice(0, 3)
    const q = query.toLowerCase()
    return stalls.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.side.toLowerCase().includes(q)
    )
  }, [stalls, query])

  if (!isOpen) return null

  const popularSearches = ['Hoodie', 'Khichuri', 'Calculators', 'Stall B-07', 'Case Study', 'Textbooks']

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#392525]/15 bg-[#FAF5E9] shadow-2xl text-[#392525] flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-[#392525]/15 bg-white px-5 py-4">
          <Search className="size-5 text-[#B25D3E] shrink-0" />
          <input
            id="search-title"
            type="text"
            placeholder="Search BUP hoodies, textbooks, canteen meals, stalls..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base font-medium outline-none placeholder:text-[#728383]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-[#728383] hover:text-[#392525]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#392525]/70 hover:bg-[#FAF5E9]"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#392525]/10 bg-[#FAF5E9] px-5 py-2.5 text-xs">
          <span className="font-bold text-[#728383]">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full border border-[#392525]/15 bg-white/70 px-2.5 py-1 text-xs hover:border-[#B25D3E] hover:text-[#B25D3E]"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Products Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E4734]">
                <ShoppingBag className="size-4 text-[#B25D3E]" />
                <span>Market Items ({filteredProducts.length})</span>
              </h3>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-xs text-[#728383] italic">No matching products found.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-3 rounded-2xl border border-[#392525]/10 bg-white/80 p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      onSelectProduct(p)
                      onClose()
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between overflow-hidden">
                      <div>
                        <h4 className="text-xs font-bold line-clamp-1 text-[#392525]">{p.name}</h4>
                        <p className="text-[11px] text-[#728383] truncate">{p.seller}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-serif text-xs font-bold text-[#B25D3E]">৳{p.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart(p)
                          }}
                          className="rounded-full bg-[#392525] px-2 py-0.5 text-[10px] font-semibold text-[#FAF5E9] hover:bg-[#B25D3E]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stalls Results */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E4734] mb-3">
              <Store className="size-4 text-[#2d4734]" />
              <span>Campus Stalls & Spaces ({filteredStalls.length})</span>
            </h3>

            <div className="grid gap-2 sm:grid-cols-3">
              {filteredStalls.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectStall(s)
                    onClose()
                  }}
                  className="rounded-2xl border border-[#392525]/10 bg-white/80 p-3 hover:border-[#2d4734] cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{s.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      s.status === 'Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <h4 className="mt-1 text-xs font-medium truncate text-[#392525]">{s.name}</h4>
                  <p className="text-[11px] text-[#728383]">{s.side}</p>
                  <p className="mt-2 text-xs font-bold text-[#2d4734]">৳{s.dailyRate}/day</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-[#392525]/10 bg-white/50 px-5 py-3 text-xs text-[#728383] flex items-center justify-between">
          <span>Search BUP products, stall bookings, or clubs</span>
          <span className="font-semibold text-[#392525]">ESC to close</span>
        </div>
      </div>
    </div>
  )
}
