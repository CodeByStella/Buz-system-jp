'use client'

import { ExcelForm } from '@/components/user/excel-form'

const profitCells = [
  {
    key: 'sales_revenue',
    label: '売上高',
    value: 0,
    editable: true,
    formula: '基本売上データ'
  },
  {
    key: 'material_costs',
    label: '材料費',
    value: 0,
    editable: true,
    formula: '材料仕入価格 × 使用量'
  },
  {
    key: 'labor_costs',
    label: '人件費',
    value: 0,
    editable: true,
    formula: '時給 × 労働時間'
  },
  {
    key: 'overhead_costs',
    label: '間接費',
    value: 0,
    editable: true,
    formula: '固定費 + 変動費'
  },
  {
    key: 'total_costs',
    label: '総コスト',
    value: 0,
    editable: false,
    calculated: true,
    formula: '材料費 + 人件費 + 間接費'
  },
  {
    key: 'gross_profit',
    label: '粗利益',
    value: 0,
    editable: false,
    calculated: true,
    formula: '売上高 - 総コスト'
  },
  {
    key: 'profit_margin',
    label: '利益率 (%)',
    value: 0,
    editable: false,
    calculated: true,
    formula: '(粗利益 / 売上高) × 100'
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
