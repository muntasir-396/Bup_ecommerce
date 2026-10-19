'use client'

import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}

export function StatCard({ label, value, subtext, icon, trend, trendUp = true }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-4 border border-neutral-200/90 shadow-2xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-1 font-serif text-2xl font-black text-neutral-900">
          {value}
        </p>
        {subtext && (
          <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
            {trend && (
              <span className={`font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend}
              </span>
            )}
            <span>{subtext}</span>
          </p>
        )}
      </div>
      <div className="grid size-12 place-items-center rounded-xl bg-[#FAF5E9] text-[#1f3a2e] border border-[#213527]/10">
        {icon}
      </div>
    </div>
  )
}
