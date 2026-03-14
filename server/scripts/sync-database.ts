import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { getSheetsData, type WorkbookType } from './sheets'

interface SyncOptions {
  removeOrphaned?: boolean
  forceUpdate?: boolean
  userId?: string
  workbook?: WorkbookType
}

async function syncDatabase(options: SyncOptions = {}) {
  const { removeOrphaned = false, forceUpdate = false, userId, workbook: optWorkbook } = options
  const workbooks: WorkbookType[] = optWorkbook ? [optWorkbook] : ['pdca', 'company_rating']
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('Missing MONGO_URI/MONGODB_URI')
    process.exit(1)
  }
  
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')
  try {
    for (const workbook of workbooks) {
      await syncDatabaseForWorkbook(workbook, { removeOrphaned, forceUpdate, userId })
    }
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

async function syncDatabaseForWorkbook(
  workbook: WorkbookType,
  options: { removeOrphaned: boolean; forceUpdate: boolean; userId?: string }
) {
  const { removeOrphaned, forceUpdate, userId } = options
  const sheetsData = getSheetsData(workbook)

  try {
    const expectedData = new Map<string, { sheet: string; cell: string; value: string | number }>()
    Object.entries(sheetsData).forEach(([sheetName, cells]) => {
      Object.entries(cells).forEach(([cell, value]) => {
        const key = `${sheetName}:${cell}`
        expectedData.set(key, { sheet: sheetName, cell, value })
      })
    })

    console.log(`\n[${workbook}] Found ${expectedData.size} expected records`)

    const query: any = { workbook }
    if (userId) query.user = userId
    const existingData = await Data.find(query).lean()
    console.log(`[${workbook}] Found ${existingData.length} existing records in database`)

    const existingByUser = new Map<string, Map<string, any>>()
    existingData.forEach((doc: any) => {
      if (!existingByUser.has(doc.user)) {
        existingByUser.set(doc.user, new Map())
      }
      const userData = existingByUser.get(doc.user)!
      userData.set(`${doc.sheet}:${doc.cell}`, doc)
    })

    const usersToSync = userId ? [userId] : Array.from(existingByUser.keys())
    console.log(`[${workbook}] Syncing ${usersToSync.length} users`)

    let totalUpdates = 0
    let totalInserts = 0
    let totalRemovals = 0

    for (const currentUserId of usersToSync) {
      console.log(`\nSyncing user: ${currentUserId}`)
      
      const userData = existingByUser.get(currentUserId) || new Map()
      const bulkOps: any[] = []
      const updatesToDisplay: Array<{ sheet: string; cell: string; oldValue: any; newValue: any }> = []
      const insertsToDisplay: Array<{ sheet: string; cell: string; value: any }> = []
      const removalsToDisplay: Array<{ sheet: string; cell: string; value: any }> = []

      // Process all expected data
      for (const [key, expectedRecord] of expectedData) {
        const existingRecord = userData.get(key)
        
        if (!existingRecord) {
          bulkOps.push({
            insertOne: {
              document: {
                user: currentUserId,
                workbook,
                sheet: expectedRecord.sheet,
                cell: expectedRecord.cell,
                value: expectedRecord.value
              }
            }
          })
          insertsToDisplay.push({
            sheet: expectedRecord.sheet,
            cell: expectedRecord.cell,
            value: expectedRecord.value
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
            updatesToDisplay.push({
              sheet: existingRecord.sheet,
              cell: existingRecord.cell,
              oldValue: existingRecord.value,
              newValue: expectedRecord.value
            })
            totalUpdates++
          }
        }
      }

      if (removeOrphaned) {
        for (const [key, existingRecord] of userData) {
          if (!expectedData.has(key)) {
            bulkOps.push({
              deleteOne: {
                filter: { _id: (existingRecord as any)._id }
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

      // Display documents before executing
      if (insertsToDisplay.length > 0) {
        console.log(`\n  Documents to INSERT (${insertsToDisplay.length}):`)
        insertsToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell} = ${JSON.stringify(doc.value)}`)
        })
      }

      if (updatesToDisplay.length > 0) {
        console.log(`\n  Documents to UPDATE (${updatesToDisplay.length}):`)
        updatesToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell}`)
          console.log(`      Old: ${JSON.stringify(doc.oldValue)}`)
          console.log(`      New: ${JSON.stringify(doc.newValue)}`)
        })
      }

      if (removalsToDisplay.length > 0) {
        console.log(`\n  Documents to DELETE (${removalsToDisplay.length}):`)
        removalsToDisplay.forEach(doc => {
          console.log(`    - ${doc.sheet}:${doc.cell} = ${JSON.stringify(doc.value)}`)
        })
      }

      // Execute bulk operations for this user
      if (bulkOps.length > 0) {
        const result = await Data.bulkWrite(bulkOps)
        console.log(`\n  ✓ User ${currentUserId}: ${result.insertedCount} inserted, ${result.modifiedCount} updated, ${result.deletedCount} deleted`)
      } else {
        console.log(`  ✓ User ${currentUserId}: No changes needed`)
      }
    }

    console.log(`\n[${workbook}] Sync Summary: inserts=${totalInserts}, updates=${totalUpdates}, removals=${totalRemovals}, users=${usersToSync.length}`)
  } catch (err) {
    console.error(`Sync failed for workbook ${workbook}:`, err)
    throw err
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
          i++
        } else {
          console.error('--user requires a user ID')
          process.exit(1)
        }
        break
      case '--workbook':
        if (i + 1 < args.length) {
          const w = args[i + 1]
          if (w === 'pdca' || w === 'company_rating') options.workbook = w
          i++
        }
        break
      case '--help':
        console.log(`
Usage: npm run sync-database [options]

Options:
  --remove-orphaned    Remove records that are no longer in sheets.ts
  --force-update        Force update all records even if they haven't changed
  --user <userId>       Sync only specific user (default: sync all users)
  --workbook <name>     Sync only pdca or company_rating (default: both)
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
