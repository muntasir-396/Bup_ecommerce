import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const payoutSchema = z.object({
  sellerId: z.string().min(1),
  amount: z.number().positive(),
  method: z.enum(['bkash', 'nagad']),
  accountNumber: z.string().min(11),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sellerId = url.searchParams.get('sellerId')
  if (!sellerId) return NextResponse.json({ error: 'sellerId required' }, { status: 400 })

  const payouts = db.payouts.filter((p) => p.sellerId === sellerId)
  const seller = db.sellers.find((s) => s.userId === sellerId)

  return NextResponse.json({
    payouts,
    balance: seller?.balance || 0,
    commissionRate: 0.05, // 5%
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = payoutSchema.parse(body)

    const seller = db.sellers.find((s) => s.userId === data.sellerId)
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    if (seller.balance < data.amount) {
      return NextResponse.json({ error: `Insufficient balance. Available: ৳${seller.balance}` }, { status: 400 })
    }

    const commission = data.amount * 0.05
    const netAmount = data.amount - commission

    seller.balance -= data.amount

    const newPayout = {
      id: `pay-${Date.now()}`,
      sellerId: data.sellerId,
      amount: data.amount,
      commission,
      netAmount,
      method: data.method,
      accountNumber: data.accountNumber,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    }

    db.payouts.unshift(newPayout)

    return NextResponse.json({ success: true, payout: newPayout, remainingBalance: seller.balance })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error requesting payout' }, { status: 400 })
  }
}
