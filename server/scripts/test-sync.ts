import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { sheetsData } from './sheets'

async function testSync() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('Missing MONGO_URI/MONGODB_URI')
    process.exit(1)
  }
  
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  try {
    // Count total expected records
    const totalExpected = Object.values(sheetsData).reduce((sum, sheet) => sum + Object.keys(sheet).length, 0)
    console.log(`Expected records from sheets.ts: ${totalExpected}`)

    // Count existing records
    const existingCount = await Data.countDocuments()
    console.log(`Existing records in database: ${existingCount}`)

    // Get unique users
    const users = await Data.distinct('user')
    console.log(`Users in database: ${users.length}`)
    console.log(`User IDs: ${users.join(', ')}`)

    // Check for formula vs non-formula records
    const formulaCount = await Data.countDocuments({ value: { $regex: /^=/ } })
    const nonFormulaCount = existingCount - formulaCount
    console.log(`Formula records: ${formulaCount}`)
    console.log(`Non-formula records: ${nonFormulaCount}`)

    // Sample some records
    const sampleRecords = await Data.find({}).limit(5).lean()
    console.log('\nSample records:')
    sampleRecords.forEach(record => {
      console.log(`  ${record.user} | ${record.sheet} | ${record.cell} | ${record.value}`)
    })

    console.log('\n✅ Database connection and data structure verified')
    console.log('You can now run: npm run db:sync')

  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testSync().catch((e) => {
  console.error('Test failed:', e)
  process.exit(1)
})
