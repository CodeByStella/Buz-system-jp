'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface MQFutureData {
  // PQ Results
  target_pq_sales: number
  pq_percentage: number
  
  // VQ Results  
  target_vq_variable_costs: number
  vq_percentage: number
  
  // M Results
  calculated_m: number
  m_percentage: number
  
  // F Results
  calculated_f: number
  f_percentage: number
  
  // G Results
  target_g_profit: number
  g_percentage: number
  
  // Difference
  difference: number
  
  // Target Values
  target_value_1: number
  target_value_2: number
  target_value_3: number
  target_value_4: number
  target_value_5: number
  
  // Unit Price and Quantity
  unit_price_p: number
  quantity_q: number
  unit_price_v: number
  quantity_v: number
  
  // Calculated values
  total_sales_calculated: number
}

export default function MQFutureSheet() {
  const [data, setData] = useState<MQFutureData>({
    // PQ Results
    target_pq_sales: 0,
    pq_percentage: 0,
    
    // VQ Results  
    target_vq_variable_costs: 0,
    vq_percentage: 0,
    
    // M Results
    calculated_m: 0,
    m_percentage: 0,
    
    // F Results
    calculated_f: 0,
    f_percentage: 0,
    
    // G Results
    target_g_profit: 0,
    g_percentage: 0,
    
    // Difference
    difference: 0,
    
    // Target Values
    target_value_1: 0,
    target_value_2: 0,
    target_value_3: 0,
    target_value_4: 0,
    target_value_5: 0,
    
    // Unit Price and Quantity
    unit_price_p: 0,
    quantity_q: 0,
    unit_price_v: 0,
    quantity_v: 0,
    
    // Calculated values
    total_sales_calculated: 0
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
            {/* PQ Results */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">PQ 結果 (売上)</label>
                <Input
                  type="number"
                  value={data.target_pq_sales}
                  onChange={(e) => handleInputChange('target_pq_sales', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
                <div className="text-xs text-gray-500 mt-1">{data.pq_percentage.toFixed(1)}%</div>
              </div>
              <div>
                <label className="text-xs font-medium">VQ 結果 (変動費)</label>
                <Input
                  type="number"
                  value={data.target_vq_variable_costs}
                  onChange={(e) => handleInputChange('target_vq_variable_costs', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
                <div className="text-xs text-gray-500 mt-1">{data.vq_percentage.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* M Results */}
            <div>
              <label className="text-xs font-medium">M 結果 (粗利)</label>
              <Input
                type="number"
                value={data.calculated_m}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
              <div className="text-xs text-gray-500 mt-1">{data.m_percentage.toFixed(1)}%</div>
            </div>
            
            {/* F Results */}
            <div>
              <label className="text-xs font-medium">F 結果 (固定費)</label>
              <Input
                type="number"
                value={data.calculated_f}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
              <div className="text-xs text-gray-500 mt-1">{data.f_percentage.toFixed(1)}%</div>
            </div>
            
            {/* G Results */}
            <div>
              <label className="text-xs font-medium">G 結果 (利益)</label>
              <Input
                type="number"
                value={data.target_g_profit}
                onChange={(e) => handleInputChange('target_g_profit', Number(e.target.value))}
                className="mt-1 h-8 text-xs"
              />
              <div className="text-xs text-gray-500 mt-1">{data.g_percentage.toFixed(1)}%</div>
            </div>
            
            {/* Difference */}
            <div>
              <label className="text-xs font-medium">差額</label>
              <Input
                type="number"
                value={data.difference}
                readOnly
                className="mt-1 h-8 text-xs bg-gray-50"
              />
              <div className="text-xs text-gray-500 mt-1">0になるまで⑦を修正</div>
            </div>
            
            {/* Target Values */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <label className="text-xs font-medium mb-2 block">目標値</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs">目標値①</label>
                  <Input
                    type="number"
                    value={data.target_value_1}
                    onChange={(e) => handleInputChange('target_value_1', Number(e.target.value))}
                    className="mt-1 h-6 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs">目標値②</label>
                  <Input
                    type="number"
                    value={data.target_value_2}
                    onChange={(e) => handleInputChange('target_value_2', Number(e.target.value))}
                    className="mt-1 h-6 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs">目標値③</label>
                  <Input
                    type="number"
                    value={data.target_value_3}
                    onChange={(e) => handleInputChange('target_value_3', Number(e.target.value))}
                    className="mt-1 h-6 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs">目標値④</label>
                  <Input
                    type="number"
                    value={data.target_value_4}
                    onChange={(e) => handleInputChange('target_value_4', Number(e.target.value))}
                    className="mt-1 h-6 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs">目標値⑤</label>
                  <Input
                    type="number"
                    value={data.target_value_5}
                    onChange={(e) => handleInputChange('target_value_5', Number(e.target.value))}
                    className="mt-1 h-6 text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Price per Item */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">1件当たりの客単価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Row P */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="text-xs font-medium">P</label>
                <Input
                  type="number"
                  value={data.unit_price_p}
                  onChange={(e) => handleInputChange('unit_price_p', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div className="text-center">
                <div className="text-lg">×</div>
              </div>
              <div>
                <label className="text-xs font-medium">Q</label>
                <Input
                  type="number"
                  value={data.quantity_q}
                  onChange={(e) => handleInputChange('quantity_q', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
            
            {/* Row V */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="text-xs font-medium">V</label>
                <Input
                  type="number"
                  value={data.unit_price_v}
                  onChange={(e) => handleInputChange('unit_price_v', Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div className="text-center">
                <div className="text-lg">×</div>
              </div>
              <div>
                <label className="text-xs font-medium">Q</label>
                <Input
                  type="number"
                  value={data.quantity_v}
                  onChange={(e) => handleInputChange('quantity_v', Number(e.target.value))}
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
