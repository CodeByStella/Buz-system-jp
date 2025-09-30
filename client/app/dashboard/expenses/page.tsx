import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">④経費</h1>
          <p className="text-gray-600">経費管理と分析</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>経費管理</CardTitle>
            <CardDescription>各種経費の管理と分析を行います</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              このシートでは経費の管理と分析を行います。
              データ入力機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
