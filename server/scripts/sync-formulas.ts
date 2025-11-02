import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { sheetsData } from './sheets'

const isFormula = (v: unknown): v is string => typeof v === 'string' && v.trim().startsWith('=')

interface SyncOptions {
  // Whether to remove formula records that are no longer in sheets.ts
  removeOrphaned?: boolean
  // Whether to force update all formula records (even if they haven't changed)
  forceUpdate?: boolean
  // Specific user ID to sync (if not provided, syncs all users)
  userId?: string
}

async function syncFormulas(options: SyncOptions = {}) {
  const { removeOrphaned = false, forceUpdate = false, userId } = options
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('Missing MONGO_URI/MONGODB_URI')
    process.exit(1)
  }
  
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  try {
    // Build a map of only formula data from sheets.ts
    const expectedFormulas = new Map<string, { sheet: string; cell: string; value: string | number }>()
    
    Object.entries(sheetsData).forEach(([sheetName, cells]) => {
      Object.entries(cells).forEach(([cell, value]) => {
        // Only include formulas (values starting with "=")
        if (isFormula(value)) {
          const key = `${sheetName}:${cell}`
          expectedFormulas.set(key, { sheet: sheetName, cell, value })
        }
      })
    })

    console.log(`Found ${expectedFormulas.size} expected formulas in sheets.ts`)

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
    console.log(`Syncing formulas for ${usersToSync.length} users`)

    let totalUpdates = 0
    let totalInserts = 0
    let totalRemovals = 0

    for (const currentUserId of usersToSync) {
      console.log(`\nSyncing formulas for user: ${currentUserId}`)
      
      const userData = existingByUser.get(currentUserId) || new Map()
      const bulkOps: any[] = []
      const updatesToDisplay: Array<{ sheet: string; cell: string; oldValue: any; newValue: any }> = []
      const insertsToDisplay: Array<{ sheet: string; cell: string; value: any }> = []
      const removalsToDisplay: Array<{ sheet: string; cell: string; value: any }> = []

      // Process all expected formulas
      for (const [key, expectedFormula] of expectedFormulas) {
        const existingRecord = userData.get(key)
        
        if (!existingRecord) {
          // Insert new formula record
          bulkOps.push({
            insertOne: {
              document: {
                user: currentUserId,
                sheet: expectedFormula.sheet,
                cell: expectedFormula.cell,
                value: expectedFormula.value
              }
            }
          })
          insertsToDisplay.push({
            sheet: expectedFormula.sheet,
            cell: expectedFormula.cell,
            value: expectedFormula.value
          })
          totalInserts++
        } else {
          // Only update if the value is different (always sync formulas from seed)
          const needsUpdate = forceUpdate || existingRecord.value !== expectedFormula.value
          
          if (needsUpdate) {
            bulkOps.push({
              updateOne: {
                filter: { _id: existingRecord._id },
                update: { $set: { value: expectedFormula.value } }
              }
            })
            updatesToDisplay.push({
              sheet: existingRecord.sheet,
              cell: existingRecord.cell,
              oldValue: existingRecord.value,
              newValue: expectedFormula.value
            })
            totalUpdates++
          }
        }
      }

      // Handle orphaned formula records (if removeOrphaned is true)
      // Only remove records that are formulas (start with "=")
      if (removeOrphaned) {
        for (const [key, existingRecord] of userData) {
          // Only remove if it's a formula that's no longer in expected formulas
          if (!expectedFormulas.has(key) && isFormula(existingRecord.value)) {
            bulkOps.push({
              deleteOne: {
                filter: { _id: existingRecord._id }
              }
            })
            removalsToDisplay.push({
              sheet: existingRecord.sheet,
              cell: existingRecord.cell,
              value: existingRecord.value
            })
            totalRemovals++
          }
        }
      }

      // Display formulas before executing
      if (insertsToDisplay.length > 0) {
        console.log(`\n  Formulas to INSERT (${insertsToDisplay.length}):`)
        insertsToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell} = ${JSON.stringify(doc.value)}`)
        })
      }

      if (updatesToDisplay.length > 0) {
        console.log(`\n  Formulas to UPDATE (${updatesToDisplay.length}):`)
        updatesToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell}`)
          console.log(`      Old: ${JSON.stringify(doc.oldValue)}`)
          console.log(`      New: ${JSON.stringify(doc.newValue)}`)
        })
      }

      if (removalsToDisplay.length > 0) {
        console.log(`\n  Formulas to DELETE (${removalsToDisplay.length}):`)
        removalsToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell} = ${JSON.stringify(doc.value)}`)
        })
      }

      // Execute bulk operations for this user
      if (bulkOps.length > 0) {
        const result = await Data.bulkWrite(bulkOps)
        console.log(`\n  ✓ User ${currentUserId}: ${result.insertedCount} inserted, ${result.modifiedCount} updated, ${result.deletedCount} deleted`)
      } else {
        console.log(`  ✓ User ${currentUserId}: No formula changes needed`)
      }
    }

    console.log(`\n=== Formula Sync Summary ===`)
    console.log(`Total formula inserts: ${totalInserts}`)
    console.log(`Total formula updates: ${totalUpdates}`)
    console.log(`Total formula removals: ${totalRemovals}`)
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
Usage: npm run db:formula [options]

Options:
  --remove-orphaned    Remove formula records that are no longer in sheets.ts
  --force-update        Force update all formula records even if they haven't changed
  --user <userId>       Sync only specific user (default: sync all users)
  --help               Show this help message

Examples:
  npm run db:formula                           # Sync all users' formulas, keep orphaned records
  npm run db:formula --remove-orphaned        # Sync all users' formulas, remove orphaned records
  npm run db:formula --user user123            # Sync only user123's formulas
  npm run db:formula --force-update --user user123  # Force update user123's formulas
        `)
        process.exit(0)
        break
    }
  }

  console.log('Starting formula sync...')
  console.log('Options:', options)
  
  await syncFormulas(options)
  console.log('Formula sync completed!')
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Formula sync failed:', e)
    process.exit(1)
  })
}

export { syncFormulas }

