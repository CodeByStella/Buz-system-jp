'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface ProgressData {
  // Period and Growth
  period_month: number
  target_sales_growth: number
  
  // Target Values (決算目標)
  target_direct_sales: number
  target_gross_profit: number
  target_gross_profit_rate: number
  target_cost_ratio: number
  target_business_expenses: number
  target_personnel_expenses: number
  target_other_expenses: number
  target_sales_promotion: number
  target_external_revenue: number
  target_external_expenses: number
  target_extraordinary_items: number
  target_profit: number
  target_tax: number
  target_retained_earnings: number
  
  // Actual Values (実績)
  actual_direct_sales: number
  actual_gross_profit: number
  actual_gross_profit_rate: number
  actual_cost_ratio: number
  actual_business_expenses: number
  actual_personnel_expenses: number
  actual_other_expenses: number
  actual_sales_promotion: number
  actual_external_revenue: number
  actual_external_expenses: number
  actual_extraordinary_items: number
  actual_profit: number
  actual_tax: number
  actual_retained_earnings: number
  
  // Calculated Fields
  sales_achievement_rate: number
  profit_achievement_rate: number
  variance_direct_sales: number
  variance_gross_profit: number
  variance_profit: number
}

export default function ProgressSheet() {
  const [data, setData] = useState<ProgressData>({
    // Period and Growth
    period_month: 4,
    target_sales_growth: 126.8,
    
    // Target Values (決算目標) - Pre-filled with sample data
    target_direct_sales: 355000,
    target_gross_profit: 120100,
    target_gross_profit_rate: 33.8,
    target_cost_ratio: 66.2,
    target_business_expenses: 4000,
    target_personnel_expenses: 65200,
    target_other_expenses: 49700,
    target_sales_promotion: 6000,
    target_external_revenue: 45900,
    target_external_expenses: 10000,
    target_extraordinary_items: 0,
    target_profit: 55900,
    target_tax: 10000,
    target_retained_earnings: 0,
    
    // Actual Values (実績) - Initially empty for user input
    actual_direct_sales: 0,
    actual_gross_profit: 0,
    actual_gross_profit_rate: 0,
    actual_cost_ratio: 0,
    actual_business_expenses: 0,
    actual_personnel_expenses: 0,
    actual_other_expenses: 0,
    actual_sales_promotion: 0,
    actual_external_revenue: 0,
    actual_external_expenses: 0,
    actual_extraordinary_items: 0,
    actual_profit: 0,
    actual_tax: 0,
    actual_retained_earnings: 0,
    
    // Calculated Fields
    sales_achievement_rate: 0,
    profit_achievement_rate: 0,
    variance_direct_sales: 0,
    variance_gross_profit: 0,
    variance_profit: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('progress')
      const inputMap: Partial<ProgressData> = {}
      ;(result.inputs || []).forEach((i: any) => {
        inputMap[i.cellKey as keyof ProgressData] = Number(i.value) || 0
      })
      setData(prev => ({ ...prev, ...inputMap }))
    } catch (error) {
      console.error('Failed to load progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof ProgressData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('progress', key, value)
      const inputs = Object.fromEntries(Object.entries(newData).map(([k, v]) => [k, v]))
      const result = await api.calculate('progress', inputs)
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(data).map(([key, value]) =>
        api.user.saveInput('progress', key, value)
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-3 text-sm">読み込み中...</div>
  }

  return (
    <div className="p-3 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">進捗実績値入力シート</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      {/* Period and Growth Info */}
      <div className="bg-yellow-100 border border-yellow-300 p-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">開始期間何ヶ月</label>
            <Input
              type="number"
              value={data.period_month}
              onChange={(e) => handleInputChange('period_month', Number(e.target.value))}
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-medium">目標売上成長率</label>
            <div className="mt-1 h-8 flex items-center text-sm font-medium">{data.target_sales_growth}%</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Target Section */}
        <Card>
          <CardHeader className="py-2 bg-yellow-50">
            <CardTitle className="text-sm">決算目標</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 py-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">直売上 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_direct_sales} 
                  onChange={(e) => handleInputChange('target_direct_sales', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">売上総利益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_gross_profit} 
                  onChange={(e) => handleInputChange('target_gross_profit', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">売上総利益率 (%)</label>
                <Input 
                  type="number" 
                  value={data.target_gross_profit_rate} 
                  onChange={(e) => handleInputChange('target_gross_profit_rate', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">原価率 (%)</label>
                <Input 
                  type="number" 
                  value={data.target_cost_ratio} 
                  onChange={(e) => handleInputChange('target_cost_ratio', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">事業費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_business_expenses} 
                  onChange={(e) => handleInputChange('target_business_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">人件費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_personnel_expenses} 
                  onChange={(e) => handleInputChange('target_personnel_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">経費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_other_expenses} 
                  onChange={(e) => handleInputChange('target_other_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">販売促進費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_sales_promotion} 
                  onChange={(e) => handleInputChange('target_sales_promotion', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">営業外収益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_external_revenue} 
                  onChange={(e) => handleInputChange('target_external_revenue', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">営業外費用 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_external_expenses} 
                  onChange={(e) => handleInputChange('target_external_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">特別損益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_extraordinary_items} 
                  onChange={(e) => handleInputChange('target_extraordinary_items', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">利益目標 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_profit} 
                  onChange={(e) => handleInputChange('target_profit', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">税金 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_tax} 
                  onChange={(e) => handleInputChange('target_tax', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">利益剰余金 (千円)</label>
                <Input 
                  type="number" 
                  value={data.target_retained_earnings} 
                  onChange={(e) => handleInputChange('target_retained_earnings', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actual Performance Section */}
        <Card>
          <CardHeader className="py-2 bg-orange-50">
            <CardTitle className="text-sm">実績 (京銀)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 py-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">直売上 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_direct_sales} 
                  onChange={(e) => handleInputChange('actual_direct_sales', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">売上総利益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_gross_profit} 
                  onChange={(e) => handleInputChange('actual_gross_profit', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">売上総利益率 (%)</label>
                <Input 
                  type="number" 
                  value={data.actual_gross_profit_rate} 
                  readOnly 
                  className="h-7 text-xs mt-1 bg-gray-50" 
                />
              </div>
              <div>
                <label className="text-xs">原価率 (%)</label>
                <Input 
                  type="number" 
                  value={data.actual_cost_ratio} 
                  readOnly 
                  className="h-7 text-xs mt-1 bg-gray-50" 
                />
              </div>
              <div>
                <label className="text-xs">事業費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_business_expenses} 
                  onChange={(e) => handleInputChange('actual_business_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">人件費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_personnel_expenses} 
                  onChange={(e) => handleInputChange('actual_personnel_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">経費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_other_expenses} 
                  onChange={(e) => handleInputChange('actual_other_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">販売促進費 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_sales_promotion} 
                  onChange={(e) => handleInputChange('actual_sales_promotion', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">営業外収益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_external_revenue} 
                  onChange={(e) => handleInputChange('actual_external_revenue', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">営業外費用 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_external_expenses} 
                  onChange={(e) => handleInputChange('actual_external_expenses', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">特別損益 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_extraordinary_items} 
                  onChange={(e) => handleInputChange('actual_extraordinary_items', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">利益実績 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_profit} 
                  onChange={(e) => handleInputChange('actual_profit', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">税金 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_tax} 
                  onChange={(e) => handleInputChange('actual_tax', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-xs">利益剰余金 (千円)</label>
                <Input 
                  type="number" 
                  value={data.actual_retained_earnings} 
                  onChange={(e) => handleInputChange('actual_retained_earnings', Number(e.target.value))} 
                  className="h-7 text-xs mt-1" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Analysis */}
      <Card>
        <CardHeader className="py-2 bg-blue-50">
          <CardTitle className="text-sm">達成率分析</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs">売上達成率 (%)</label>
              <div className="h-7 flex items-center text-sm font-medium text-blue-600">
                {data.sales_achievement_rate.toFixed(1)}%
              </div>
            </div>
            <div>
              <label className="text-xs">利益達成率 (%)</label>
              <div className="h-7 flex items-center text-sm font-medium text-green-600">
                {data.profit_achievement_rate.toFixed(1)}%
              </div>
            </div>
            <div>
              <label className="text-xs">売上差異 (千円)</label>
              <div className={`h-7 flex items-center text-sm font-medium ${data.variance_direct_sales >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.variance_direct_sales >= 0 ? '+' : ''}{data.variance_direct_sales.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-xs">利益差異 (千円)</label>
              <div className={`h-7 flex items-center text-sm font-medium ${data.variance_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.variance_profit >= 0 ? '+' : ''}{data.variance_profit.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="bg-red-600 text-white p-3 text-xs">
        <p>※この数字は原価を一旦集計し、粗利率を計算して1を引けば原価率として表示されます。全ての月が終わったタイミングでこちらへ集計する必要があります。</p>
      </div>
    </div>
  )
}