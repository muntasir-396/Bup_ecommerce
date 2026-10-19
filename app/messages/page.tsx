'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, ArrowLeft, Store, ShieldCheck } from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { CategoryBar } from '@/components/marketplace/CategoryBar'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { ChatWindow } from '@/components/seller/ChatWindow'
import { FloatingSellButton } from '@/components/seller/FloatingSellButton'
import { DbConversation } from '@/data/seed'
import { useBup } from '@/context/BupContext'

function MessagesContent() {
  const searchParams = useSearchParams()
  const preselectedSellerId = searchParams.get('sellerId')
  const preselectedListingId = searchParams.get('listingId')

  const { currentUser, showToast, openAuth } = useBup()

  const [conversations, setConversations] = useState<DbConversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)

  // Fetch or initiate conversation
  useEffect(() => {
    if (!currentUser) return

    const fetchChats = async () => {
      try {
        // If sellerId is passed, initiate chat
        if (preselectedSellerId && preselectedSellerId !== currentUser.id) {
          const initRes = await fetch('/api/chat?action=start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyerId: currentUser.id,
              buyerName: currentUser.name,
              sellerId: preselectedSellerId,
              sellerName: 'Campus Seller',
              listingId: preselectedListingId || undefined,
            }),
          })
          const initData = await initRes.json()
          if (initData.conversation) {
            setActiveConvId(initData.conversation.id)
          }
        }

        const res = await fetch(`/api/chat?userId=${currentUser.id}`)
        const data = await res.json()
        setConversations(data.conversations || [])
        if (!activeConvId && data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id)
        }
      } catch (e) {
        console.error('Error fetching chats', e)
      }
    }

    fetchChats()
  }, [currentUser, preselectedSellerId, preselectedListingId])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
        <Header />
        <main className="mx-auto max-w-md w-full flex-1 px-4 py-16 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
            <MessageSquare className="size-12 text-[#b5573a] mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Sign in to View Messages</h2>
            <p className="text-xs text-neutral-500 mt-2">
              Chat directly with campus student sellers to negotiate pickup spots, ask textbook questions, or confirm orders.
            </p>
            <button
              onClick={() => openAuth('bup')}
              className="mt-6 w-full rounded-lg bg-[#1f3a2e] py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
            >
              Sign In with BUP ID
            </button>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  const handleSendMessage = async (text: string) => {
    if (!activeConvId) return
    try {
      const res = await fetch('/api/chat?action=send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messages: [...c.messages, data.message] }
              : c
          )
        )
      }
    } catch (e) {}
  }

  const handleReport = async (reason: string) => {
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          targetType: 'USER',
          targetId: activeConvId || 'unknown',
          reason,
        }),
      })
      showToast('Report submitted for proctorial review.')
    } catch (e) {}
  }

  const activeConv = conversations.find((c) => c.id === activeConvId)

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col antialiased">
      <Header />
      <CategoryBar />

      <main className="mx-auto max-w-7xl w-full flex-1 px-3 sm:px-6 lg:px-8 py-5">
        
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#1f3a2e]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Campus Chat & Inquiries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 items-start">
          
          {/* Conversation List Sidebar */}
          <div className="rounded-xl bg-white border border-neutral-200/90 shadow-2xs p-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                Conversations ({conversations.length})
              </h2>
            </div>

            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                No conversations yet. Click &quot;Chat with seller&quot; on any product card or shop page.
              </div>
            ) : (
              conversations.map((c) => {
                const otherName = c.buyerId === currentUser.id ? c.sellerName : c.buyerName
                const isSelected = activeConvId === c.id
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1f3a2e] bg-[#FAF5E9]/60 shadow-xs'
                        : 'border-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-neutral-900 truncate">
                        {otherName}
                      </p>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {c.listingTitle && (
                      <p className="text-[11px] font-semibold text-[#b5573a] truncate mt-0.5">
                        {c.listingTitle}
                      </p>
                    )}

                    <p className="text-[11px] text-neutral-500 truncate mt-1">
                      {c.messages[c.messages.length - 1]?.text || 'No messages yet'}
                    </p>
                  </div>
                )
              })
            )}
          </div>

          {/* Active Chat Window */}
          <div>
            {activeConv ? (
              <ChatWindow
                conversation={activeConv}
                currentUserId={currentUser.id}
                onSendMessage={handleSendMessage}
                onReport={handleReport}
              />
            ) : (
              <div className="rounded-xl bg-white border border-neutral-200 p-16 text-center text-neutral-400">
                <MessageSquare className="size-10 mx-auto mb-2 text-neutral-300" />
                <h3 className="font-bold text-sm text-neutral-800">Select a Conversation</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose a chat on the left to message campus buyers or sellers.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5E9] flex items-center justify-center font-bold">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  )
}
