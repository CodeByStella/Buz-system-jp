'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface MQCurrentData {
  pq_sales: number
  vq_variable_costs: number
  p_price: number
  q_quantity: number
  calculated_sales: number
  m_gross_profit: number
  f_fixed_costs: number
  g_profit: number
}

export default function MQCurrentSheet() {
  const [data, setData] = useState<MQCurrentData>({
    pq_sales: 0,
    vq_variable_costs: 0,
    p_price: 0,
    q_quantity: 0,
    calculated_sales: 0,
    m_gross_profit: 0,
    f_fixed_costs: 0,
    g_profit: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('mq-current')
      setData(result.data)
    } catch (error) {
      console.error('Failed to load MQ current data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof MQCurrentData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('mq-current', key, value)
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await api.calculate('mq-current', inputs)
      
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
        api.user.saveInput('mq-current', key, value)
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">MQ会計(現状)</h1>
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MQ Accounting Results */}
        <Card>
          <CardHeader>
            <CardTitle>MQ会計結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">PQ 結果 (売上)</label>
                <Input
                  type="number"
                  value={data.pq_sales}
                  onChange={(e) => handleInputChange('pq_sales', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">VQ 結果 (変動費)</label>
                <Input
                  type="number"
                  value={data.vq_variable_costs}
                  onChange={(e) => handleInputChange('vq_variable_costs', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">M 結果 (粗利)</label>
              <Input
                type="number"
                value={data.m_gross_profit}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">F 結果 (固定費)</label>
              <Input
                type="number"
                value={data.f_fixed_costs}
                onChange={(e) => handleInputChange('f_fixed_costs', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">G 結果 (利益)</label>
              <Input
                type="number"
                value={data.g_profit}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Unit Price per Item */}
        <Card>
          <CardHeader>
            <CardTitle>1件当たりの客単価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">P (プライス)</label>
                <Input
                  type="number"
                  value={data.p_price}
                  onChange={(e) => handleInputChange('p_price', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Q (クォンティティー)</label>
                <Input
                  type="number"
                  value={data.q_quantity}
                  onChange={(e) => handleInputChange('q_quantity', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">計算された売上 (P×Q)</label>
              <Input
                type="number"
                value={data.calculated_sales}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                P×Qを入れるとここに売り上げが反映。上と同じ数字になるように①と②で調整しましょう。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memo Section */}
      <Card>
        <CardHeader>
          <CardTitle>メモ</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md"
            placeholder="メモを入力してください..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
