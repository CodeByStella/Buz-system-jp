'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/customInput'
import { Button } from '@/components/ui/button'
import { authService, userService } from '@/lib/services'

interface BreakevenData {
  // Current Period (今期)
  current_sales: number
  current_variable_costs: number
  current_fixed_costs: number
  current_variable_cost_ratio: number
  current_breakeven_point: number
  
  // Next Period (来期)
  next_sales: number
  next_variable_costs: number
  next_fixed_costs: number
  next_variable_cost_ratio: number
  next_breakeven_point: number
}

export default function BreakevenSheet() {
  const [data, setData] = useState<BreakevenData>({
    // Current Period - Pre-filled with image values
    current_sales: 355000000,
    current_variable_costs: 234900000,
    current_fixed_costs: 103800000,
    current_variable_cost_ratio: 0.661690141,
    current_breakeven_point: 306819317,
    
    // Next Period - Pre-filled with image values
    next_sales: 450000000,
    next_variable_costs: 279200000,
    next_fixed_costs: 124900000,
    next_variable_cost_ratio: 0.620444444,
    next_breakeven_point: 329069087
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await userService.getUserInputs('breakeven')
      const inputMap: Partial<BreakevenData> = {}
      ;(result || []).forEach((i: any) => {
        inputMap[i.cellKey as keyof BreakevenData] = Number(i.value) || 0
      })
      setData(prev => ({ ...prev, ...inputMap }))
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
      await userService.saveUserInput({sheet:'breakeven', cellKey: key, value})
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await userService.calculate({sheet:'breakeven', inputs})
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(data).map(([key, value]) =>
        userService.saveUserInput({sheet:'breakeven', cellKey: key, value})
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  // Generate chart data points for visualization
  const generateChartData = (sales: number, variableCosts: number, fixedCosts: number, breakevenPoint: number) => {
    if (!sales || !variableCosts || !fixedCosts || !breakevenPoint) {
      return []
    }
    
    const maxValue = Math.max(sales, breakevenPoint * 1.2)
    const points = []
    
    // Generate points for sales line (y = x)
    for (let x = 0; x <= maxValue; x += maxValue / 20) {
      points.push({
        x: x,
        sales: x,
        totalCosts: fixedCosts + (variableCosts / sales) * x
      })
    }
    
    return points
  }

  const currentChartData = generateChartData(
    data.current_sales,
    data.current_variable_costs,
    data.current_fixed_costs,
    data.current_breakeven_point
  )

  const nextChartData = generateChartData(
    data.next_sales,
    data.next_variable_costs,
    data.next_fixed_costs,
    data.next_breakeven_point
  )

  if (loading) {
    return <div className="p-3 text-sm">読み込み中...</div>
  }

  return (
    <div className="p-3 space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">損益分岐点分析</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Period (今期) */}
        <div className="space-y-4">
        <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm">今期</CardTitle>
          </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                    step="0.000001"
                    value={data.current_variable_cost_ratio.toFixed(9)}
                readOnly
                    className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium">損益分岐点</label>
              <Input
                type="number"
                value={data.current_breakeven_point.toFixed(0)}
                readOnly
                    className="mt-1 h-8 text-xs bg-gray-50"
              />
                </div>
            </div>
          </CardContent>
        </Card>

          {/* Current Period Chart */}
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm">今期</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-gray-50 border">
                <svg className="w-full h-full" viewBox="0 0 400 250">
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map(x => (
                    <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={250} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {[0, 50, 100, 150, 200, 250].map(y => (
                    <line key={`h-${y}`} x1={0} y1={y} x2={400} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  
                  {/* Sales line (orange) */}
                  {currentChartData.length > 0 && (
                    <polyline
                      points={currentChartData.map(point => 
                        `${(point.x / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 400},${250 - (point.sales / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 250}`
                      ).join(' ')}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Total costs line (blue) */}
                  {currentChartData.length > 0 && (
                    <polyline
                      points={currentChartData.map(point => 
                        `${(point.x / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 400},${250 - (point.totalCosts / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 250}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Break-even point */}
                  {data.current_breakeven_point > 0 && (
                    <circle
                      cx={(data.current_breakeven_point / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 400}
                      cy={250 - (data.current_breakeven_point / Math.max(data.current_sales, data.current_breakeven_point * 1.2)) * 250}
                      r="4"
                      fill="#000"
                    />
                  )}
                  
                  {/* Labels */}
                  <text x="10" y="20" fontSize="10" fill="#666">¥0</text>
                  <text x="10" y="240" fontSize="10" fill="#666">¥{Math.max(data.current_sales, data.current_breakeven_point * 1.2).toLocaleString()}</text>
                  
                  {/* Legend */}
                  <rect x="10" y="10" width="8" height="2" fill="#3b82f6" />
                  <text x="20" y="18" fontSize="8" fill="#666">総費用</text>
                  <rect x="60" y="10" width="8" height="2" fill="#f97316" />
                  <text x="70" y="18" fontSize="8" fill="#666">売上高</text>
                  <circle cx="120" cy="11" r="2" fill="#000" />
                  <text x="125" y="18" fontSize="8" fill="#666">損益分岐点</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Period (来期) */}
        <div className="space-y-4">
        <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm">来期</CardTitle>
          </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                    step="0.000001"
                    value={data.next_variable_cost_ratio.toFixed(9)}
                readOnly
                    className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium">損益分岐点</label>
              <Input
                type="number"
                value={data.next_breakeven_point.toFixed(0)}
                readOnly
                    className="mt-1 h-8 text-xs bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Period Chart */}
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm">来期</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-gray-50 border">
                <svg className="w-full h-full" viewBox="0 0 400 250">
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map(x => (
                    <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={250} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {[0, 50, 100, 150, 200, 250].map(y => (
                    <line key={`h-${y}`} x1={0} y1={y} x2={400} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  
                  {/* Sales line (orange) */}
                  {nextChartData.length > 0 && (
                    <polyline
                      points={nextChartData.map(point => 
                        `${(point.x / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 400},${250 - (point.sales / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 250}`
                      ).join(' ')}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Total costs line (blue) */}
                  {nextChartData.length > 0 && (
                    <polyline
                      points={nextChartData.map(point => 
                        `${(point.x / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 400},${250 - (point.totalCosts / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 250}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Break-even point */}
                  {data.next_breakeven_point > 0 && (
                    <circle
                      cx={(data.next_breakeven_point / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 400}
                      cy={250 - (data.next_breakeven_point / Math.max(data.next_sales, data.next_breakeven_point * 1.2)) * 250}
                      r="4"
                      fill="#000"
                    />
                  )}
                  
                  {/* Labels */}
                  <text x="10" y="20" fontSize="10" fill="#666">¥0</text>
                  <text x="10" y="240" fontSize="10" fill="#666">¥{Math.max(data.next_sales, data.next_breakeven_point * 1.2).toLocaleString()}</text>
                  
                  {/* Legend */}
                  <rect x="10" y="10" width="8" height="2" fill="#3b82f6" />
                  <text x="20" y="18" fontSize="8" fill="#666">総費用</text>
                  <rect x="60" y="10" width="8" height="2" fill="#f97316" />
                  <text x="70" y="18" fontSize="8" fill="#666">売上高</text>
                  <circle cx="120" cy="11" r="2" fill="#000" />
                  <text x="125" y="18" fontSize="8" fill="#666">損益分岐点</text>
                </svg>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Summary Comparison */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">期間比較</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium mb-2">今期</h4>
              <div className="space-y-1 text-xs">
                <div>売上高: ¥{data.current_sales.toLocaleString()}</div>
                <div>変動費: ¥{data.current_variable_costs.toLocaleString()}</div>
                <div>固定費: ¥{data.current_fixed_costs.toLocaleString()}</div>
                <div>変動率: {(data.current_variable_cost_ratio * 100).toFixed(2)}%</div>
                <div className="font-medium">損益分岐点: ¥{data.current_breakeven_point.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-2">来期</h4>
              <div className="space-y-1 text-xs">
                <div>売上高: ¥{data.next_sales.toLocaleString()}</div>
                <div>変動費: ¥{data.next_variable_costs.toLocaleString()}</div>
                <div>固定費: ¥{data.next_fixed_costs.toLocaleString()}</div>
                <div>変動率: {(data.next_variable_cost_ratio * 100).toFixed(2)}%</div>
                <div className="font-medium">損益分岐点: ¥{data.next_breakeven_point.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <div className="text-xs">
              <div className="font-medium mb-1">損益分岐点の変化:</div>
              <div className="text-gray-600">
                来期の損益分岐点は今期より ¥{(data.next_breakeven_point - data.current_breakeven_point).toLocaleString()} 
                ({(data.next_breakeven_point / data.current_breakeven_point - 1) * 100 > 0 ? '+' : ''}
                {((data.next_breakeven_point / data.current_breakeven_point - 1) * 100).toFixed(1)}%) 
                {data.next_breakeven_point > data.current_breakeven_point ? '増加' : '減少'}しています。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}