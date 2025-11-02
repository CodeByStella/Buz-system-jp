import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { sheetsData } from './sheets'

const isFormula = (v: unknown): v is string => typeof v === 'string' && v.trim().startsWith('=')

interface SyncOptions {
  // Whether to remove records that are no longer in sheets.ts
  removeOrphaned?: boolean
  // Whether to force update all records (even if they haven't changed)
  forceUpdate?: boolean
  // Specific user ID to sync (if not provided, syncs all users)
  userId?: string
}

async function syncDatabase(options: SyncOptions = {}) {
  const { removeOrphaned = false, forceUpdate = false, userId } = options
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('Missing MONGO_URI/MONGODB_URI')
    process.exit(1)
  }
  
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  try {
    // Build a map of all expected data from sheets.ts
    const expectedData = new Map<string, { sheet: string; cell: string; value: string | number }>()
    
    Object.entries(sheetsData).forEach(([sheetName, cells]) => {
      Object.entries(cells).forEach(([cell, value]) => {
        const key = `${sheetName}:${cell}`
        expectedData.set(key, { sheet: sheetName, cell, value })
      })
    })

    console.log(`Found ${expectedData.size} expected records in sheets.ts`)

    // Get all existing data
    const query = userId ? { user: userId } : {}
    const existingData = await Data.find(query).lean()
    console.log(`Found ${existingData.length} existing records in database`)

    // Build maps for efficient lookup
    const existingByUser = new Map<string, Map<string, any>>()
    existingData.forEach(doc => {
      if (!existingByUser.has(doc.user)) {
        existingByUser.set(doc.user, new Map())
      }
      const userData = existingByUser.get(doc.user)!
      userData.set(`${doc.sheet}:${doc.cell}`, doc)
    })

    const usersToSync = userId ? [userId] : Array.from(existingByUser.keys())
    console.log(`Syncing ${usersToSync.length} users`)

    let totalUpdates = 0
    let totalInserts = 0
    let totalRemovals = 0

    for (const currentUserId of usersToSync) {
      console.log(`\nSyncing user: ${currentUserId}`)
      
      const userData = existingByUser.get(currentUserId) || new Map()
      const bulkOps: any[] = []

      // Process all expected data
      for (const [key, expectedRecord] of expectedData) {
        const existingRecord = userData.get(key)
        
        if (!existingRecord) {
          // Insert new record
          bulkOps.push({
            insertOne: {
              document: {
                user: currentUserId,
                sheet: expectedRecord.sheet,
                cell: expectedRecord.cell,
                value: expectedRecord.value
              }
            }
          })
          totalInserts++
        } else {
          // Always sync to match seed data from sheets.ts
          // If values differ, update to match seed (seed is authoritative)
          const needsUpdate = forceUpdate || existingRecord.value !== expectedRecord.value
          
          if (needsUpdate) {
            bulkOps.push({
              updateOne: {
                filter: { _id: existingRecord._id },
                update: { $set: { value: expectedRecord.value } }
              }
            })
            totalUpdates++
          }
        }
      }

      // Handle orphaned records (if removeOrphaned is true)
      if (removeOrphaned) {
        for (const [key, existingRecord] of userData) {
          if (!expectedData.has(key)) {
            bulkOps.push({
              deleteOne: {
                filter: { _id: existingRecord._id }
              }
            })
            totalRemovals++
          }
        }
      }

      // Execute bulk operations for this user
      if (bulkOps.length > 0) {
        const result = await Data.bulkWrite(bulkOps)
        console.log(`User ${currentUserId}: ${result.insertedCount} inserted, ${result.modifiedCount} updated, ${result.deletedCount} deleted`)
      } else {
        console.log(`User ${currentUserId}: No changes needed`)
      }
    }

    console.log(`\n=== Sync Summary ===`)
    console.log(`Total inserts: ${totalInserts}`)
    console.log(`Total updates: ${totalUpdates}`)
    console.log(`Total removals: ${totalRemovals}`)
    console.log(`Users synced: ${usersToSync.length}`)

  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const options: SyncOptions = {}

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--remove-orphaned':
        options.removeOrphaned = true
        break
      case '--force-update':
        options.forceUpdate = true
        break
      case '--user':
        if (i + 1 < args.length) {
          options.userId = args[i + 1]
          i++ // Skip next argument as it's the user ID
        } else {
          console.error('--user requires a user ID')
          process.exit(1)
        }
        break
      case '--help':
        console.log(`
Usage: npm run sync-database [options]

Options:
  --remove-orphaned    Remove records that are no longer in sheets.ts
  --force-update        Force update all records even if they haven't changed
  --user <userId>       Sync only specific user (default: sync all users)
  --help               Show this help message

Examples:
  npm run sync-database                           # Sync all users, keep orphaned records
  npm run sync-database --remove-orphaned        # Sync all users, remove orphaned records
  npm run sync-database --user user123            # Sync only user123
  npm run sync-database --force-update --user user123  # Force update user123
        `)
        process.exit(0)
        break
    }
  }

  console.log('Starting database sync...')
  console.log('Options:', options)
  
  await syncDatabase(options)
  console.log('Database sync completed!')
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Sync failed:', e)
    process.exit(1)
  })
}

export { syncDatabase }
