'use client'

import React, { useState } from 'react'
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Phone,
  ArrowRight,
  Filter
} from 'lucide-react'
import { DbOrderItem } from '@/data/seed'

interface OrderTableProps {
  orders: (DbOrderItem & { buyerName?: string; buyerPhone?: string; deliveryLocation?: string })[]
  onUpdateStatus: (orderItemId: string, newStatus: 'CONFIRMED' | 'PACKED' | 'READY' | 'DELIVERED' | 'CANCELLED', reason?: string) => void
}

export function OrderTable({ orders, onUpdateStatus }: OrderTableProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'PACKED' | 'READY' | 'COMPLETED' | 'CANCELLED'>('ALL')
  const [cancelModalItem, setCancelModalItem] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'NEW') return o.status === 'CONFIRMED'
    if (activeTab === 'PACKED') return o.status === 'PACKED'
    if (activeTab === 'READY') return o.status === 'READY'
    if (activeTab === 'COMPLETED') return o.status === 'DELIVERED'
    if (activeTab === 'CANCELLED') return o.status === 'CANCELLED'
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">New Order</span>
      case 'PACKED':
        return <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">Packed</span>
      case 'READY':
        return <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">Ready for Pickup</span>
      case 'DELIVERED':
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Completed</span>
      case 'CANCELLED':
        return <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">Cancelled</span>
      default:
        return null
    }
  }

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cancelModalItem) {
      onUpdateStatus(cancelModalItem, 'CANCELLED', cancelReason || 'Out of stock on campus')
      setCancelModalItem(null)
      setCancelReason('')
    }
  }

  return (
    <div className="rounded-xl bg-white border border-neutral-200/90 shadow-2xs">
      
      {/* TABS */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-100 p-2 text-xs font-bold">
        {(['ALL', 'NEW', 'PACKED', 'READY', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#1f3a2e] text-white shadow-2xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab === 'ALL' ? 'All Orders' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="size-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-800">No orders found in this tab</p>
          <p className="text-xs text-neutral-500 mt-0.5">When students order your listings, they will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-[#FAF5E9]/60 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-100">
              <tr>
                <th className="p-3">Order Details</th>
                <th className="p-3">Buyer & Location</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.listingImage}
                        alt=""
                        className="size-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 line-clamp-1">{order.listingTitle}</p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {order.quantity} • Qty ID: #{order.id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="font-bold text-neutral-900">{order.buyerName || 'Campus Student'}</p>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                      <MapPin className="size-3 text-[#b5573a] shrink-0" />
                      <span className="truncate max-w-[180px]">{order.deliveryLocation || order.pickupLocation}</span>
                    </div>
                    {order.buyerPhone && (
                      <p className="text-[10px] font-mono text-neutral-400">{order.buyerPhone}</p>
                    )}
                  </td>

                  <td className="p-3">
                    <p className="font-serif font-black text-sm text-[#1f3a2e]">
                      ৳{order.price * order.quantity}
                    </p>
                    <p className="text-[10px] text-neutral-400">95% net: ৳{Math.round(order.price * order.quantity * 0.95)}</p>
                  </td>

                  <td className="p-3">
                    {getStatusBadge(order.status)}
                    {order.cancellationReason && (
                      <p className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[130px]">
                        Reason: {order.cancellationReason}
                      </p>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'PACKED')}
                          className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 shadow-2xs"
                        >
                          Mark Packed
                        </button>
                      )}

                      {order.status === 'PACKED' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'READY')}
                          className="rounded bg-purple-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-purple-700 shadow-2xs"
                        >
                          Ready for Handover
                        </button>
                      )}

                      {order.status === 'READY' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                          className="rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 shadow-2xs"
                        >
                          Confirm Handed Over
                        </button>
                      )}

                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setCancelModalItem(order.id)}
                          className="rounded border border-neutral-300 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                      )}

                      {order.status === 'DELIVERED' && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Payout credited
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-neutral-200">
            <h4 className="font-bold text-sm text-neutral-900">Cancel Order Item</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Please state why you cannot fulfill this campus order item. The buyer will be notified immediately.
            </p>
            <form onSubmit={handleCancelSubmit} className="mt-3 space-y-3">
              <input
                type="text"
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Out of stock or student already graduated"
                className="w-full rounded-md border border-neutral-300 p-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCancelModalItem(null)}
                  className="rounded px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
