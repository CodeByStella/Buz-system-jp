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
  dense?: boolean
  showDescription?: boolean
  showGuide?: boolean
  guideContent?: React.ReactNode
}

export function ExcelForm({ sheetName, sheetTitle, cells, dense = false, showDescription = true, showGuide = false, guideContent }: ExcelFormProps) {
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

  const getCategory = (key: string) => {
    if (key.startsWith('labor')) return 'labor'
    if (key.startsWith('sgna')) return 'sgna'
    if (key.startsWith('cogs')) return 'cogs'
    if (key.startsWith('exp')) return 'expense'
    if (key.startsWith('nonop') || key.startsWith('extraordinary')) return 'other'
    if (key.startsWith('check')) return 'check'
    if (key.startsWith('sales') || key.startsWith('gross')) return 'summary'
    return 'default'
  }

  const getRowBgClass = (key: string) => {
    const cat = getCategory(key)
    switch (cat) {
      case 'labor': return 'bg-yellow-50'
      case 'sgna': return 'bg-blue-50'
      case 'cogs': return 'bg-gray-50'
      case 'expense': return 'bg-orange-50'
      case 'other': return 'bg-purple-50'
      case 'check': return 'bg-yellow-100'
      case 'summary': return 'bg-slate-100'
      default: return ''
    }
  }

  const handleExportExcel = async () => {
    const XLSX = await import('xlsx')
    const rows: any[][] = []
    rows.push(['項目', '値', ...(showDescription ? ['説明'] : [])])
    Object.entries(data).forEach(([key, cell]) => {
      const base = [cell.label, cell.value]
      if (showDescription) base.push(cell.formula || '')
      rows.push(base)
    })

    const ws = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Legend sheet for categories/colors
    const legend = [
      ['区分', '色'],
      ['人件費', '黄色'],
      ['販管費', '青'],
      ['製造原価', '灰'],
      ['経費', '橙'],
      ['営業外/特別', '紫'],
      ['チェック/サマリ', '黄/灰']
    ]
    const wsLegend = XLSX.utils.aoa_to_sheet(legend)
    XLSX.utils.book_append_sheet(wb, wsLegend, 'Legend')

    XLSX.writeFile(wb, `${sheetName}.xlsx`)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className={dense ? 'py-3' : undefined}>
          <CardTitle className={dense ? 'text-sm' : undefined}>{sheetTitle}</CardTitle>
          <CardDescription className={dense ? 'text-xs' : undefined}>データを読み込み中...</CardDescription>
        </CardHeader>
        <CardContent className={dense ? 'py-3' : undefined}>
          <div className={dense ? 'space-y-2' : 'space-y-4'}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className={dense ? 'h-6 bg-gray-200 animate-pulse rounded' : 'h-12 bg-gray-200 animate-pulse rounded'}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full min-h-0 flex flex-col">
      <CardHeader className={dense ? 'py-3' : undefined}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className={dense ? 'text-sm' : undefined}>{sheetTitle}</CardTitle>
            <CardDescription className={dense ? 'text-xs' : undefined}>データを入力して計算を行います</CardDescription>
          </div>
          <div className={dense ? 'flex space-x-1' : 'flex space-x-2'}>
            <Button onClick={handleCalculate} variant="outline" className={dense ? 'h-7 px-2 text-xs' : undefined}>
              計算実行
            </Button>
            <Button onClick={handleSaveAll} disabled={saving} className={dense ? 'h-7 px-2 text-xs' : undefined}>
              <Save className={dense ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} />
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button variant="outline" className={dense ? 'h-7 px-2 text-xs' : undefined}>
              <Download className={dense ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} />
              PDF出力
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className={dense ? 'h-7 px-2 text-xs' : undefined}>
              Excel出力
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={dense ? 'py-3 flex-1 min-h-0 overflow-hidden' : 'flex-1 min-h-0 overflow-hidden'}>
        {showGuide && (
          <div className={dense ? 'mb-2 text-[11px]' : 'mb-4 text-sm'}>
            {guideContent}
          </div>
        )}
        <div className={dense ? 'mb-2 flex flex-wrap gap-2 text-[11px]' : 'mb-4 flex flex-wrap gap-3 text-sm'}>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-slate-100 border border-slate-200"></span>サマリ</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-yellow-50 border border-yellow-200"></span>人件費</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-blue-50 border border-blue-200"></span>販管費</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-gray-50 border border-gray-200"></span>製造原価</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-orange-50 border border-orange-200"></span>経費</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-purple-50 border border-purple-200"></span>営業外/特別</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-yellow-100 border border-yellow-200"></span>チェック</span>
        </div>
        <div className="h-full min-h-0 overflow-auto pr-2 pb-10 scroll-pb-24">
          <Table className="pb-4">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow className={dense ? 'h-8' : undefined}>
                <TableHead className={dense ? 'w-1/2 text-xs py-1' : 'w-1/3'}>項目</TableHead>
                <TableHead className={dense ? 'w-1/2 text-xs py-1' : 'w-1/3'}>値</TableHead>
                {showDescription && (
                  <TableHead className={dense ? 'w-1/3 text-xs py-1' : 'w-1/3'}>説明</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(data).map(([key, cell]) => (
                <TableRow key={key} className={`${dense ? 'h-8' : ''} ${getRowBgClass(key)}`}>
                  <TableCell className={dense ? 'font-medium text-xs py-1' : 'font-medium'}>
                    {cell.label}
                    {cell.calculated && (
                      <span className={dense ? 'ml-1 text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded' : 'ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'}>
                        計算値
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={dense ? 'py-1' : undefined}>
                    {cell.editable ? (
                      <Input
                        type="number"
                        value={cell.value}
                        onChange={(e) => handleCellChange(key, parseFloat(e.target.value) || 0)}
                        className={dense ? 'h-7 w-24 px-2 text-xs' : 'w-32'}
                      />
                    ) : (
                      <div className={`${dense ? 'w-24 px-2 py-1 text-xs' : 'w-32 px-3 py-2 text-sm'} border rounded ${
                        cell.calculated ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        {cell.value.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  {showDescription && (
                    <TableCell className={dense ? 'text-[11px] text-gray-600 py-1' : 'text-sm text-gray-600'}>
                      {cell.formula || '-'}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-12" />
        </div>
      </CardContent>
    </Card>
  )
}
