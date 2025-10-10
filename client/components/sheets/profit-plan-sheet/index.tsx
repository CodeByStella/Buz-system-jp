'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CustomInput } from '@/components/ui/customInput'
import { Button } from '@/components/ui/button'
import { userService } from '@/lib/services'

interface ProfitPlanInputs {
  base_sales: number
  base_variable_costs: number
  base_fixed_costs: number
}

interface ScenarioRow {
  label: string
  gp_rate: number
  sales: number
  variable_costs: number
  gross_profit: number
  fixed_costs: number
  operating_profit: number
  profit_rate: number
}

export default function ProfitPlanSheet() {
  const [data, setData] = useState<ProfitPlanInputs>({
    base_sales: 450_000_000,
    base_variable_costs: 279_200_000,
    base_fixed_costs: 124_900_000,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('profit-plan')
      const inputMap: Partial<ProfitPlanInputs> = {}
      ;(result.inputs || []).forEach((i: any) => {
        if (i.cellKey === 'base_sales') inputMap.base_sales = Number(i.value) || 0
        if (i.cellKey === 'base_variable_costs') inputMap.base_variable_costs = Number(i.value) || 0
        if (i.cellKey === 'base_fixed_costs') inputMap.base_fixed_costs = Number(i.value) || 0
      })
      setData((prev) => ({ ...prev, ...inputMap }))
    } catch (e) {
      console.error('Failed to load profit plan inputs', e)
    } finally {
      setLoading(false)
    }
  }

  const baseGpRate = useMemo(() => {
    return data.base_sales > 0
      ? (data.base_sales - data.base_variable_costs) / data.base_sales
      : 0
  }, [data.base_sales, data.base_variable_costs])

  const makeScenario = (label: string, gpRate: number): ScenarioRow => {
    const sales = data.base_sales
    const variable_costs = Math.max(0, Math.round(sales * (1 - gpRate)))
    const gross_profit = sales - variable_costs
    const fixed_costs = data.base_fixed_costs
    const operating_profit = gross_profit - fixed_costs
    const profit_rate = sales > 0 ? operating_profit / sales : 0
    return {
      label,
      gp_rate: gpRate,
      sales,
      variable_costs,
      gross_profit,
      fixed_costs,
      operating_profit,
      profit_rate,
    }
  }

  const upScenarios: ScenarioRow[] = useMemo(() => {
    const list: ScenarioRow[] = []
    const basePct = Math.round(baseGpRate * 1000) / 10 // one decimal
    list.push(makeScenario('現状', basePct / 100))
    for (let i = 1; i <= 10; i++) {
      list.push(makeScenario(`粗利${i}%UP`, (basePct + i) / 100))
    }
    return list
  }, [baseGpRate, data])

  const downScenarios: ScenarioRow[] = useMemo(() => {
    const list: ScenarioRow[] = []
    const basePct = Math.round(baseGpRate * 1000) / 10
    for (let i = 1; i <= 10; i++) {
      list.push(makeScenario(`粗利${i}%DOWN`, (basePct - i) / 100))
    }
    return list
  }, [baseGpRate, data])

  const handleChange = async (key: keyof ProfitPlanInputs, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)
    try {
      await userService.saveUserInput({ sheet: 'profit-plan', cell: key, value })
    } catch (e) {
      console.error('Failed to save input', e)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await Promise.all([
        userService.saveUserInput('profit-plan', 'base_sales', data.base_sales),
        userService.saveUserInput('profit-plan', 'base_variable_costs', data.base_variable_costs),
        userService.saveUserInput('profit-plan', 'base_fixed_costs', data.base_fixed_costs),
      ])
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-3 text-sm">読み込み中...</div>
  }

  const MONTH_COL_MIN_WIDTH = 140

  const renderScenarioHeader = (row: ScenarioRow) => (
    <div className="space-y-1">
      <div className="text-xs text-gray-600">粗利率</div>
      <div className="text-sm font-medium">{(row.gp_rate * 100).toFixed(1)}%</div>
    </div>
  )

  const renderScenarioColumn = (row: ScenarioRow) => (
    <td className="border border-gray-300 p-2 align-top" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
      {renderScenarioHeader(row)}
      <div className="mt-2 space-y-2 text-xs">
        <div className="flex justify-between"><span>売上</span><span>{row.sales.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>変動費</span><span>{row.variable_costs.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>粗利</span><span>{row.gross_profit.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>固定費</span><span>{row.fixed_costs.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>営業利益</span><span>{row.operating_profit.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>益率</span><span>{(row.profit_rate * 100).toFixed(1)}%</span></div>
      </div>
    </td>
  )

  return (
    <div className="h-full flex flex-col min-h-0 p-3 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">利益計画表</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-yellow-50 border border-yellow-200 p-3">
        <div>
          <label className="text-xs">売上</label>
          <Input type="number" value={data.base_sales} onChange={(e) => handleChange('base_sales', Number(e.target.value))} className="h-8 text-xs mt-1" />
        </div>
        <div>
          <label className="text-xs">変動費</label>
          <Input type="number" value={data.base_variable_costs} onChange={(e) => handleChange('base_variable_costs', Number(e.target.value))} className="h-8 text-xs mt-1" />
        </div>
        <div>
          <label className="text-xs">固定費</label>
          <Input type="number" value={data.base_fixed_costs} onChange={(e) => handleChange('base_fixed_costs', Number(e.target.value))} className="h-8 text-xs mt-1" />
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full min-w-[1600px] border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left w-32">シナリオ</th>
              {upScenarios.map((s) => (
                <th key={s.label} className="border border-gray-300 p-2 text-center" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-gray-600">{(s.gp_rate * 100).toFixed(1)}%</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 align-top">粗利率UP</td>
              {upScenarios.map((s) => (
                <React.Fragment key={s.label}>{renderScenarioColumn(s)}</React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="h-3" />

        <table className="w-full min-w-[1600px] border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left w-32">シナリオ</th>
              {downScenarios.map((s) => (
                <th key={s.label} className="border border-gray-300 p-2 text-center" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-gray-600">{(s.gp_rate * 100).toFixed(1)}%</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 align-top">粗利率DOWN</td>
              {downScenarios.map((s) => (
                <React.Fragment key={s.label}>{renderScenarioColumn(s)}</React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-red-600 text-white p-3 text-xs">
        <p>粗利が増えれば純利益が増えます。粗利率の変動をシミュレーションできます。</p>
      </div>
    </div>
  )
}


