import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfitPlanPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">利益計画表</h1>
          <p className="text-gray-600">利益計画の管理</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>利益計画</CardTitle>
            <CardDescription>利益計画の管理を行います</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              このシートでは利益計画の管理を行います。
              データ入力機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
