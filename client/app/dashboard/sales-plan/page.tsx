import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SalesPlanPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">部門別販売計画</h1>
          <p className="text-gray-600">部門別の販売計画管理</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>販売計画</CardTitle>
            <CardDescription>部門別の販売計画を管理します</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              このシートでは部門別の販売計画を管理します。
              データ入力機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
