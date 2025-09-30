import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">スタート</h1>
          <p className="text-gray-600">ビジネスシステムへようこそ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>システム概要</CardTitle>
              <CardDescription>このシステムの使い方</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                左側のメニューから各シートにアクセスして、データを入力・管理できます。
                管理者はグローバルパラメータの設定も可能です。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>主要機能</CardTitle>
              <CardDescription>利用可能な機能</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• データ入力と自動計算</li>
                <li>• 損益分岐点分析</li>
                <li>• 利益計画</li>
                <li>• PDF出力</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>注意事項</CardTitle>
              <CardDescription>使用時の注意点</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                データは自動保存されますが、重要な変更後は手動で保存ボタンを押すことをお勧めします。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
