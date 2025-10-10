import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { Data } from '@/models/data'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const userInputs = await Data.find({})
    res.json(userInputs)
  } catch (error) {
    console.error('Get inputs error:', error)
    res.status(500).json({ error: '入力データの取得に失敗しました' })
  }
})

// Save user input (create or update)
router.post('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheet, cell, value } = req.body
    
    // Use findOneAndUpdate with upsert option to update if exists, create if not
    const userInput = await Data.findOneAndUpdate(
      { sheet, cell },
      { 
        sheet,
        cell,
        value,
      },
      { 
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
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
    const { inputs } = req.body // Array of { sheet, cell, value, formula }
    
    if (!Array.isArray(inputs)) {
      return res.status(400).json({ error: '入力データは配列である必要があります' })
    }
    
    // Use bulkWrite for efficient upsert operations
    const bulkOps = inputs.map((input) => ({
      updateOne: {
        filter: { sheet: input.sheet, cell: input.cell },
        update: {
          $set: {
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
      total: inputs.length
    })
  } catch (error) {
    console.error('Bulk save input error:', error)
    res.status(500).json({ error: '入力データの一括保存に失敗しました' })
  }
})

export default router
