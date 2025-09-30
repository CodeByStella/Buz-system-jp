import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { createCalculationEngine } from '../lib/calculation-engine'

const router = express.Router()

// Apply authentication to all calculate routes
router.use(authenticateToken)

// Calculate sheet
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheet, inputs } = req.body

    if (!sheet) {
      return res.status(400).json({ error: 'シート名が必要です' })
    }

    // Get global parameters
    const globalParams = await prisma.globalParameter.findMany()
    const globalParamsMap = globalParams.reduce((acc, param) => {
      acc[param.key] = param.value
      return acc
    }, {} as Record<string, number>)

    // Get user inputs for this sheet
    const userInputs = await prisma.userInput.findMany({
      where: {
        userId: req.user!.id,
        sheet
      }
    })
    const userInputsMap = userInputs.reduce((acc, input) => {
      acc[input.cellKey] = input.value
      return acc
    }, {} as Record<string, number>)

    // Merge with provided inputs
    const allInputs = { ...userInputsMap, ...inputs }

    // Create calculation engine and calculate
    const engine = createCalculationEngine(globalParamsMap, allInputs, sheet)
    const results = engine.calculateSheet(sheet)

    res.json({ results })
  } catch (error) {
    console.error('Calculate error:', error)
    res.status(500).json({ error: '計算に失敗しました' })
  }
})

export default router
