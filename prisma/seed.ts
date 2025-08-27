import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@autoorder.ro' },
    update: {},
    create: {
      email: 'admin@autoorder.ro',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample listings
  const sampleListings = [
    {
      title: "Dodge Grand Caravan",
      brand: "Dodge",
      model: "Grand Caravan",
      year: 2020,
      priceEur: 22000,
      km: 45000,
      fuel: "Diesel",
      gearbox: "Automata",
      body: "MPV",
      country: "Germania",
      type: "BUY_NOW",
      status: "PUBLISHED",
      shortDesc: "Vagon spațios, întreținere bună.",
      sourceUrl: "https://www.openlane.com/car/12345/buy-now",
      sourceName: "Openlane"
    },
    {
      title: "Subaru Crosstrek",
      brand: "Subaru",
      model: "Crosstrek",
      year: 2018,
      priceEur: 18000,
      km: 60000,
      fuel: "Benzina",
      gearbox: "Automata",
      body: "SUV",
      country: "Franța",
      type: "BUY_NOW",
      status: "PUBLISHED",
      shortDesc: "SUV compact, un proprietar.",
      sourceUrl: "https://www.openlane.com/car/67890/buy-now",
      sourceName: "Openlane"
    },
    {
      title: "Chevrolet Silverado",
      brand: "Chevrolet",
      model: "Silverado",
      year: 2021,
      priceEur: 35000,
      km: 30000,
      fuel: "Diesel",
      gearbox: "Automata",
      body: "Pickup",
      country: "Olanda",
      type: "AUCTION",
      status: "DRAFT",
      shortDesc: "Pick-up robust, stare excelentă."
    }
  ]

  for (const listingData of sampleListings) {
    const listing = await prisma.listing.upsert({
      where: { 
        title_brand_model: {
          title: listingData.title,
          brand: listingData.brand,
          model: listingData.model
        }
      },
      update: {},
      create: listingData,
    })

    console.log(`✅ Listing created: ${listing.title}`)
  }

  // Create audit log entries
  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: 'SEED_DATABASE',
      data: JSON.stringify({ 
        message: 'Database seeded with initial data',
        listingsCount: sampleListings.length
      }),
    },
  })

  console.log('✅ Database seed completed successfully!')
  console.log(`📊 Created ${sampleListings.length} sample listings`)
  console.log(`👤 Admin user: admin@autoorder.ro / admin123`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
