'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authenticateUser, createSession, deleteSession, validateSession } from '@/lib/auth'
import { listingSchema, type ListingFormData, type ImportFormData } from '@/types/admin'
// Using string literals instead of enums for SQLite compatibility

// Authentication actions
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email și parola sunt obligatorii' }
  }

  const user = await authenticateUser(email, password)
  if (!user) {
    return { error: 'Email sau parolă incorectă' }
  }

  const token = await createSession(user.id)
  
  // Set cookie
  cookies().set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
  })

  // Log action
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'LOGIN',
      data: JSON.stringify({ email: user.email }),
    },
  })

  redirect('/admin')
}

export async function logoutAction() {
  const token = cookies().get('admin-session')?.value
  
  if (token) {
    await deleteSession(token)
    
    // Log action
    const user = await validateSession(token)
    if (user) {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'LOGOUT',
        },
      })
    }
  }
  
  cookies().delete('admin-session')
  redirect('/admin/login')
}

export async function getCurrentUser() {
  const token = cookies().get('admin-session')?.value
  
  if (!token) {
    return null
  }
  
  return await validateSession(token)
}

// Listing management actions
export async function createListingAction(data: ListingFormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const validatedData = listingSchema.parse(data)
    const { images, ...listingData } = validatedData
    
    const listing = await prisma.listing.create({
      data: listingData,
    })

    // Handle images if provided
    if (images && images.length > 0) {
      await prisma.image.createMany({
        data: images.map((img, index) => ({
          listingId: listing.id,
          url: img.url,
          alt: img.alt,
        })),
      })

      // Set coverUrl to first image if not already set
      if (!listing.coverUrl && images[0]) {
        await prisma.listing.update({
          where: { id: listing.id },
          data: { coverUrl: images[0].url },
        })
      }
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        listingId: listing.id,
        action: 'CREATE_LISTING',
        data: JSON.stringify(validatedData),
      },
    })

    revalidatePath('/admin/listings')
    revalidatePath('/stock')
    
    return { success: true, listing }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Eroare la crearea anunțului' }
  }
}

export async function updateListingAction(id: string, data: ListingFormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const validatedData = listingSchema.parse(data)
    const { images, ...listingData } = validatedData
    
    // Update listing data (without images)
    const listing = await prisma.listing.update({
      where: { id },
      data: listingData,
    })

    // Handle images in a transaction
    if (images !== undefined) {
      await prisma.$transaction(async (tx) => {
        // Delete existing images that are not in the new list
        const existingImageIds = images.filter(img => img.id).map(img => img.id!)
        if (existingImageIds.length > 0) {
          await tx.image.deleteMany({
            where: {
              listingId: id,
              id: { notIn: existingImageIds },
            },
          })
        } else {
          // If no images with IDs, delete all existing images
          await tx.image.deleteMany({
            where: { listingId: id },
          })
        }

        // Create new images
        if (images.length > 0) {
          await tx.image.createMany({
            data: images.map(img => ({
              listingId: id,
              url: img.url,
              alt: img.alt,
            })),
          })

          // Set coverUrl to first image if not already set
          if (!listing.coverUrl && images[0]) {
            await tx.listing.update({
              where: { id },
              data: { coverUrl: images[0].url },
            })
          }
        }
      })
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        listingId: listing.id,
        action: 'UPDATE_LISTING',
        data: JSON.stringify(validatedData),
      },
    })

    revalidatePath('/admin/listings')
    revalidatePath('/stock')
    
    return { success: true, listing }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Eroare la actualizarea anunțului' }
  }
}

export async function deleteListingAction(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const listing = await prisma.listing.delete({
      where: { id },
    })

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'DELETE_LISTING',
        data: JSON.stringify({ listingId: id, title: listing.title }),
      },
    })

    revalidatePath('/admin/listings')
    revalidatePath('/stock')
    
    return { success: true }
  } catch (error) {
    return { error: 'Eroare la ștergerea anunțului' }
  }
}

export async function bulkUpdateStatusAction(ids: string[], status: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    await prisma.listing.updateMany({
      where: { id: { in: ids } },
      data: { status },
    })

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'BULK_UPDATE_STATUS',
        data: JSON.stringify({ ids, status }),
      },
    })

    revalidatePath('/admin/listings')
    revalidatePath('/stock')
    
    return { success: true }
  } catch (error) {
    return { error: 'Eroare la actualizarea statusului' }
  }
}

// Import actions
export async function importListingsAction(data: ImportFormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Unauthorized', message: 'Unauthorized' }
  }

  try {
    const urls = data.urls.split('\n').map(url => url.trim()).filter(url => url)
    
    if (urls.length === 0) {
      return { success: false, error: 'Nu s-au găsit URL-uri valide', message: 'Nu s-au găsit URL-uri valide' }
    }

    if (urls.length > 30) {
      return { success: false, error: 'Maximum 30 URL-uri per import', message: 'Maximum 30 URL-uri per import' }
    }

    const createdListings = []
    const errors = []

    for (const url of urls) {
      try {
        // Validate URL
        if (!url.startsWith('https://')) {
          errors.push(`URL invalid: ${url}`)
          continue
        }

        // Create draft listing
        const listing = await prisma.listing.create({
          data: {
            title: 'Titlu provizoriu',
            brand: '',
            model: '',
            year: 0,
            priceEur: 0,
            km: 0,
            fuel: 'Benzina',
            gearbox: 'Manuala',
            body: 'Alt',
            country: '',
            type: "BUY_NOW",
            status: "DRAFT",
            sourceUrl: url,
            sourceName: 'Openlane',
          },
        })

        createdListings.push({
          id: listing.id,
          title: listing.title,
          status: listing.status,
        })
      } catch (error) {
        errors.push(`Eroare la crearea anunțului pentru ${url}: ${error}`)
      }
    }

    // Log action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'IMPORT_LISTINGS',
        data: JSON.stringify({ 
          urls, 
          createdCount: createdListings.length,
          errors: errors.length 
        }),
      },
    })

    revalidatePath('/admin/listings')
    
    return {
      success: true,
      message: `Import finalizat: ${createdListings.length} anunțuri create`,
      listings: createdListings,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    return { success: false, error: 'Eroare la import', message: 'Eroare la import' }
  }
}

// Data fetching actions
export async function getListingsAction(page = 1, limit = 12, search = '', filters: { status?: string; type?: string } = {}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.type) {
      where.type = filters.type
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    return {
      success: true,
      listings,
      total,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    return { error: 'Eroare la încărcarea anunțurilor' }
  }
}

export async function getListingAction(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
      },
    })

    if (!listing) {
      return { error: 'Anunțul nu a fost găsit' }
    }

    return { success: true, listing }
  } catch (error) {
    return { error: 'Eroare la încărcarea anunțului' }
  }
}

export async function getDashboardStatsAction() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const [total, published, draft, archived, sold] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'PUBLISHED' } }),
      prisma.listing.count({ where: { status: 'DRAFT' } }),
      prisma.listing.count({ where: { status: 'ARCHIVED' } }),
      prisma.listing.count({ where: { status: 'SOLD' } }),
    ])

    return {
      success: true,
      stats: { total, published, draft, archived, sold }
    }
  } catch (error) {
    return { error: 'Eroare la încărcarea statisticilor' }
  }
}
