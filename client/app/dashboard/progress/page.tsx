import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">進捗実績値入力シート</h1>
          <p className="text-gray-600">進捗と実績値の管理</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>進捗管理</CardTitle>
            <CardDescription>進捗と実績値の管理を行います</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              このシートでは進捗と実績値の管理を行います。
              データ入力機能は今後実装予定です。
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
