'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, Edit3, Trash2, MessageSquare, Store, ExternalLink, X } from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { UserReview } from '@/lib/types'

export function ReviewsTab() {
  const { reviews, orders, deleteReview, editReview } = useBup()

  const [activeSubTab, setActiveSubTab] = useState<'my-reviews' | 'waiting'>('my-reviews')
  const [editingReview, setEditingReview] = useState<UserReview | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')

  // Waiting for review orders: status === 'Completed' and !isReviewed
  const waitingOrders = orders.filter((o) => o.status === 'Completed' && !o.isReviewed)

  const handleOpenEdit = (rev: UserReview) => {
    setEditingReview(rev)
    setEditRating(rev.productRating)
    setEditComment(rev.comment)
  }

  const handleSaveEdit = () => {
    if (!editingReview) return
    editReview(editingReview.id, editComment, editRating)
    setEditingReview(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
            <Star className="size-5 fill-amber-400 text-amber-400" />
            <span>Campus Ratings & Reviews</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Manage feedback for verified peers and campus vendors
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('my-reviews')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'my-reviews'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Reviews Given ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('waiting')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'waiting'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Waiting for Review ({waitingOrders.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'my-reviews' ? (
        reviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-amber-500 mb-3">
              <Star className="size-8" />
            </div>
            <h3 className="font-serif font-black text-lg text-neutral-900">No reviews published yet</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              Once you complete an order and receive your item, you can review the seller and listing quality here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.listingImage}
                      alt={rev.listingTitle}
                      className="size-12 rounded-lg object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{rev.listingTitle}</h4>
                      <Link
                        href={`/shop/${rev.sellerSlug}`}
                        className="text-[11px] font-semibold text-[#1f3a2e] hover:underline flex items-center gap-1"
                      >
                        <span>Seller: {rev.sellerName}</span>
                        <ExternalLink className="size-3 text-neutral-400" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rev)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700"
                      title="Edit review"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(rev.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600"
                      title="Delete review"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < rev.productRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-neutral-400 ml-1.5">{rev.date}</span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
                  "{rev.comment}"
                </p>

                {/* Seller Reply */}
                {rev.sellerReply && (
                  <div className="ml-4 rounded-xl bg-[#FAF5E9] p-3 text-xs border border-[#213527]/10 space-y-1">
                    <span className="font-bold text-[#1f3a2e] flex items-center gap-1">
                      <Store className="size-3 text-[#b5573a]" />
                      Reply from {rev.sellerName}:
                    </span>
                    <p className="text-neutral-700">{rev.sellerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* WAITING FOR REVIEW */
        waitingOrders.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-neutral-200 shadow-sm">
            <h3 className="font-serif font-black text-lg text-neutral-900">No pending reviews</h3>
            <p className="mt-1 text-xs text-neutral-500">All your completed campus purchases are reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {waitingOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.items[0]?.image}
                    alt={order.items[0]?.name}
                    className="size-14 rounded-lg object-cover border border-neutral-200"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{order.items[0]?.name}</h4>
                    <p className="text-xs text-neutral-500">Seller: {order.seller}</p>
                    <p className="text-[11px] text-neutral-400">Delivered on {order.date}</p>
                  </div>
                </div>

                <Link
                  href="/account?tab=orders"
                  className="rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] shadow-xs"
                >
                  Rate this Purchase
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {/* EDIT REVIEW MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-neutral-900">Edit Campus Review</h3>
              <button onClick={() => setEditingReview(null)} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded">
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Star Rating</label>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`size-6 ${
                        star <= editRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Your Comment</label>
              <textarea
                rows={3}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="rounded-lg border border-neutral-300 px-4 py-1.5 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-lg bg-[#1f3a2e] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b5573a]"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
