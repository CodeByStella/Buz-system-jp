import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { Data } from '@/models/data'
import { seedSheetsForUser } from '@/scripts/sheets'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const startTime = Date.now()
  
    const userId = req.user!.id
    let userInputs = await Data.find({ user: userId }).lean() // Use lean() for better performance
    
    // Clean up any error values from the database
    const errorValues = ['#ERROR!', '#REF!', '#VALUE!', '#NAME?', '#DIV/0!', '#N/A', '#NUM!', '#NULL!']
    const itemsWithErrors = userInputs.filter(item => 
      typeof item.value === 'string' && errorValues.some(errorValue => item.value.includes(errorValue))
    )
    
    // If user has no data yet (race condition), seed now and refetch
    if (userInputs.length === 0) {
      await seedSheetsForUser(userId)
      userInputs = await Data.find({ user: userId }).lean()
    }

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
      const cleanedInputs = await Data.find({ user: userId }).lean()
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
    const userId = req.user!.id
    // Reject attempts to save formulas
    if (typeof value === 'string' && value.trim().startsWith('=')) {
      return res.status(400).json({ error: '数式セルは更新できません' })
    }
    
    // Use findOneAndUpdate with upsert option to update if exists, create if not
    const userInput = await Data.findOneAndUpdate(
      { user: userId, sheet, cell },
      { 
        user: userId,
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
    // Filter out any attempts to update formulas
    const sanitizedInputs = inputs.filter((i: any) => !(typeof i.value === 'string' && String(i.value).trim().startsWith('=')))
    if (sanitizedInputs.length === 0) {
      return res.json({ success: true, modified: 0, inserted: 0, total: 0 })
    }
    // Use bulkWrite for efficient upsert operations
    const userId = req.user!.id
    const bulkOps = sanitizedInputs.map((input: any) => ({
      updateOne: {
        filter: { user: userId, sheet: input.sheet, cell: input.cell },
        update: {
          $set: {
            user: userId,
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
      total: sanitizedInputs.length
    })
  } catch (error) {
    console.error('Bulk save input error:', error)
    res.status(500).json({ error: '入力データの一括保存に失敗しました' })
  }
})

// Reset all user data to initial seed values
router.post('/reset', async (req: AuthenticatedRequest, res) => {
  // Set a longer timeout for this operation (30 seconds)
  req.setTimeout(30000)
  
  try {
    const userId = req.user!.id
    console.log(`Starting full data reset for user ${userId}`)
    
    // Use a more efficient approach: delete and re-seed in one transaction-like operation
    const startTime = Date.now()
    
    // Delete all existing data for this user (this is fast)
    const deleteResult = await Data.deleteMany({ user: userId })
    console.log(`Deleted ${deleteResult.deletedCount} existing records for user ${userId}`)
    
    // Re-seed the user with initial data (this is the heavy part)
    console.log(`Starting to re-seed data for user ${userId}...`)
    await seedSheetsForUser(userId)
    console.log(`Re-seeded initial data for user ${userId}`)
    
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
