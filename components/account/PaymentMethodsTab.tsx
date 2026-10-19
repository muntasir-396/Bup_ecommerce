'use client'

import React, { useState } from 'react'
import { CreditCard, Plus, Trash2, ShieldCheck, Check, Smartphone, X } from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { SavedPayment } from '@/lib/types'
import { isValidBdPhone } from './ProfileTab'

export function PaymentMethodsTab() {
  const {
    savedPayments,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    showToast,
  } = useBup()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [phoneInput, setPhoneInput] = useState('')
  const [holderInput, setHolderInput] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setMethod('bkash')
    setPhoneInput('')
    setHolderInput('')
    setPhoneError(null)
    setIsModalOpen(true)
  }

  const handleSavePayment = () => {
    if (!holderInput.trim()) {
      showToast('Please enter the account holder name.')
      return
    }
    if (!isValidBdPhone(phoneInput)) {
      setPhoneError('Please enter a valid 11-digit Bangladesh mobile wallet number.')
      return
    }

    // Mask number: e.g. 01712345678 -> 017****5678
    const digits = phoneInput.trim().replace(/[\s-]/g, '')
    const cleanDigits = digits.startsWith('+880') ? digits.slice(4) : digits
    const masked = `${cleanDigits.slice(0, 3)}****${cleanDigits.slice(-4)}`

    addPaymentMethod({
      method,
      accountNumber: masked,
      accountHolder: holderInput.trim(),
      isDefault: savedPayments.length === 0,
    })

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
            <CreditCard className="size-5 text-[#1f3a2e]" />
            <span>Saved Mobile Payout & Payment Accounts</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Encrypted bKash & Nagad numbers for 1-click order checkout and seller earning payouts
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
        >
          <Plus className="size-4" />
          <span>Add Account</span>
        </button>
      </div>

      {/* ZERO RAW CARD STORAGE POLICY BANNER */}
      <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs flex items-center gap-3">
        <ShieldCheck className="size-5 text-emerald-700 shrink-0" />
        <div className="text-emerald-900">
          <strong>Campus Zero Raw-Card Storage Policy:</strong> BUPCommon does not store debit/credit card CVVs or card numbers. All transactions process through Bangladesh Bank licensed MFS gateways (bKash & Nagad) or Cash on Handover.
        </div>
      </div>

      {/* SAVED ACCOUNTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedPayments.map((pm) => {
          const isBkash = pm.method === 'bkash'

          return (
            <div
              key={pm.id}
              className={`rounded-2xl bg-white p-5 border shadow-2xs space-y-3 relative ${
                pm.isDefault ? 'border-[#1f3a2e] ring-1 ring-[#1f3a2e]' : 'border-neutral-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`grid size-9 place-items-center rounded-xl font-black text-xs text-white ${
                      isBkash ? 'bg-[#e2136e]' : 'bg-[#f7941d]'
                    }`}
                  >
                    {isBkash ? 'bK' : 'NG'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                      {isBkash ? 'bKash Personal' : 'Nagad Personal'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">Account: {pm.accountHolder}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {pm.isDefault ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultPaymentMethod(pm.id)}
                      className="text-xs font-semibold text-[#1f3a2e] hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                  {savedPayments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deletePaymentMethod(pm.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 ml-1"
                      title="Remove"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-neutral-50 p-2.5 flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500">MFS Wallet:</span>
                <span className="font-bold text-neutral-800 tracking-wider">{pm.accountNumber}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ADD PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-neutral-900">
                Add Mobile Financial Account
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:bg-neutral-100 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">MFS Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`py-2 rounded-lg border text-center font-bold transition-all ${
                      method === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/10 text-[#e2136e]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`py-2 rounded-lg border text-center font-bold transition-all ${
                      method === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/10 text-[#f7941d]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Nagad
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Account Holder Full Name</label>
                <input
                  type="text"
                  value={holderInput}
                  onChange={(e) => setHolderInput(e.target.value)}
                  placeholder="e.g. Muntasir Mamun"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Wallet Number (11 Digits)</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value)
                    setPhoneError(null)
                  }}
                  placeholder="017XXXXXXXX"
                  className={`w-full rounded-lg border p-2.5 font-mono text-neutral-900 focus:outline-hidden ${
                    phoneError ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-300 focus:border-[#1f3a2e]'
                  }`}
                />
                {phoneError && <p className="text-[10px] text-rose-600 mt-1">{phoneError}</p>}
              </div>

              <p className="text-[11px] text-neutral-400">
                Number will be stored masked in compliance with student privacy regulations.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                className="rounded-lg bg-[#1f3a2e] px-5 py-2 text-xs font-bold text-white hover:bg-[#b5573a] shadow-xs"
              >
                Save MFS Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
