import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManufacturingLaborPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">⑤製造原価(人)</h1>
          <p className="text-gray-600">製造における人件費の管理</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>製造人件費管理</CardTitle>
            <CardDescription>製造における人件費の管理と分析を行います</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              このシートでは製造における人件費の管理と分析を行います。
              データ入力機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
