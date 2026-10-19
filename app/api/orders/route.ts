import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, createOrder, updateOrderItemStatus } from '@/lib/db'

const createOrderSchema = z.object({
  buyerId: z.string().min(1),
  buyerName: z.string().min(2),
  buyerPhone: z.string().min(8),
  deliveryLocation: z.string().min(3),
  paymentMethod: z.enum(['bkash', 'nagad', 'cod']),
  items: z.array(
    z.object({
      listingId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const buyerId = url.searchParams.get('buyerId')
  const sellerId = url.searchParams.get('sellerId')

  if (buyerId) {
    const orders = db.orders.filter((o) => o.buyerId === buyerId)
    return NextResponse.json({ orders })
  }

  if (sellerId) {
    const items = db.orders.flatMap((o) =>
      o.items
        .filter((i) => i.sellerId === sellerId)
        .map((i) => ({ ...i, buyerName: o.buyerName, buyerPhone: o.buyerPhone, deliveryLocation: o.deliveryLocation }))
    )
    return NextResponse.json({ orderItems: items })
  }

  return NextResponse.json({ orders: db.orders })
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'place'
    const body = await req.json()

    if (action === 'place') {
      const data = createOrderSchema.parse(body)
      const order = createOrder(data)
      return NextResponse.json({ success: true, order })
    }

    if (action === 'update-status') {
      const { orderItemId, sellerId, newStatus, reason } = body
      const updatedItem = updateOrderItemStatus(orderItemId, sellerId, newStatus, reason)
      return NextResponse.json({ success: true, item: updatedItem })
    }

    if (action === 'cancel') {
      const { orderItemId, sellerId, reason } = body
      const cancelledItem = updateOrderItemStatus(orderItemId, sellerId, 'CANCELLED', reason || 'Seller cancelled')
      return NextResponse.json({ success: true, item: cancelledItem })
    }

    return NextResponse.json({ error: 'Unsupported order action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing order' }, { status: 400 })
  }
}
