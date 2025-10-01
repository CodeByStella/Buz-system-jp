'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface BreakevenData {
  // Current Period
  current_sales: number
  current_variable_costs: number
  current_fixed_costs: number
  current_variable_cost_ratio: number
  current_breakeven_point: number
  
  // Next Period
  next_sales: number
  next_variable_costs: number
  next_fixed_costs: number
  next_variable_cost_ratio: number
  next_breakeven_point: number
}

export default function BreakevenSheet() {
  const [data, setData] = useState<BreakevenData>({
    current_sales: 0,
    current_variable_costs: 0,
    current_fixed_costs: 0,
    current_variable_cost_ratio: 0,
    current_breakeven_point: 0,
    next_sales: 0,
    next_variable_costs: 0,
    next_fixed_costs: 0,
    next_variable_cost_ratio: 0,
    next_breakeven_point: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('breakeven')
      setData(result.data)
    } catch (error) {
      console.error('Failed to load breakeven data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof BreakevenData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('breakeven', key, value)
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await api.calculate('breakeven', inputs)
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...result.data }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(data).map(([key, value]) =>
        api.user.saveInput('breakeven', key, value)
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
        <h1 className="text-lg font-semibold">損益分岐点</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Current Period */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">今期</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-xs font-medium">売上高</label>
              <Input
                type="number"
                value={data.current_sales}
                onChange={(e) => handleInputChange('current_sales', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">変動費</label>
              <Input
                type="number"
                value={data.current_variable_costs}
                onChange={(e) => handleInputChange('current_variable_costs', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">固定費</label>
              <Input
                type="number"
                value={data.current_fixed_costs}
                onChange={(e) => handleInputChange('current_fixed_costs', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">変動率</label>
              <Input
                type="number"
                value={data.current_variable_cost_ratio.toFixed(6)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium">損益分岐点</label>
              <Input
                type="number"
                value={data.current_breakeven_point.toFixed(0)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Next Period */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">来期</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-xs font-medium">売上高</label>
              <Input
                type="number"
                value={data.next_sales}
                onChange={(e) => handleInputChange('next_sales', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">変動費</label>
              <Input
                type="number"
                value={data.next_variable_costs}
                onChange={(e) => handleInputChange('next_variable_costs', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">固定費</label>
              <Input
                type="number"
                value={data.next_fixed_costs}
                onChange={(e) => handleInputChange('next_fixed_costs', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">変動率</label>
              <Input
                type="number"
                value={data.next_variable_cost_ratio.toFixed(6)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium">損益分岐点</label>
              <Input
                type="number"
                value={data.next_breakeven_point.toFixed(0)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">比較分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-xs font-medium">損益分岐点の差</label>
              <Input
                type="number"
                value={(data.next_breakeven_point - data.current_breakeven_point).toFixed(0)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium">変動率の差</label>
              <Input
                type="number"
                value={(data.next_variable_cost_ratio - data.current_variable_cost_ratio).toFixed(6)}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">損益分岐点チャート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500 text-xs">チャート表示エリア（実装予定）</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}