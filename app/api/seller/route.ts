import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  db,
  getSellerProfile,
  createOrUpdateSeller,
  createListing,
  updateListing,
  deleteListing,
} from '@/lib/db'

const sellerProfileSchema = z.object({
  userId: z.string().min(1),
  storeName: z.string().min(2),
  bio: z.string().optional(),
  phone: z.string().min(8),
  pickupLocation: z.string().min(3),
  payoutMethod: z.enum(['bkash', 'nagad']),
  payoutNumber: z.string().min(11),
})

const listingSchema = z.object({
  sellerId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  originalPrice: z.number().optional(),
  images: z.array(z.string()).max(6).default([]),
  condition: z.enum(['NEW', 'USED_LIKE_NEW', 'USED_GOOD']),
  stock: z.number().int().min(1),
  category: z.string(),
  deliveryTime: z.string().optional(),
  pickupOption: z.string().optional(),
  isDraft: z.boolean().optional(),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

  const seller = getSellerProfile(userId)
  const listings = db.listings.filter((l) => l.sellerId === userId)
  const orders = db.orders.flatMap((o) => o.items.filter((i) => i.sellerId === userId))

  return NextResponse.json({
    sellerProfile: seller || null,
    listings,
    orders,
    stats: {
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === 'ACTIVE').length,
      totalSales: seller?.totalSales || 0,
      balance: seller?.balance || 0,
      rating: seller?.rating || 5.0,
    },
  })
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'onboard'
    const body = await req.json()

    if (action === 'onboard' || action === 'profile') {
      const data = sellerProfileSchema.parse(body)
      const profile = createOrUpdateSeller(data)
      return NextResponse.json({ success: true, sellerProfile: profile })
    }

    if (action === 'create-listing') {
      const data = listingSchema.parse(body)
      const listing = createListing(data)
      return NextResponse.json({ success: true, listing })
    }

    if (action === 'update-listing') {
      const { listingId, sellerId, updates } = body
      const listing = updateListing(listingId, sellerId, updates)
      return NextResponse.json({ success: true, listing })
    }

    if (action === 'delete-listing') {
      const { listingId, sellerId } = body
      deleteListing(listingId, sellerId)
      return NextResponse.json({ success: true })
    }

    if (action === 'boost') {
      const { listingId, sellerId } = body
      const listing = updateListing(listingId, sellerId, { isBoosted: true })
      return NextResponse.json({ success: true, listing })
    }

    return NextResponse.json({ error: 'Unsupported seller action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing seller request' }, { status: 400 })
  }
}
