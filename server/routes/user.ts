import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { Data } from '@/models/data'
import { seedSheetsForUser, getSheetsData, type WorkbookType } from '@/scripts/sheets'


function parseWorkbook(w: unknown): WorkbookType {
  if (w === 'pdca' || w === 'company_rating') return w
  return 'pdca'
}

// Helper function to check if a value is a formula
const isFormula = (v: unknown): v is string => typeof v === 'string' && v.trim().startsWith('=')

// Check if a cell is supposed to be a formula according to sheetsData for the workbook
const isFormulaCell = (workbook: WorkbookType, sheet: string, cell: string): boolean => {
  const sheetData = getSheetsData(workbook)[sheet]
  if (!sheetData) return false
  const value = sheetData[cell]
  return isFormula(value)
}

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const startTime = Date.now()
    const workbook = parseWorkbook(req.query.workbook)
    const userId = req.user!.id
    let userInputs = await Data.find({ user: userId, workbook }).lean()
    
    // If user has no data for this workbook yet, seed and refetch
    if (userInputs.length === 0) {
      await seedSheetsForUser(userId, workbook)
      userInputs = await Data.find({ user: userId, workbook }).lean()
    } else {
      // Do NOT merge "missing formula cells from seed" here. The running server caches the seed
      // module; after you remove a formula from sheets-company-rating.ts and run db:formula, a
      // refresh would re-add it because getSheetsData() would still return the old seed. Formula
      // sync (add/remove) is done only via npm run db:formula. New users are seeded above.
      const toUpsert: any[] = []
      // Fix known mistaken value: result!E25 was "定量要因" in old extraction; cell should be empty
      const badE25 = userInputs.find((i: any) => i.sheet === 'result' && i.cell === 'E25' && i.value === '定量要因')
      if (badE25) {
        toUpsert.push({ sheet: 'result', cell: 'E25', value: '', user: userId, workbook })
      }
      // Fix J42 formula that causes #CYCLE!: use E26 instead of J26 so HyperFormula doesn't see a cycle
      const badJ42 = userInputs.find((i: any) => i.sheet === 'result' && i.cell === 'J42' && i.value === '=E42+J26')
      if (badJ42) {
        toUpsert.push({ sheet: 'result', cell: 'J42', value: '=E42+E26', user: userId, workbook })
      }
      if (toUpsert.length > 0) {
        await Data.bulkWrite(toUpsert.map((item) => ({
          updateOne: {
            filter: { user: userId, workbook, sheet: item.sheet, cell: item.cell },
            update: { $set: item },
            upsert: true,
          },
        })))
        userInputs = await Data.find({ user: userId, workbook }).lean()
      }
    }
    
    // Clean up any error values from the database
    const errorValues = ['#ERROR!', '#REF!', '#VALUE!', '#NAME?', '#DIV/0!', '#N/A', '#NUM!', '#NULL!']
    const itemsWithErrors = userInputs.filter((item: any) => 
      typeof item.value === 'string' && errorValues.some((errorValue: string) => item.value.includes(errorValue))
    )

    if (itemsWithErrors.length > 0) {
      console.log(`Found ${itemsWithErrors.length} items with error values, cleaning up...`)
      const sheetsDataForWorkbook = getSheetsData(workbook)
      const updatePromises = itemsWithErrors.map(async (item: any) => {
        if (isFormulaCell(workbook, item.sheet, item.cell)) {
          const seedValue = sheetsDataForWorkbook[item.sheet]?.[item.cell]
          if (seedValue) {
            return Data.updateOne(
              { _id: item._id },
              { $set: { value: seedValue } }
            )
          }
        }
        return Data.updateOne(
          { _id: item._id },
          { $set: { value: '' } }
        )
      })
      await Promise.all(updatePromises)
      console.log(`Cleaned up ${itemsWithErrors.length} error values`)
      const cleanedInputs = await Data.find({ user: userId, workbook }).lean()
      const endTime = Date.now()
      console.log(`User inputs fetched and cleaned successfully in ${endTime - startTime}ms, ${cleanedInputs.length} items`)
      res.json(cleanedInputs)
    } else {
      const endTime = Date.now()
      console.log(`User inputs fetched successfully in ${endTime - startTime}ms, ${userInputs.length} items`)
      res.json(userInputs)
    }
  } catch (error) {
    console.error('Get inputs error:', error)
    
    // Provide more specific error messages
    let errorMessage = '入力データの取得に失敗しました'
    
    if (error instanceof Error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        errorMessage = 'データベースへの接続に失敗しました'
      } else if (error.name === 'MongoServerError') {
        errorMessage = 'データベースエラーが発生しました'
      }
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
  }
})

