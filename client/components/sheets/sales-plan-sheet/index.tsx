'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/customInput'
import { Button } from '@/components/ui/button'
import { userService } from '@/lib/services'

interface ProductCategory {
  id: string
  name: string
  salesTarget: number
  monthlyTargets: number[]
  monthlyActuals: number[]
  cumulativeTargets: number[]
  cumulativeActuals: number[]
}

interface SalesPlanData {
  grandTotalTarget: number
  categories: ProductCategory[]
  months: string[]
}

export default function SalesPlanSheet() {
  const MONTH_COL_MIN_WIDTH = 140
  const [data, setData] = useState<SalesPlanData>({
    grandTotalTarget: 450000000,
    months: ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
    categories: [
      {
        id: 'painting',
        name: '塗装工事',
        salesTarget: 350000,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      },
      {
        id: 'renovation',
        name: 'リフォーム工事',
        salesTarget: 49300,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      },
      {
        id: 'minor_work',
        name: '小工事',
        salesTarget: 5800,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      },
      {
        id: 'sheet_metal',
        name: '板金工事',
        salesTarget: 45000,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      },
      // 15 placeholder categories
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `placeholder_${i + 1}`,
        name: '〇〇',
        salesTarget: 0,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      })),
      {
        id: 'other',
        name: 'その他詳',
        salesTarget: 0,
        monthlyTargets: new Array(12).fill(0),
        monthlyActuals: new Array(12).fill(0),
        cumulativeTargets: new Array(12).fill(0),
        cumulativeActuals: new Array(12).fill(0)
      }
    ]
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await userService.getUserInputs('sales-plan')
      const inputMap: Partial<SalesPlanData> = {}
      ;(result || []).forEach((i: any) => {
        if (i.cellKey === 'grand_total_target') {
          inputMap.grandTotalTarget = Number(i.value) || 0
        } else if (i.cellKey.startsWith('category_')) {
          const parts = i.cellKey.split('_')
          const categoryId = parts[1]
          const field = parts[2]
          const monthIndex = parts[3] ? parseInt(parts[3]) : -1
          
          if (!inputMap.categories) {
            inputMap.categories = [...data.categories]
          }
          
          const categoryIndex = inputMap.categories.findIndex(c => c.id === categoryId)
          if (categoryIndex >= 0) {
            if (field === 'sales_target') {
              inputMap.categories[categoryIndex].salesTarget = Number(i.value) || 0
            } else if (field === 'monthly_target' && monthIndex >= 0) {
              inputMap.categories[categoryIndex].monthlyTargets[monthIndex] = Number(i.value) || 0
            } else if (field === 'monthly_actual' && monthIndex >= 0) {
              inputMap.categories[categoryIndex].monthlyActuals[monthIndex] = Number(i.value) || 0
            }
          }
        }
      })
      setData(prev => ({ ...prev, ...inputMap }))
    } catch (error) {
      console.error('Failed to load sales plan data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (categoryId: string, field: string, monthIndex: number | null, value: number) => {
    const newData = { ...data }
    const categoryIndex = newData.categories.findIndex(c => c.id === categoryId)
    
    if (categoryIndex >= 0) {
      if (field === 'sales_target') {
        newData.categories[categoryIndex].salesTarget = value
      } else if (field === 'monthly_target' && monthIndex !== null) {
        newData.categories[categoryIndex].monthlyTargets[monthIndex] = value
      } else if (field === 'monthly_actual' && monthIndex !== null) {
        newData.categories[categoryIndex].monthlyActuals[monthIndex] = value
      }
      
      // Recalculate cumulative values
      if (field === 'monthly_target' || field === 'monthly_actual') {
        let cumulative = 0
        for (let i = 0; i < 12; i++) {
          if (field === 'monthly_target') {
            cumulative += newData.categories[categoryIndex].monthlyTargets[i]
            newData.categories[categoryIndex].cumulativeTargets[i] = cumulative
          } else {
            cumulative += newData.categories[categoryIndex].monthlyActuals[i]
            newData.categories[categoryIndex].cumulativeActuals[i] = cumulative
          }
        }
      }
    }
    
    setData(newData)

    try {
      const cellKey = monthIndex !== null 
        ? `category_${categoryId}_${field}_${monthIndex}`
        : `category_${categoryId}_${field}`
      
      await userService.saveUserInput({ sheet: 'sales-plan', cellKey, value })
      
      // Trigger recalculation
      const inputs: Record<string, number> = {
        grand_total_target: newData.grandTotalTarget
      }
      
      newData.categories.forEach(category => {
        inputs[`category_${category.id}_sales_target`] = category.salesTarget
        category.monthlyTargets.forEach((value, index) => {
          inputs[`category_${category.id}_monthly_target_${index}`] = value
        })
        category.monthlyActuals.forEach((value, index) => {
          inputs[`category_${category.id}_monthly_actual_${index}`] = value
        })
      })

      const result = await userService.calculate({ sheet: 'sales-plan', inputs })
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = []
      
      // Save grand total
      promises.push(userService.saveUserInput({ sheet: 'sales-plan', cellKey: 'grand_total_target', value: data.grandTotalTarget }))
      
      // Save all category data
      data.categories.forEach(category => {
        promises.push(userService.saveUserInput({ sheet: 'sales-plan', cellKey: `category_${category.id}_sales_target`, value: category.salesTarget }))
        category.monthlyTargets.forEach((value, index) => {
          promises.push(userService.saveUserInput({ sheet: 'sales-plan', cellKey: `category_${category.id}_monthly_target_${index}`, value }))
        })
        category.monthlyActuals.forEach((value, index) => {
          promises.push(userService.saveUserInput({ sheet: 'sales-plan', cellKey: `category_${category.id}_monthly_actual_${index}`, value }))
        })
      })
      
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  const calculateGrandTotal = () => {
    return data.categories.reduce((sum, category) => sum + category.salesTarget, 0)
  }

  const calculateMonthlyTotal = (monthIndex: number, type: 'target' | 'actual') => {
    return data.categories.reduce((sum, category) => {
      return sum + (type === 'target' ? category.monthlyTargets[monthIndex] : category.monthlyActuals[monthIndex])
    }, 0)
  }

  const calculateCumulativeTotal = (monthIndex: number, type: 'target' | 'actual') => {
    let total = 0
    for (let i = 0; i <= monthIndex; i++) {
      total += calculateMonthlyTotal(i, type)
    }
    return total
  }

  if (loading) {
    return <div className="p-3 text-sm">読み込み中...</div>
  }

  return (
    <div className="h-full flex flex-col min-h-0 p-3 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">部門別販売計画</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      {/* Grand Total Target */}
      <div className="bg-blue-100 border border-blue-300 p-3">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">売上目標 (千円)</label>
          <Input
            type="number"
            value={data.grandTotalTarget}
            onChange={(e) => {
              const newData = { ...data, grandTotalTarget: Number(e.target.value) }
              setData(newData)
              handleInputChange('', 'grand_total_target', null, Number(e.target.value))
            }}
            className="h-8 text-sm w-32"
          />
          <div className="text-sm text-gray-600">
            合計: {calculateGrandTotal().toLocaleString()} 千円
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full min-w-[2000px] border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left w-32">商品名</th>
              <th className="border border-gray-300 p-2 text-center w-20">売上目標</th>
              {data.months.map((month, index) => (
                <th key={month} className="border border-gray-300 p-1 text-center" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                  <div className="font-medium">{month}</div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="text-xs">当月</div>
                    <div className="text-xs">累計</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category, categoryIndex) => (
              <React.Fragment key={category.id}>
                {/* Category Header Row */}
                <tr className={category.name === '〇〇' ? 'bg-gray-100' : 'bg-blue-50'}>
                  <td className="border border-gray-300 p-2 font-medium">
                    {category.name}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Input
                      type="number"
                      value={category.salesTarget}
                      onChange={(e) => handleInputChange(category.id, 'sales_target', null, Number(e.target.value))}
                      className="h-6 text-xs text-center w-full"
                    />
                  </td>
                  {data.months.map((_, monthIndex) => (
                    <td key={monthIndex} className="border border-gray-300 p-1" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-center text-xs text-gray-500">-</div>
                        <div className="text-center text-xs text-gray-500">-</div>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Target Row */}
                <tr className="bg-green-50">
                  <td className="border border-gray-300 p-2 pl-4 text-xs">目標</td>
                  <td className="border border-gray-300 p-2 text-center text-xs text-gray-500">-</td>
                  {data.months.map((_, monthIndex) => (
                    <td key={monthIndex} className="border border-gray-300 p-1" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                      <div className="grid grid-cols-2 gap-1">
                        <Input
                          type="number"
                          value={category.monthlyTargets[monthIndex]}
                          onChange={(e) => handleInputChange(category.id, 'monthly_target', monthIndex, Number(e.target.value))}
                          className="h-6 text-xs text-center w-full"
                        />
                        <div className="h-5 flex items-center justify-center text-xs bg-gray-100">
                          {category.cumulativeTargets[monthIndex].toLocaleString()}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Actual Row */}
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 p-2 pl-4 text-xs">実績</td>
                  <td className="border border-gray-300 p-2 text-center text-xs text-gray-500">-</td>
                  {data.months.map((_, monthIndex) => (
                    <td key={monthIndex} className="border border-gray-300 p-1" style={{ minWidth: MONTH_COL_MIN_WIDTH }}>
                      <div className="grid grid-cols-2 gap-1">
                        <Input
                          type="number"
                          value={category.monthlyActuals[monthIndex]}
                          onChange={(e) => handleInputChange(category.id, 'monthly_actual', monthIndex, Number(e.target.value))}
                          className="h-6 text-xs text-center w-full"
                        />
                        <div className="h-5 flex items-center justify-center text-xs bg-gray-100">
                          {category.cumulativeActuals[monthIndex].toLocaleString()}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
            
            {/* Grand Total Row */}
            <tr className="bg-yellow-100 font-medium">
              <td className="border border-gray-300 p-2">合計</td>
              <td className="border border-gray-300 p-2 text-center">
                {calculateGrandTotal().toLocaleString()}
              </td>
              {data.months.map((_, monthIndex) => (
                <td key={monthIndex} className="border border-gray-300 p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-5 flex items-center justify-center text-xs bg-yellow-200">
                      {calculateMonthlyTotal(monthIndex, 'target').toLocaleString()}
                    </div>
                    <div className="h-5 flex items-center justify-center text-xs bg-yellow-200">
                      {calculateCumulativeTotal(monthIndex, 'target').toLocaleString()}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div className="bg-gray-100 border border-gray-300 p-3 text-xs">
        <p>※各商品カテゴリの月次目標と実績を入力してください。累計は自動計算されます。</p>
        <p>※〇〇の行は追加の商品カテゴリ用のプレースホルダーです。</p>
      </div>
    </div>
  )
}
  
