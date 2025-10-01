'use client'

import { ExcelForm } from '@/components/user/excel-form'

const profitCells = [
  // 営業利益 (Operating Profit)
  {
    key: 'operating_profit',
    label: '営業利益',
    value: 0,
    editable: true,
    formula: '営業収益 - 営業費用'
  },
  
  // 営業外収益 (Non-operating Income)
  {
    key: 'non_operating_income',
    label: '営業外収益',
    value: 0,
    editable: true,
    formula: '受取利息、配当金等'
  },
  
  // 営業外費用 (Non-operating Expenses)
  {
    key: 'non_operating_expenses',
    label: '営業外費用',
    value: 0,
    editable: true,
    formula: '支払利息、手数料等'
  },
  
  // 経常利益 (Ordinary Profit) - calculated
  {
    key: 'ordinary_profit',
    label: '経常利益',
    value: 0,
    editable: false,
    calculated: true,
    formula: '営業利益 + 営業外収益 - 営業外費用'
  },
  
  // 特別利益 (Extraordinary Income)
  {
    key: 'extraordinary_income',
    label: '特別利益',
    value: 0,
    editable: true,
    formula: '固定資産売却益等'
  },
  
  // 特別損失 (Extraordinary Loss)
  {
    key: 'extraordinary_loss',
    label: '特別損失',
    value: 0,
    editable: true,
    formula: '固定資産除却損等'
  },
  
  // 税引前利益 (Profit Before Tax) - calculated
  {
    key: 'profit_before_tax',
    label: '税引前利益',
    value: 0,
    editable: false,
    calculated: true,
    formula: '経常利益 + 特別利益 - 特別損失'
  },
  
  // 前年対比 (Year-on-year comparison)
  {
    key: 'year_on_year_comparison',
    label: '前年対比',
    value: 0,
    editable: false,
    calculated: true,
    formula: '(当期税引前利益 / 前期税引前利益) × 100'
  }
]

export function ProfitSheet() {
  return (
    <ExcelForm
      sheetName="profit"
      sheetTitle="①利益"
      cells={profitCells}
      dense
      showDescription={false}
    />
  )
}
