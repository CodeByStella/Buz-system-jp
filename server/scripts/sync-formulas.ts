import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { getSheetsData, type WorkbookType } from './sheets'

const isFormula = (v: unknown): v is string => typeof v === 'string' && v.trim().startsWith('=')

interface SyncOptions {
  removeOrphaned?: boolean
  forceUpdate?: boolean
  userId?: string
  workbook?: WorkbookType
}

async function syncFormulas(options: SyncOptions = {}) {
  const { removeOrphaned = true, forceUpdate = false, userId, workbook: optWorkbook } = options
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
      await syncFormulasForWorkbook(workbook, { removeOrphaned, forceUpdate, userId })
    }
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

async function syncFormulasForWorkbook(
  workbook: WorkbookType,
  options: { removeOrphaned: boolean; forceUpdate: boolean; userId?: string }
) {
  const { removeOrphaned, forceUpdate, userId } = options
  const sheetsData = getSheetsData(workbook)

  const expectedFormulas = new Map<string, { sheet: string; cell: string; value: string | number }>()
  Object.entries(sheetsData).forEach(([sheetName, cells]) => {
    Object.entries(cells).forEach(([cell, value]) => {
      if (isFormula(value)) {
        const key = `${sheetName}:${cell}`
        expectedFormulas.set(key, { sheet: sheetName, cell, value })
      }
    })
  })

  console.log(`\n[${workbook}] Found ${expectedFormulas.size} expected formulas`)

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
  console.log(`[${workbook}] Syncing formulas for ${usersToSync.length} users`)

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
          bulkOps.push({
            insertOne: {
              document: {
                user: currentUserId,
                workbook,
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

    console.log(`\n[${workbook}] Formula Sync Summary: inserts=${totalInserts}, updates=${totalUpdates}, removals=${totalRemovals}, users=${usersToSync.length}`)
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
      case '--no-remove-orphaned':
        options.removeOrphaned = false
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
Usage: npm run db:formula [options]

Sync formulas from sheets.ts / sheets-company-rating.ts into the database.
- Inserts missing formula cells.
- Updates formula cells that differ from seed (e.g. damaged or old TRUE -> TRUE()).
- Removes formula records that are no longer in the seed (e.g. C18 removed from file -> removed from DB).
- Does NOT touch non-formula (user-saved) values. Safe for production.

Options:
  --no-remove-orphaned  Do NOT remove formulas that are no longer in the seed (default: remove them)
  --remove-orphaned     Remove formula records that are no longer in the seed (default: on)
  --force-update        Force update all formula cells to match seed (default: only update when value differs)
  --user <userId>       Sync only this user (default: all users)
  --workbook <name>     Sync only pdca or company_rating (default: both)
  --help                Show this help message

Examples:
  npm run db:formula                              # Full sync: add/update/remove formulas to match seed
  npm run db:formula --workbook company_rating    # Only company_rating workbook
  npm run db:formula --user <userId>             # Only one user
  npm run db:formula --no-remove-orphaned         # Only add/update, never delete
  npm run db:formula --force-update              # Overwrite every formula with seed
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

