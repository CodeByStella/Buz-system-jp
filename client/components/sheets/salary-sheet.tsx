'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface SalaryData {
  // Employee salaries
  employee_salary_total: number
  employee_count: number
  employee_1_unit_price: number
  employee_1_count: number
  employee_1_total: number
  employee_2_unit_price: number
  employee_2_count: number
  employee_2_total: number
  employee_3_unit_price: number
  employee_3_count: number
  employee_3_total: number
  employee_4_unit_price: number
  employee_4_count: number
  employee_4_total: number
  employee_5_unit_price: number
  employee_5_count: number
  employee_5_total: number
  employee_6_unit_price: number
  employee_6_count: number
  employee_6_total: number
  employee_7_unit_price: number
  employee_7_count: number
  employee_7_total: number
  employee_8_unit_price: number
  employee_8_count: number
  employee_8_total: number
  
  // Miscellaneous salaries
  misc_salary_total: number
  misc_count: number
  part_1_unit_price: number
  part_1_count: number
  part_1_total: number
  part_2_unit_price: number
  part_2_count: number
  part_2_total: number
  part_3_unit_price: number
  part_3_count: number
  part_3_total: number
  part_4_unit_price: number
  part_4_count: number
  part_4_total: number
  part_5_unit_price: number
  part_5_count: number
  part_5_total: number
  
  // Dispatched employees
  dispatched_total: number
  dispatched_count: number
  dispatched_1_unit_price: number
  dispatched_1_count: number
  dispatched_1_total: number
  dispatched_2_unit_price: number
  dispatched_2_count: number
  dispatched_2_total: number
  dispatched_3_unit_price: number
  dispatched_3_count: number
  dispatched_3_total: number
  dispatched_4_unit_price: number
  dispatched_4_count: number
  dispatched_4_total: number
  dispatched_5_unit_price: number
  dispatched_5_count: number
  dispatched_5_total: number
  dispatched_6_unit_price: number
  dispatched_6_count: number
  dispatched_6_total: number
  
  // Totals
  total_personnel_costs: number
  total_personnel_count: number
  
  // Average income
  future_avg_income: number
  current_avg_income: number
  income_increase_rate: number
}

