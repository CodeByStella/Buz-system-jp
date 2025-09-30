'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Save, Download } from 'lucide-react'
import { api } from '@/lib/api'

interface CellData {
  key: string
  label: string
  value: number
  editable: boolean
  calculated?: boolean
  formula?: string
}

interface SheetData {
  [key: string]: CellData
}

interface ExcelFormProps {
  sheetName: string
  sheetTitle: string
  cells: CellData[]
}

export function ExcelForm({ sheetName, sheetTitle, cells }: ExcelFormProps) {
  const [data, setData] = useState<SheetData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeData()
  }, [sheetName])

  const initializeData = async () => {
    try {
      // Load existing user inputs
      const result = await api.user.getInputs(sheetName)
      const existingData: SheetData = {}
      
      // Initialize with default values
      cells.forEach(cell => {
        existingData[cell.key] = {
          ...cell,
          value: 0
        }
      })

      // Override with saved values
      result.inputs.forEach((input: any) => {
        if (existingData[input.cellKey]) {
          existingData[input.cellKey].value = input.value
        }
      })

      setData(existingData)
    } catch (error) {
      console.error('Failed to load data:', error)
      // Initialize with default values
      const defaultData: SheetData = {}
      cells.forEach(cell => {
        defaultData[cell.key] = { ...cell, value: 0 }
      })
      setData(defaultData)
    } finally {
      setLoading(false)
    }
  }

  const handleCellChange = async (cellKey: string, value: number) => {
    const newData = { ...data }
    newData[cellKey].value = value
    setData(newData)

    // Auto-save after a short delay
    setTimeout(() => {
      saveCell(cellKey, value)
    }, 1000)
  }

  const saveCell = async (cellKey: string, value: number) => {
    try {
      await api.user.saveInput(sheetName, cellKey, value)
    } catch (error) {
      console.error('Failed to save cell:', error)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(data).map(([key, cell]) =>
        api.user.saveInput(sheetName, key, cell.value)
      )
      
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to save all:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCalculate = async () => {
    try {
      const inputs = Object.fromEntries(
        Object.entries(data).map(([key, cell]) => [key, cell.value])
      )

      const result = await api.calculate(sheetName, inputs)
      const newData = { ...data }
      
      // Update calculated values
      Object.entries(result.results).forEach(([key, value]) => {
        if (newData[key]) {
          newData[key].value = value as number
          newData[key].calculated = true
        }
      })
      
      setData(newData)
    } catch (error) {
      console.error('Failed to calculate:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{sheetTitle}</CardTitle>
          <CardDescription>データを読み込み中...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{sheetTitle}</CardTitle>
            <CardDescription>データを入力して計算を行います</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleCalculate} variant="outline">
              計算実行
            </Button>
            <Button onClick={handleSaveAll} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              PDF出力
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">項目</TableHead>
              <TableHead className="w-1/3">値</TableHead>
              <TableHead className="w-1/3">説明</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([key, cell]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">
                  {cell.label}
                  {cell.calculated && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      計算値
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {cell.editable ? (
                    <Input
                      type="number"
                      value={cell.value}
                      onChange={(e) => handleCellChange(key, parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  ) : (
                    <div className={`w-32 px-3 py-2 text-sm border rounded ${
                      cell.calculated ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {cell.value.toLocaleString()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {cell.formula || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
