import { NextResponse } from 'next/server'
import { getAllListings, getListingById, db } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (id) {
    const listing = getListingById(id)
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    const similar = db.listings
      .filter((l) => l.category === listing.category && l.id !== listing.id)
      .slice(0, 4)

    const seller = db.sellers.find((s) => s.userId === listing.sellerId)

    return NextResponse.json({
      listing,
      seller,
      similar,
    })
  }

  const category = url.searchParams.get('category') || undefined
  const q = url.searchParams.get('q') || undefined
  const sellerId = url.searchParams.get('sellerId') || undefined
  const status = url.searchParams.get('status') || undefined
  const condition = url.searchParams.get('condition') || undefined
  const minPrice = url.searchParams.get('minPrice') ? Number(url.searchParams.get('minPrice')) : undefined
  const maxPrice = url.searchParams.get('maxPrice') ? Number(url.searchParams.get('maxPrice')) : undefined
  const sortBy = url.searchParams.get('sortBy') || undefined
  const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1
  const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 24

  const result = getAllListings({
    category,
    q,
    sellerId,
    status,
    condition,
    minPrice,
    maxPrice,
    sortBy,
    page,
    limit,
  })

  return NextResponse.json(result)
}
