import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { createCalculationEngine } from '../lib/calculation-engine'

const router = express.Router()

// Apply authentication to all PDF routes
router.use(authenticateToken)

// Generate PDF data
router.post('/generate', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheetName } = req.body

    if (!sheetName) {
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
        sheet: sheetName
      }
    })
    const userInputsMap = userInputs.reduce((acc, input) => {
      acc[input.cellKey] = input.value
      return acc
    }, {} as Record<string, number>)

    // Create calculation engine and calculate
    const engine = createCalculationEngine(globalParamsMap, userInputsMap, sheetName)
    const results = engine.calculateSheet(sheetName)

    // Prepare PDF data
    const pdfData = {
      sheetName,
      sheetTitle: getSheetTitle(sheetName),
      data: Object.entries(results).reduce((acc, [key, value]) => {
        acc[key] = {
          label: getCellLabel(key),
          value,
          calculated: true
        }
        return acc
      }, {} as Record<string, { label: string; value: number; calculated: boolean }>),
      logo: 'BUSINESS SYSTEM'
    }

    res.json({ pdfData })
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'PDF生成に失敗しました' })
  }
})

function getSheetTitle(sheetName: string): string {
  const titles: Record<string, string> = {
    'profit': '①利益',
    'breakeven': '損益分岐点',
    'salary': '③給料',
    'expenses': '④経費',
    'manufacturing-labor': '⑤製造原価(人)',
    'manufacturing-expenses': '⑥製造(経費)',
    'cost-details': '⑦原価詳細',
    'progress': '進捗実績値入力シート',
    'sales-plan': '部門別販売計画',
    'profit-plan': '利益計画表'
  }
  return titles[sheetName] || sheetName
}

function getCellLabel(key: string): string {
  const labels: Record<string, string> = {
    'total_sales': '総売上',
    'total_costs': '総コスト',
    'gross_profit': '粗利益',
    'profit_margin': '利益率',
    'fixed_costs': '固定費',
    'variable_costs_per_unit': '単位当たり変動費',
    'selling_price_per_unit': '販売単価',
    'contribution_margin': '貢献利益',
    'breakeven_units': '損益分岐点数量',
    'breakeven_sales': '損益分岐点売上'
  }
  return labels[key] || key
}

export default router
