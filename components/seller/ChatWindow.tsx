'use client'

import React, { useState } from 'react'
import {
  Send,
  Flag,
  ShieldCheck,
  MapPin,
  ExternalLink,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { DbConversation, DbMessage } from '@/data/seed'
import { useBup } from '@/context/BupContext'

interface ChatWindowProps {
  conversation: DbConversation
  currentUserId: string
  onSendMessage: (text: string) => void
  onReport: (reason: string) => void
}

export function ChatWindow({
  conversation,
  currentUserId,
  onSendMessage,
  onReport,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('')
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      onSendMessage(inputText.trim())
      setInputText('')
    }
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reportReason.trim()) {
      onReport(reportReason.trim())
      setIsReportOpen(false)
      setReportReason('')
    }
  }

  const otherPersonName =
    conversation.buyerId === currentUserId
      ? conversation.sellerName
      : conversation.buyerName

  return (
    <div className="flex flex-col h-[550px] rounded-xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
      
      {/* CHAT HEADER */}
      <div className="flex items-center justify-between p-3.5 border-b border-neutral-100 bg-[#FAF5E9]/60">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-full bg-[#1f3a2e] text-[#E3E890] font-black text-xs">
            {otherPersonName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
              {otherPersonName}
            </h4>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              BUP Verified Member
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Report this conversation or user"
        >
          <Flag className="size-3.5" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>

      {/* PINNED LISTING PREVIEW AT TOP */}
      {conversation.listingTitle && (
        <div className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 border-b border-neutral-100 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {conversation.listingImage && (
              <img
                src={conversation.listingImage}
                alt=""
                className="size-10 rounded object-cover border border-neutral-200 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-bold text-neutral-900 truncate">
                {conversation.listingTitle}
              </p>
              {conversation.listingPrice && (
                <span className="font-bold text-[#b5573a]">
                  ৳{conversation.listingPrice}
                </span>
              )}
            </div>
          </div>
          <span className="rounded bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600 shrink-0">
            Pinned Item
          </span>
        </div>
      )}

      {/* MESSAGES THREAD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400">
            <MessageSquare className="size-8 mb-2" />
            <p className="text-xs font-bold text-neutral-600">Start the conversation</p>
            <p className="text-[11px] text-neutral-400 max-w-xs mt-0.5">
              Ask about item condition, library handover timings, or payment terms.
            </p>
          </div>
        ) : (
          conversation.messages.map((msg) => {
            const isMe = msg.senderId === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#1f3a2e] text-white rounded-br-xs'
                      : 'bg-neutral-100 text-neutral-900 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-100 flex items-center gap-2 bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${otherPersonName}...`}
          className="flex-1 rounded-lg border border-neutral-300 p-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#b5573a] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#9c452b] transition-colors shadow-2xs"
        >
          <Send className="size-3.5" />
        </button>
      </form>

      {/* REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="size-5" />
              <h4 className="font-bold text-sm text-neutral-900">Report Listing or User</h4>
            </div>
            <p className="text-xs text-neutral-500">
              Reports are reviewed directly by the BUP Marketplace Proctorial Board.
            </p>
            <form onSubmit={handleReportSubmit} className="mt-3 space-y-3">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Explain the violation (prohibited items, spam, harassing messages, fake credentials)..."
                className="w-full rounded-md border border-neutral-300 p-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="rounded px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
