'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface MQFutureData {
  target_g_profit: number
  target_f_fixed_costs: number
  target_m_gross_profit: number
  target_pq_sales: number
  target_vq_variable_costs: number
  calculated_m: number
  calculated_f: number
  calculated_p: number
  calculated_v: number
  unit_price_per_item: number
  quantity: number
  total_sales_calculated: number
  difference: number
}

export default function MQFutureSheet() {
  const [data, setData] = useState<MQFutureData>({
    target_g_profit: 0,
    target_f_fixed_costs: 0,
    target_m_gross_profit: 0,
    target_pq_sales: 0,
    target_vq_variable_costs: 0,
    calculated_m: 0,
    calculated_f: 0,
    calculated_p: 0,
    calculated_v: 0,
    unit_price_per_item: 0,
    quantity: 0,
    total_sales_calculated: 0,
    difference: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('mq-future')
      const inputMap: Partial<MQFutureData> = {}
      ;(result.inputs || []).forEach((i: any) => {
        inputMap[i.cellKey as keyof MQFutureData] = Number(i.value) || 0
      })
      setData(prev => ({ ...prev, ...inputMap }))
    } catch (error) {
      console.error('Failed to load MQ future data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof MQFutureData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('mq-future', key, value)
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await api.calculate('mq-future', inputs)
      
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
        api.user.saveInput('mq-future', key, value)
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
        <h1 className="text-lg font-semibold">MQ会計(未来)</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="h-8 px-3 text-xs">
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* MQ Accounting Results */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">MQ会計結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">PQ 結果 (売上)</label>
                <Input
                  type="number"
                  value={data.target_pq_sales}
                  onChange={(e) => handleInputChange('target_pq_sales', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">VQ 結果 (変動費)</label>
                <Input
                  type="number"
                  value={data.target_vq_variable_costs}
                  onChange={(e) => handleInputChange('target_vq_variable_costs', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium">M 結果 (粗利)</label>
              <Input
                type="number"
                value={data.calculated_m}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium">F 結果 (固定費)</label>
              <Input
                type="number"
                value={data.calculated_f}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium">G 結果 (利益)</label>
              <Input
                type="number"
                value={data.target_g_profit}
                onChange={(e) => handleInputChange('target_g_profit', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium">差額</label>
              <Input
                type="number"
                value={data.difference}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Unit Price per Item */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">1件当たりの客単価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">P (プライス)</label>
                <Input
                  type="number"
                  value={data.unit_price_per_item}
                  onChange={(e) => handleInputChange('unit_price_per_item', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Q (クォンティティー)</label>
                <Input
                  type="number"
                  value={data.quantity}
                  onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium">計算された売上 (P×Q)</label>
              <Input
                type="number"
                value={data.total_sales_calculated}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">計算ルール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs">
            <p>①まず初めにGの目標値を決めましょう。これは社長自身がいくらの利益を残したいのかを決定させる重要な課題です。</p>
            <p>②~⑤まで順番に現状から推移して115%~200%UPまで好きな数字を目標値に入れてください。</p>
            <div className="mt-4 space-y-1">
              <p><strong>数字が合うように計算しましょう：</strong></p>
              <p>• GはM-Fです。</p>
              <p>• FはM-Gです。</p>
              <p>• MはP-Vです。</p>
              <p>• VはP-Mです。</p>
              <p>• PはM+Vです。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memo Section */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">メモ</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-24 p-2 text-xs border border-gray-300 rounded-md"
            placeholder="メモを入力してください..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
