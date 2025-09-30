'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface CostDetailsData {
  // Product details
  painting_unit_price: number
  painting_quantity: number
  painting_gross_profit_per_unit: number
  painting_sales: number
  painting_gross_profit: number
  painting_gross_profit_rate: number
  
  renovation_unit_price: number
  renovation_quantity: number
  renovation_gross_profit_per_unit: number
  renovation_sales: number
  renovation_gross_profit: number
  renovation_gross_profit_rate: number
  
  small_work_unit_price: number
  small_work_quantity: number
  small_work_gross_profit_per_unit: number
  small_work_sales: number
  small_work_gross_profit: number
  small_work_gross_profit_rate: number
  
  sheet_metal_unit_price: number
  sheet_metal_quantity: number
  sheet_metal_gross_profit_per_unit: number
  sheet_metal_sales: number
  sheet_metal_gross_profit: number
  sheet_metal_gross_profit_rate: number
  
  // Summary
  total_sales: number
  total_gross_profit: number
  total_quantity: number
  average_customer_unit_price: number
  average_gross_profit_rate: number
  workforce: number
  profit_per_person: number
  productivity_per_person: number
}

export default function CostDetailsSheet() {
  const [data, setData] = useState<CostDetailsData>({
    painting_unit_price: 0, painting_quantity: 0, painting_gross_profit_per_unit: 0,
    painting_sales: 0, painting_gross_profit: 0, painting_gross_profit_rate: 0,
    renovation_unit_price: 0, renovation_quantity: 0, renovation_gross_profit_per_unit: 0,
    renovation_sales: 0, renovation_gross_profit: 0, renovation_gross_profit_rate: 0,
    small_work_unit_price: 0, small_work_quantity: 0, small_work_gross_profit_per_unit: 0,
    small_work_sales: 0, small_work_gross_profit: 0, small_work_gross_profit_rate: 0,
    sheet_metal_unit_price: 0, sheet_metal_quantity: 0, sheet_metal_gross_profit_per_unit: 0,
    sheet_metal_sales: 0, sheet_metal_gross_profit: 0, sheet_metal_gross_profit_rate: 0,
    total_sales: 0, total_gross_profit: 0, total_quantity: 0,
    average_customer_unit_price: 0, average_gross_profit_rate: 0,
    workforce: 0, profit_per_person: 0, productivity_per_person: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('cost-details')
      setData(result.data)
    } catch (error) {
      console.error('Failed to load cost details data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof CostDetailsData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('cost-details', key, value)
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await api.calculate('cost-details', inputs)
      
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
        api.user.saveInput('cost-details', key, value)
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">読み込み中...</div>
  }

  const products = [
    { key: 'painting', name: '塗装工事' },
    { key: 'renovation', name: 'リフォーム工事' },
    { key: 'small_work', name: '小工事' },
    { key: 'sheet_metal', name: '板金工事' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">⑦ (PQ) 原価の詳</h1>
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 rounded-md p-4">
        <p className="text-yellow-800">
          ↓②~④に順番に記入
        </p>
        <p className="text-yellow-800 text-sm mt-1">
          ①業種、種別、商品名など商品群として並べたいものを任意で追記
        </p>
      </div>

      {/* Product Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>商品別詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">商品名</th>
                  <th className="text-left p-2">粗利益額</th>
                  <th className="text-left p-2">1個あたり粗利益</th>
                  <th className="text-left p-2">数量</th>
                  <th className="text-left p-2">単価</th>
                  <th className="text-left p-2">売上</th>
                  <th className="text-left p-2">粗利益率</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.key} className="border-b">
                    <td className="p-2">
                      <Input
                        type="text"
                        value={product.name}
                        className="border-0 p-0"
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={data[`${product.key}_gross_profit` as keyof CostDetailsData] as number}
                        readOnly
                        className="bg-gray-50"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={data[`${product.key}_gross_profit_per_unit` as keyof CostDetailsData] as number}
                        onChange={(e) => handleInputChange(`${product.key}_gross_profit_per_unit` as keyof CostDetailsData, Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={data[`${product.key}_quantity` as keyof CostDetailsData] as number}
                        onChange={(e) => handleInputChange(`${product.key}_quantity` as keyof CostDetailsData, Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={data[`${product.key}_unit_price` as keyof CostDetailsData] as number}
                        onChange={(e) => handleInputChange(`${product.key}_unit_price` as keyof CostDetailsData, Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={data[`${product.key}_sales` as keyof CostDetailsData] as number}
                        readOnly
                        className="bg-gray-50"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={(data[`${product.key}_gross_profit_rate` as keyof CostDetailsData] as number).toFixed(1)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>実績</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">M(計)</label>
                <Input
                  type="number"
                  value={data.total_gross_profit}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">数量(Q)</label>
                <Input
                  type="number"
                  value={data.total_quantity}
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">平均客単価</label>
              <Input
                type="number"
                value={data.average_customer_unit_price.toFixed(0)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">売上計</label>
              <Input
                type="number"
                value={data.total_sales}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">平均粗利</label>
              <Input
                type="number"
                value={data.average_gross_profit_rate.toFixed(1)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>○になるまで修正</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">粗利益率(%)</label>
              <Input
                type="number"
                value={data.average_gross_profit_rate.toFixed(2)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">戦力(人)</label>
              <Input
                type="number"
                value={data.workforce}
                onChange={(e) => handleInputChange('workforce', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">→不足額</label>
              <Input
                type="number"
                value="-10"
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit per Person */}
      <Card>
        <CardHeader>
          <CardTitle>粗利益額</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">1人あたりの利益</label>
              <Input
                type="number"
                value={data.profit_per_person.toFixed(0)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">1人あたりの生産性</label>
              <Input
                type="number"
                value={data.productivity_per_person.toFixed(0)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