export default function SalarySheet() {
  const [data, setData] = useState<SalaryData>({
    employee_salary_total: 0,
    employee_count: 0,
    employee_1_unit_price: 0, employee_1_count: 0, employee_1_total: 0,
    employee_2_unit_price: 0, employee_2_count: 0, employee_2_total: 0,
    employee_3_unit_price: 0, employee_3_count: 0, employee_3_total: 0,
    employee_4_unit_price: 0, employee_4_count: 0, employee_4_total: 0,
    employee_5_unit_price: 0, employee_5_count: 0, employee_5_total: 0,
    employee_6_unit_price: 0, employee_6_count: 0, employee_6_total: 0,
    employee_7_unit_price: 0, employee_7_count: 0, employee_7_total: 0,
    employee_8_unit_price: 0, employee_8_count: 0, employee_8_total: 0,
    misc_salary_total: 0,
    misc_count: 0,
    part_1_unit_price: 0, part_1_count: 0, part_1_total: 0,
    part_2_unit_price: 0, part_2_count: 0, part_2_total: 0,
    part_3_unit_price: 0, part_3_count: 0, part_3_total: 0,
    part_4_unit_price: 0, part_4_count: 0, part_4_total: 0,
    part_5_unit_price: 0, part_5_count: 0, part_5_total: 0,
    dispatched_total: 0,
    dispatched_count: 0,
    dispatched_1_unit_price: 0, dispatched_1_count: 0, dispatched_1_total: 0,
    dispatched_2_unit_price: 0, dispatched_2_count: 0, dispatched_2_total: 0,
    dispatched_3_unit_price: 0, dispatched_3_count: 0, dispatched_3_total: 0,
    dispatched_4_unit_price: 0, dispatched_4_count: 0, dispatched_4_total: 0,
    dispatched_5_unit_price: 0, dispatched_5_count: 0, dispatched_5_total: 0,
    dispatched_6_unit_price: 0, dispatched_6_count: 0, dispatched_6_total: 0,
    total_personnel_costs: 0,
    total_personnel_count: 0,
    future_avg_income: 0,
    current_avg_income: 0,
    income_increase_rate: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      const result = await api.user.getInputs('salary')
      setData(result.data)
    } catch (error) {
      console.error('Failed to load salary data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (key: keyof SalaryData, value: number) => {
    const newData = { ...data, [key]: value }
    setData(newData)

    try {
      await api.user.saveInput('salary', key, value)
      
      // Trigger recalculation
      const inputs = Object.fromEntries(
        Object.entries(newData).map(([k, v]) => [k, v])
      )
      const result = await api.calculate('salary', inputs)
      
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
        api.user.saveInput('salary', key, value)
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
        <h1 className="text-2xl font-bold">③ (F) 人件費を入力する</h1>
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      <div className="bg-red-100 border border-red-300 rounded-md p-4">
        <p className="text-red-800 font-medium">
          ここの数字は百万円単位で記入する事! 530万円(年収)の場合5.3と記入
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Salary Details */}
        <Card>
          <CardHeader>
            <CardTitle>人件費明細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium">社員{i} 単価</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data[`employee_${i}_unit_price` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`employee_${i}_unit_price` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">人数</label>
                  <Input
                    type="number"
                    value={data[`employee_${i}_count` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`employee_${i}_count` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">合計</label>
                  <Input
                    type="number"
                    value={data[`employee_${i}_total` as keyof SalaryData] as number}
                    readOnly
                    className="mt-1 text-sm bg-gray-50"
                  />
                </div>
              </div>
            ))}
            
            <div className="border-t pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">社員給料 計</label>
                  <div className="text-sm text-gray-600">人数: {data.employee_count}</div>
                  <div className="text-sm text-gray-600">合計: {data.employee_salary_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Miscellaneous Salary */}
        <Card>
          <CardHeader>
            <CardTitle>雑給料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium">パート{i} 単価</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data[`part_${i}_unit_price` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`part_${i}_unit_price` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">人数</label>
                  <Input
                    type="number"
                    value={data[`part_${i}_count` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`part_${i}_count` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">合計</label>
                  <Input
                    type="number"
                    value={data[`part_${i}_total` as keyof SalaryData] as number}
                    readOnly
                    className="mt-1 text-sm bg-gray-50"
                  />
                </div>
              </div>
            ))}
            
            <div className="border-t pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">雑給料 計</label>
                  <div className="text-sm text-gray-600">人数: {data.misc_count}</div>
                  <div className="text-sm text-gray-600">合計: {data.misc_salary_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispatched Employees */}
        <Card>
          <CardHeader>
            <CardTitle>派遣社員</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium">派遣{i} 単価</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data[`dispatched_${i}_unit_price` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`dispatched_${i}_unit_price` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">人数</label>
                  <Input
                    type="number"
                    value={data[`dispatched_${i}_count` as keyof SalaryData] as number}
                    onChange={(e) => handleInputChange(`dispatched_${i}_count` as keyof SalaryData, Number(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">合計</label>
                  <Input
                    type="number"
                    value={data[`dispatched_${i}_total` as keyof SalaryData] as number}
                    readOnly
                    className="mt-1 text-sm bg-gray-50"
                  />
                </div>
              </div>
            ))}
            
            <div className="border-t pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">派遣社員費 計</label>
                  <div className="text-sm text-gray-600">人数: {data.dispatched_count}</div>
                  <div className="text-sm text-gray-600">合計: {data.dispatched_total.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Average Annual Income */}
      <Card>
        <CardHeader>
          <CardTitle>平均年収</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">未来</label>
              <Input
                type="number"
                step="0.1"
                value={data.future_avg_income}
                onChange={(e) => handleInputChange('future_avg_income', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">現状</label>
              <Input
                type="number"
                step="0.1"
                value={data.current_avg_income}
                onChange={(e) => handleInputChange('current_avg_income', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">上昇率</label>
              <Input
                type="number"
                value={data.income_increase_rate.toFixed(1)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            現状の内部社員数を入力する 役員は含まない。
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            前期よりも2%~10%以上の昇給、増員の計画を入れる事。アバウトでも良い。この社長の採用と昇給の意思決定が有無で会社の未来は大きく変わります!上昇率が100%以上になる事が望ましい。
          </p>
        </div>
      </div>
    </div>
  )
}