'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomInput } from '@/components/ui/customInput'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { userService } from '@/lib/services'

interface ProductData {
  product_name: string
  gross_profit_amount: number
  gross_profit_per_item: number
  quantity: number
  unit_price: number
  sales: number
  gross_profit_rate: number
}

interface CostDetailsData {
  // Product data (up to 20 products)
  products: ProductData[]
  
  // Summary data
  total_gross_profit: number
  total_gross_profit_per_item: number
  total_quantity: number
  average_customer_unit_price: number
  total_sales: number
  average_gross_profit_rate: number
  
  // Adjustment section
  target_gross_profit_rate: number
  monthly_customers: number
  customer_unit_price: number
  workforce: number
  deficiency_amount: number
  profit_per_person: number
  productivity_per_person: number
  
  // Plan difference
  workforce_profitability_per_person: number
  workforce_productivity_per_person: number
  
  // Gross profit amounts
  gross_profit_amount_1: number
  gross_profit_amount_2: number
  gross_profit_amount_3: number
  gross_profit_amount_4: number
  gross_profit_amount_5: number
}

export default function CostDetailsSheet() {
  const [data, setData] = useState<CostDetailsData>({
    // Pre-filled products from image
    products: [
      {
        product_name: '塗装工事',
        gross_profit_amount: 129500000,
        gross_profit_per_item: 370000,
        quantity: 350,
        unit_price: 1000000,
        sales: 350000000,
        gross_profit_rate: 37.0
      },
      {
        product_name: 'リフォーム工事',
        gross_profit_amount: 17400000,
        gross_profit_per_item: 120000,
        quantity: 145,
        unit_price: 340000,
        sales: 49300000,
        gross_profit_rate: 35.3
      },
      {
        product_name: '小工事',
        gross_profit_amount: 2509990,
        gross_profit_per_item: 21826,
        quantity: 115,
        unit_price: 50000,
        sales: 5750000,
        gross_profit_rate: 43.7
      },
      {
        product_name: '板金工事',
        gross_profit_amount: 21390000,
        gross_profit_per_item: 138000,
        quantity: 155,
        unit_price: 290000,
        sales: 44950000,
        gross_profit_rate: 47.6
      },
      // Empty rows
      ...Array(16).fill(null).map((_, i) => ({
        product_name: '〇〇',
        gross_profit_amount: 0,
        gross_profit_per_item: 0,
        quantity: 0,
        unit_price: 0,
        sales: 0,
        gross_profit_rate: 0
      })),
      {
        product_name: 'その他群',
        gross_profit_amount: 0,
        gross_profit_per_item: 0,
        quantity: 0,
        unit_price: 0,
        sales: 0,
        gross_profit_rate: 0
      }
    ],
    
    // Summary data from image
    total_gross_profit: 170799990,
    total_gross_profit_per_item: 129965,
    total_quantity: 765,
    average_customer_unit_price: 588235,
    total_sales: 450000000,
    average_gross_profit_rate: 40.9,
    
    // Adjustment section
    target_gross_profit_rate: 37.96,
    monthly_customers: 0,
    customer_unit_price: 0,
    workforce: 25,
    deficiency_amount: -10,
    profit_per_person: 0,
    productivity_per_person: 0,
    
    // Plan difference
    workforce_profitability_per_person: 0,
    workforce_productivity_per_person: 0,
    
    // Gross profit amounts
    gross_profit_amount_1: 170799990.0,
    gross_profit_amount_2: 0.0,
    gross_profit_amount_3: 0.0,
    gross_profit_amount_4: 6831999.6,
    gross_profit_amount_5: 18000000
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await userService.getUserInputs('cost-details')
      const inputMap: Partial<CostDetailsData> = {}
      ;(result || []).forEach((i: any) => {
        if (i.cellKey.startsWith('product_')) {
          // Handle product data
          const productIndex = parseInt(i.cellKey.split('_')[1])
          const field = i.cellKey.split('_')[2]
          if (!inputMap.products) inputMap.products = [...data.products]
          if (inputMap.products[productIndex]) {
            inputMap.products[productIndex] = {
              ...inputMap.products[productIndex],
              [field]: field === 'product_name' ? i.value : Number(i.value) || 0
            } as ProductData
          }
        } else {
          (inputMap as any)[i.cellKey] = Number(i.value) || 0
        }
      })
      setData(prev => ({ ...prev, ...inputMap }))
    } catch (error) {
      console.error('Failed to load cost details data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductChange = async (productIndex: number, field: keyof ProductData, value: number | string) => {
    const newProducts = [...data.products]
    newProducts[productIndex] = {
      ...newProducts[productIndex],
      [field]: field === 'product_name' ? value : Number(value)
    }
    
    // Recalculate derived fields
    if (field === 'unit_price' || field === 'quantity') {
      const unitPrice = field === 'unit_price' ? Number(value) : newProducts[productIndex].unit_price
      const quantity = field === 'quantity' ? Number(value) : newProducts[productIndex].quantity
      const grossProfitPerItem = newProducts[productIndex].gross_profit_per_item
      
      newProducts[productIndex].sales = unitPrice * quantity
      newProducts[productIndex].gross_profit_amount = grossProfitPerItem * quantity
      newProducts[productIndex].gross_profit_rate = newProducts[productIndex].sales > 0 
        ? (newProducts[productIndex].gross_profit_amount / newProducts[productIndex].sales) * 100 
        : 0
    } else if (field === 'gross_profit_per_item') {
      const quantity = newProducts[productIndex].quantity
      newProducts[productIndex].gross_profit_amount = Number(value) * quantity
      newProducts[productIndex].gross_profit_rate = newProducts[productIndex].sales > 0 
        ? (newProducts[productIndex].gross_profit_amount / newProducts[productIndex].sales) * 100 
        : 0
    }
    
    const newData = { ...data, products: newProducts }
    setData(newData)

    try {
      // Only save numeric values to the API
      if (field !== 'product_name') {
        await userService.saveUserInput({ sheet: 'cost-details', cell: `product_${productIndex}_${field}`, value: Number(value) })
      }
      
      // Trigger recalculation
      const inputs: Record<string, number> = {}
      Object.entries(newData).forEach(([k, v]) => {
        if (k !== 'products' && typeof v === 'number') {
          inputs[k] = v
        }
      })
      const result = await userService.calculate({ sheet: 'cost-details', inputs })
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleInputChange = async (key: keyof CostDetailsData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await userService.saveUserInput({ sheet: 'cost-details', cell: key, value })
      
      // Trigger recalculation
      const inputs: Record<string, number> = {}
      Object.entries(newData).forEach(([k, v]) => {
        if (k !== 'products' && typeof v === 'number') {
          inputs[k] = v
        }
      })
      const result = await userService.calculate({ sheet: 'cost-details', inputs })
      
      // Update with calculated values
      setData(prev => ({ ...prev, ...(result.results || {}) }))
    } catch (error) {
      console.error('Failed to save input:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises: Promise<any>[] = []
      
      // Save product data
      data.products.forEach((product, index) => {
        Object.entries(product).forEach(([field, value]) => {
          promises.push(userService.saveUserInput({ sheet: 'cost-details', cell: `product_${index}_${field}`, value }))
        })
      })
      
      // Save other data
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'products') {
          promises.push(userService.saveUserInput({ sheet: 'cost-details', cell: key, value }))
        }
      })
      
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
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">ひながた</span>
          <h1 className="text-lg font-semibold">⑦(PQ)原価の詳細</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 border border-yellow-300 px-3 py-1 text-sm font-medium">
            売上計 ¥{data.total_sales.toLocaleString()}
          </div>
          <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
            {saving ? '保存中...' : 'すべて保存'}
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-2">↓②~④に順番に記入</div>

      {/* Main Product Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32 text-xs">①商品名</TableHead>
                <TableHead className="w-32 text-xs">粗利益額</TableHead>
                <TableHead className="w-32 text-xs">④1個あたり粗利益</TableHead>
                <TableHead className="w-24 text-xs">③数量</TableHead>
                <TableHead className="w-32 text-xs">②単価</TableHead>
                <TableHead className="w-32 text-xs">売上</TableHead>
                <TableHead className="w-24 text-xs">粗利益率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2">
                    <Input
                      value={product.product_name}
                      onChange={(e) => handleProductChange(index, 'product_name', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.gross_profit_amount}
                      readOnly
                      className="h-8 text-xs bg-gray-50"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.gross_profit_per_item}
                      onChange={(e) => handleProductChange(index, 'gross_profit_per_item', Number(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.unit_price}
                      onChange={(e) => handleProductChange(index, 'unit_price', Number(e.target.value))}
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.sales}
                      readOnly
                      className="h-8 text-xs bg-gray-50"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      value={product.gross_profit_rate.toFixed(1)}
                      readOnly
                      className="h-8 text-xs bg-gray-50"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-600">
        ①業種、種別、商品名など商品群として並べたいものを任意で追記して良
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">実績</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2 text-xs">
            <div>
              <label className="font-medium">M(計)</label>
              <div className="text-gray-600">{data.total_gross_profit.toLocaleString()}</div>
            </div>
            <div>
              <label className="font-medium">M(個)</label>
              <div className="text-gray-600">{data.total_gross_profit_per_item.toLocaleString()}</div>
            </div>
            <div>
              <label className="font-medium">数量(Q)</label>
              <div className="text-gray-600">{data.total_quantity}</div>
            </div>
            <div>
              <label className="font-medium">平均客単価</label>
              <div className="text-gray-600">{data.average_customer_unit_price.toLocaleString()}</div>
            </div>
            <div>
              <label className="font-medium">売上計</label>
              <div className="text-gray-600">{data.total_sales.toLocaleString()}</div>
            </div>
            <div>
              <label className="font-medium">平均粗利</label>
              <div className="text-gray-600">{data.average_gross_profit_rate.toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Section */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">〇になるまで修正</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium">粗利益率(%)</label>
              <Input
                type="number"
                step="0.01"
                value={data.target_gross_profit_rate}
                onChange={(e) => handleInputChange('target_gross_profit_rate', Number(e.target.value))}
                className="mt-1 h-8 text-xs bg-yellow-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium">客数(月)</label>
              <Input
                type="number"
                value={data.monthly_customers}
                onChange={(e) => handleInputChange('monthly_customers', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">客単価(円)</label>
              <Input
                type="number"
                value={data.customer_unit_price}
                onChange={(e) => handleInputChange('customer_unit_price', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">戦力(人)</label>
              <Input
                type="number"
                value={data.workforce}
                onChange={(e) => handleInputChange('workforce', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
              <div className="text-xs text-gray-500">25名</div>
            </div>
            <div>
              <label className="text-xs font-medium">└→不足額</label>
              <Input
                type="number"
                value={data.deficiency_amount}
                readOnly
                className="mt-1 h-8 text-xs bg-yellow-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium">1人あたりの利益</label>
              <Input
                type="number"
                value={data.profit_per_person}
                onChange={(e) => handleInputChange('profit_per_person', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">1人あたり生産性</label>
              <Input
                type="number"
                value={data.productivity_per_person}
                onChange={(e) => handleInputChange('productivity_per_person', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Difference Section */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">計画との差</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">戦力(1人当たりの利益力)</label>
              <Input
                type="number"
                value={data.workforce_profitability_per_person}
                onChange={(e) => handleInputChange('workforce_profitability_per_person', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium">1人当たり生産性</label>
              <Input
                type="number"
                value={data.workforce_productivity_per_person}
                onChange={(e) => handleInputChange('workforce_productivity_per_person', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gross Profit Amounts */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">粗利益額</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            <div>
              <Input
                type="number"
                value={data.gross_profit_amount_1}
                onChange={(e) => handleInputChange('gross_profit_amount_1', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Input
                type="number"
                value={data.gross_profit_amount_2}
                onChange={(e) => handleInputChange('gross_profit_amount_2', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Input
                type="number"
                value={data.gross_profit_amount_3}
                onChange={(e) => handleInputChange('gross_profit_amount_3', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Input
                type="number"
                value={data.gross_profit_amount_4}
                onChange={(e) => handleInputChange('gross_profit_amount_4', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Input
                type="number"
                value={data.gross_profit_amount_5}
                onChange={(e) => handleInputChange('gross_profit_amount_5', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}