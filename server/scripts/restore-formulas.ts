import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Data } from '@/models/data'
import { sheetsData } from './sheets'

const isFormula = (v: unknown): v is string => typeof v === 'string' && v.trim().startsWith('=')

async function restoreFormulas() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('Missing MONGO_URI/MONGODB_URI')
    process.exit(1)
  }
  await mongoose.connect(mongoUri)

  try {
    // Build a set of all formula cells from seed definitions
    const formulaBySheetCell = new Map<string, string>()
    Object.entries(sheetsData).forEach(([sheet, cells]) => {
      Object.entries(cells).forEach(([cellRef, value]) => {
        if (isFormula(value)) {
          formulaBySheetCell.set(`${sheet}:${cellRef}`, value)
        }
      })
    })

    const all = await Data.find({}).lean()
    const ops: any[] = []

    for (const doc of all) {
      const key = `${doc.sheet}:${doc.cell}`
      const seedFormula = formulaBySheetCell.get(key)
      if (!seedFormula) continue

      // If current value is not a formula, restore it
      if (!isFormula(doc.value)) {
        ops.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { value: seedFormula } },
          },
        })
      }
    }

    if (ops.length > 0) {
      const res = await Data.bulkWrite(ops)
      console.log('Restored formulas:', res.modifiedCount)
    } else {
      console.log('No formula restorations needed')
    }
  } finally {
    await mongoose.disconnect()
  }
}

restoreFormulas().catch((e) => {
  console.error(e)
  process.exit(1)
})


