import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const messageSchema = z.object({
  conversationId: z.string().min(1),
  senderId: z.string().min(1),
  senderName: z.string().min(1),
  text: z.string().min(1),
})

const startChatSchema = z.object({
  buyerId: z.string().min(1),
  buyerName: z.string().min(1),
  sellerId: z.string().min(1),
  sellerName: z.string().min(1),
  listingId: z.string().optional(),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  const conversationId = url.searchParams.get('conversationId')

  if (conversationId) {
    const conv = db.conversations.find((c) => c.id === conversationId)
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    return NextResponse.json({ conversation: conv })
  }

  if (userId) {
    const userConvs = db.conversations.filter(
      (c) => c.buyerId === userId || c.sellerId === userId
    )
    return NextResponse.json({ conversations: userConvs })
  }

  return NextResponse.json({ conversations: db.conversations })
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'send'
    const body = await req.json()

    if (action === 'start') {
      const data = startChatSchema.parse(body)
      let conv = db.conversations.find(
        (c) =>
          c.buyerId === data.buyerId &&
          c.sellerId === data.sellerId &&
          (!data.listingId || c.listingId === data.listingId)
      )

      if (!conv) {
        let listingInfo
        if (data.listingId) {
          const l = db.listings.find((item) => item.id === data.listingId)
          if (l) {
            listingInfo = {
              listingId: l.id,
              listingTitle: l.title,
              listingPrice: l.price,
              listingImage: l.images[0],
            }
          }
        }

        conv = {
          id: `conv-${Date.now()}`,
          buyerId: data.buyerId,
          buyerName: data.buyerName,
          sellerId: data.sellerId,
          sellerName: data.sellerName,
          ...listingInfo,
          updatedAt: new Date().toISOString(),
          messages: [],
        }
        db.conversations.unshift(conv)
      }

      return NextResponse.json({ success: true, conversation: conv })
    }

    if (action === 'send') {
      const data = messageSchema.parse(body)
      const conv = db.conversations.find((c) => c.id === data.conversationId)
      if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

      const newMsg = {
        id: `msg-${Date.now()}`,
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      conv.messages.push(newMsg)
      conv.updatedAt = new Date().toISOString()

      return NextResponse.json({ success: true, message: newMsg })
    }

    return NextResponse.json({ error: 'Unsupported chat action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing chat' }, { status: 400 })
  }
}
