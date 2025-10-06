'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { adminService } from '@/lib/services'

interface GlobalParameter {
  id: string
  key: string
  value: number
  description?: string
}

export function ParametersTable() {
  const [parameters, setParameters] = useState<GlobalParameter[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, { value: number; description: string }>>({})

  useEffect(() => {
    fetchParameters()
  }, [])

  const fetchParameters = async () => {
    try {
      const data = await adminService.getParameters()
      setParameters(data)
    } catch (error) {
      console.error('Failed to fetch parameters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (param: GlobalParameter) => {
    setEditing(param.id)
    setEditValues({
      [param.id]: {
        value: param.value,
        description: param.description || ''
      }
    })
  }

  const handleSave = async (param: GlobalParameter) => {
    try {
      const editValue = editValues[param.id]
      const data = await adminService.updateParameter(
        {key: param.key,
        value: editValue.value,
        description: editValue.description}
      )
      setParameters(parameters.map(p => p.id === param.id ? data : p))
      setEditing(null)
    } catch (error) {
      console.error('Failed to save parameter:', error)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setEditValues({})
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>グローバルパラメータ</CardTitle>
          <CardDescription>システム全体で使用されるパラメータを管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        <CardTitle>グローバルパラメータ</CardTitle>
        <CardDescription>システム全体で使用されるパラメータを管理します</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>キー</TableHead>
              <TableHead>値</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.id}>
                <TableCell className="font-medium">{param.key}</TableCell>
                <TableCell>
                  {editing === param.id ? (
                    <Input
                      type="number"
                      value={editValues[param.id]?.value || param.value}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        [param.id]: {
                          ...editValues[param.id],
                          value: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-24"
                    />
                  ) : (
                    param.value
                  )}
                </TableCell>
                <TableCell>
                  {editing === param.id ? (
                    <Input
                      value={editValues[param.id]?.description || param.description || ''}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        [param.id]: {
                          ...editValues[param.id],
                          description: e.target.value
                        }
                      })}
                      className="w-48"
                    />
                  ) : (
                    param.description || '-'
                  )}
                </TableCell>
                <TableCell>
                  {editing === param.id ? (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSave(param)}>
                        保存
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        キャンセル
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(param)}>
                      編集
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
