'use client'

import React, { useState } from 'react'
import { Store, X, CheckCircle2, ShieldCheck, Upload, Sparkles } from 'lucide-react'
import { useBup } from '@/context/BupContext'

export function BecomeSellerModal() {
  const { isSellerModalOpen, closeSellerModal, currentUser, showToast } = useBup()

  const [clubName, setClubName] = useState('')
  const [category, setCategory] = useState('Merch')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isSellerModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    showToast('Seller application submitted! Our team will verify your BUP credentials within 2 hours.')
    setTimeout(() => {
      setSubmitted(false)
      closeSellerModal()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-[#FAF5E9] text-[#1f3a2e] font-black">
              <Store className="size-5 text-[#b5573a]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Become a Campus Seller
              </h3>
              <p className="text-xs text-neutral-500">
                List merch, textbooks, study notes or canteen food on BUPCommon
              </p>
            </div>
          </div>
          <button
            onClick={closeSellerModal}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center animate-in fade-in">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
              <CheckCircle2 className="size-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900">Application Received!</h4>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              Your vendor application for <strong>{clubName || 'your campus store'}</strong> has been forwarded to the BUP Student Welfare Review Committee.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Store / Society / Vendor Name
              </label>
              <input
                type="text"
                required
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="e.g. BUP Robotics Club Store or Tanvir's Textbook Exchange"
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
                >
                  <option value="Merch">Varsity Merch</option>
                  <option value="Textbooks">Textbooks & Notes</option>
                  <option value="Dining & Canteen">Canteen & Dining</option>
                  <option value="Coffee & Snacks">Coffee & Bakery</option>
                  <option value="Electronics">Electronics & Tools</option>
                  <option value="Stationery">Stationery & Art</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  BUP Student ID or Vendor ID
                </label>
                <input
                  type="text"
                  required
                  defaultValue={currentUser?.studentId || ''}
                  placeholder="e.g. 22041108"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                What will you be offering to the campus community?
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your products, pricing, and handover method at BUP."
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
              />
            </div>

            <div className="rounded-xl bg-[#FAF5E9] p-3 text-xs text-neutral-700 border border-[#213527]/10 flex items-start gap-2">
              <ShieldCheck className="size-4 text-[#1f3a2e] shrink-0 mt-0.5" />
              <span>
                <strong>0% Commission for Student Societies:</strong> All registered BUP student clubs receive 100% of payout via bKash / Nagad without platform cuts.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={closeSellerModal}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#1f3a2e] px-5 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
