import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    }

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'price') orderBy.priceEur = sortOrder
    else if (sortBy === 'year') orderBy.year = sortOrder
    else if (sortBy === 'km') orderBy.km = sortOrder
    else orderBy.createdAt = sortOrder

    // Fetch listings
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    // Transform to match existing API format
    const vehicles = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      price: listing.priceEur,
      km: listing.km,
      fuel: listing.fuel,
      gearbox: listing.gearbox,
      body: listing.body,
      country: listing.country,
      description: listing.shortDesc || '',
      image: listing.coverUrl || listing.images[0]?.url || '/api/placeholder/400/300',
      images: listing.images.map(img => ({
        url: img.url,
        alt: img.alt || '',
      })),
      sourceUrl: listing.sourceUrl,
      sourceName: listing.sourceName,
      type: listing.type,
      status: listing.status,
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      ok: true,
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        brands: [],
        models: [],
        bodies: [],
        fuels: [],
        countries: [],
        gearboxes: [],
        yearRange: { min: 1990, max: new Date().getFullYear() },
        kmRange: { min: 0, max: 200000 },
        priceRange: { min: 0, max: 100000 },
      },
    })
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json(
      { ok: false, message: 'Eroare la încărcarea anunțurilor' },
      { status: 500 }
    )
  }
}
