import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { Data } from '@/models/data'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const startTime = Date.now()
    
    const userInputs = await Data.find({}).lean() // Use lean() for better performance
    
    // Clean up any error values from the database
    const errorValues = ['#ERROR!', '#REF!', '#VALUE!', '#NAME?', '#DIV/0!', '#N/A', '#NUM!', '#NULL!']
    const itemsWithErrors = userInputs.filter(item => 
      typeof item.value === 'string' && errorValues.some(errorValue => item.value.includes(errorValue))
    )
    
    if (itemsWithErrors.length > 0) {
      console.log(`Found ${itemsWithErrors.length} items with error values, cleaning up...`)
      
      // Update items with error values to empty strings
      const updatePromises = itemsWithErrors.map(item => 
        Data.updateOne(
          { _id: item._id },
          { $set: { value: '' } }
        )
      )
      
      await Promise.all(updatePromises)
      console.log(`Cleaned up ${itemsWithErrors.length} error values`)
      
      // Refetch the cleaned data
      const cleanedInputs = await Data.find({}).lean()
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