// Save user input (create or update)
router.post('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheet, cell, value, workbook: bodyWorkbook } = req.body
    const workbook = parseWorkbook(bodyWorkbook ?? req.query.workbook)
    const userId = req.user!.id
    
    if (typeof value === 'string' && value.trim().startsWith('=')) {
      return res.status(400).json({ error: '数式セルは更新できません' })
    }
    
    if (isFormulaCell(workbook, sheet, cell)) {
      const existing = await Data.findOne({ user: userId, workbook, sheet, cell }).lean()
      if (existing && isFormula(existing.value)) {
        return res.status(400).json({ 
          error: 'このセルは数式セルのため、値を直接更新することはできません' 
        })
      }
    }
    
    const userInput = await Data.findOneAndUpdate(
      { user: userId, workbook, sheet, cell },
      { 
        user: userId,
        workbook,
        sheet,
        cell,
        value,
      },
      { new: true, upsert: true, runValidators: true }
    )
    
    res.json(userInput)
  } catch (error) {
    console.error('Save input error:', error)
    res.status(500).json({ error: '入力データの保存に失敗しました' })
  }
})

// Bulk save user inputs (create or update multiple cells)
router.post('/inputs/bulk', async (req: AuthenticatedRequest, res) => {
  try {
    const { inputs, workbook: bodyWorkbook } = req.body
    const workbook = parseWorkbook(bodyWorkbook ?? (inputs?.[0]?.workbook) ?? req.query.workbook)
    
    if (!Array.isArray(inputs)) {
      return res.status(400).json({ error: '入力データは配列である必要があります' })
    }
    
    const sanitizedInputs = inputs.filter((i: any) => {
      return !(typeof i.value === 'string' && String(i.value).trim().startsWith('='))
    })
    
    if (sanitizedInputs.length === 0) {
      return res.json({ success: true, modified: 0, inserted: 0, total: 0 })
    }
    
    const userId = req.user!.id
    const existingData = await Data.find({ 
      user: userId, 
      workbook,
      $or: sanitizedInputs.map((i: any) => ({ sheet: i.sheet, cell: i.cell }))
    }).lean()
    
    const existingFormulaCells = new Set<string>()
    existingData.forEach((doc: any) => {
      if (isFormula(doc.value)) {
        existingFormulaCells.add(`${doc.sheet}:${doc.cell}`)
      }
    })
    
    const finalInputs = sanitizedInputs.filter((input: any) => {
      const key = `${input.sheet}:${input.cell}`
      if (existingFormulaCells.has(key)) return false
      if (isFormulaCell(workbook, input.sheet, input.cell)) return false
      return true
    })
    
    if (finalInputs.length === 0) {
      return res.json({ 
        success: true, 
        modified: 0, 
        inserted: 0, 
        total: 0,
        message: 'すべてのセルが数式セルのため、更新されませんでした'
      })
    }
    
    const bulkOps = finalInputs.map((input: any) => ({
      updateOne: {
        filter: { user: userId, workbook, sheet: input.sheet, cell: input.cell },
        update: {
          $set: {
            user: userId,
            workbook,
            sheet: input.sheet,
            cell: input.cell,
            value: input.value,
          }
        },
        upsert: true
      }
    }))

    const result = await Data.bulkWrite(bulkOps)
    
    res.json({
      success: true,
      modified: result.modifiedCount,
      inserted: result.upsertedCount,
      total: finalInputs.length,
      skipped: sanitizedInputs.length - finalInputs.length
    })
  } catch (error) {
    console.error('Bulk save input error:', error)
    res.status(500).json({ error: '入力データの一括保存に失敗しました' })
  }
})

// Reset all user data to initial seed values (per workbook)
router.post('/reset', async (req: AuthenticatedRequest, res) => {
  req.setTimeout(30000)
  
  try {
    const workbook = parseWorkbook(req.body?.workbook ?? req.query.workbook)
    const userId = req.user!.id
    console.log(`Starting data reset for user ${userId}, workbook ${workbook}`)
    
    const startTime = Date.now()
    const deleteResult = await Data.deleteMany({ user: userId, workbook })
    console.log(`Deleted ${deleteResult.deletedCount} existing records for user ${userId}, workbook ${workbook}`)
    
    console.log(`Starting to re-seed data for user ${userId}, workbook ${workbook}...`)
    await seedSheetsForUser(userId, workbook)
    console.log(`Re-seeded initial data for user ${userId}, workbook ${workbook}`)
    
    // Instead of fetching all data again, we can return a success response
    // The frontend will refetch the data after reset
    const endTime = Date.now()
    console.log(`Reset completed for user ${userId} in ${endTime - startTime}ms`)
    
    res.json({
      success: true,
      message: 'データが初期状態にリセットされました',
      // Don't return all data to reduce response size and time
      resetCompleted: true
    })
  } catch (error) {
    console.error('Reset data error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'データのリセットに失敗しました'
    
    if (error instanceof Error) {
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        errorMessage = 'データベースへの接続に失敗しました'
      } else if (error.name === 'MongoServerError') {
        errorMessage = 'データベースエラーが発生しました'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'リセット処理がタイムアウトしました。しばらく待ってから再試行してください。'
      }
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
  }
})

export default router
