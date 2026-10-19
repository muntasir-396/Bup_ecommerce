'use client'

import React, { useState } from 'react'
import { MapPin, Plus, Trash2, Edit3, Check, Building, Home, Briefcase, X } from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { UserAddress } from '@/lib/types'
import { isValidBdPhone } from './ProfileTab'

export function AddressesTab() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    showToast,
  } = useBup()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form Fields
  const [label, setLabel] = useState<UserAddress['label']>('Hall')
  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('Mirpur Cantonment')
  const [fullAddress, setFullAddress] = useState('')
  const [pickupPoint, setPickupPoint] = useState('Cafe Lake Promenade')
  const [isDefault, setIsDefault] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const campusPickupOptions = [
    'Cafe Lake Promenade',
    'Central Canteen Counter A',
    'FST Ground Floor lobby',
    'FBS Dean Office Front',
    'Library Annex 1st Floor',
    'BUP Main Gate Mirpur 12',
    'Auditorium Plaza Stairs',
  ]

  const handleOpenAdd = () => {
    setEditingId(null)
    setLabel('Hall')
    setRecipient('')
    setPhone('')
    setArea('Mirpur Cantonment')
    setFullAddress('')
    setPickupPoint('Cafe Lake Promenade')
    setIsDefault(addresses.length === 0)
    setPhoneError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (addr: UserAddress) => {
    setEditingId(addr.id)
    setLabel(addr.label)
    setRecipient(addr.recipient)
    setPhone(addr.phone)
    setArea(addr.area)
    setFullAddress(addr.fullAddress)
    setPickupPoint(addr.pickupPoint || 'Cafe Lake Promenade')
    setIsDefault(addr.isDefault)
    setPhoneError(null)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!recipient.trim()) {
      showToast('Please enter the recipient name.')
      return
    }
    if (!isValidBdPhone(phone)) {
      setPhoneError('Please enter a valid BD phone (+8801XXXXXXXXX or 01XXXXXXXXX)')
      return
    }
    if (!fullAddress.trim()) {
      showToast('Please enter the full address.')
      return
    }

    if (editingId) {
      updateAddress(editingId, {
        label,
        recipient,
        phone,
        area,
        fullAddress,
        pickupPoint,
        isDefault,
      })
    } else {
      addAddress({
        label,
        recipient,
        phone,
        area,
        fullAddress,
        pickupPoint,
        isDefault,
      })
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
            <MapPin className="size-5 text-[#b5573a]" />
            <span>Saved Campus & Delivery Addresses</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Set default handover spots for peer-to-peer delivery or outside parcel courier
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
        >
          <Plus className="size-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* ADDRESSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const Icon = addr.label === 'Hall' ? Building : addr.label === 'Home' ? Home : Briefcase

          return (
            <div
              key={addr.id}
              className={`rounded-2xl bg-white p-5 border shadow-2xs space-y-3 relative ${
                addr.isDefault ? 'border-[#1f3a2e] ring-1 ring-[#1f3a2e]' : 'border-neutral-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-[#FAF5E9] text-[#1f3a2e]">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1 text-neutral-400 hover:text-neutral-700"
                    title="Edit"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{addr.recipient}</h4>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">{addr.phone}</p>
                <p className="text-xs text-neutral-700 mt-1 leading-relaxed">{addr.fullAddress}</p>
              </div>

              {addr.pickupPoint && (
                <div className="rounded-lg bg-[#FAF5E9] p-2 text-[11px] text-[#1f3a2e] font-semibold flex items-center gap-1.5 border border-[#213527]/10">
                  <MapPin className="size-3 text-[#b5573a] shrink-0" />
                  <span>Campus Pickup Hub: {addr.pickupPoint}</span>
                </div>
              )}

              {!addr.isDefault && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-xs font-bold text-[#1f3a2e] hover:underline"
                  >
                    Set as Default Handover Address
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ADD/EDIT ADDRESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-neutral-900">
                {editingId ? 'Edit Address' : 'Add New Campus Address'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:bg-neutral-100 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Type label */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hall', 'Home', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLabel(t)}
                      className={`py-2 rounded-lg border text-center font-bold transition-all ${
                        label === t
                          ? 'border-[#1f3a2e] bg-[#1f3a2e] text-white shadow-xs'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. Muntasir Mamun"
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">BD Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setPhoneError(null)
                    }}
                    placeholder="+88017XXXXXXXX or 017XXXXXXXX"
                    className={`w-full rounded-lg border p-2.5 font-mono text-neutral-900 focus:outline-hidden ${
                      phoneError ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-300 focus:border-[#1f3a2e]'
                    }`}
                  />
                  {phoneError && <p className="text-[10px] text-rose-600 mt-1">{phoneError}</p>}
                </div>
              </div>

              {/* Campus Pickup Point */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Preferred Campus Pickup Point
                </label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                >
                  {campusPickupOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Address */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Full Street / Hall / Room Address
                </label>
                <textarea
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="e.g. Room 402, Mirpur DOHS Residence, Avenue 3, Road 11"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                />
              </div>

              {/* Set default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-[#1f3a2e] focus:ring-[#1f3a2e]"
                />
                <span className="font-semibold text-neutral-700">Make this my default address</span>
              </label>
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
                onClick={handleSave}
                className="rounded-lg bg-[#1f3a2e] px-5 py-2 text-xs font-bold text-white hover:bg-[#b5573a] shadow-xs"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
