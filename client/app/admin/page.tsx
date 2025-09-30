import { ParametersTable } from '@/components/admin/parameters-table'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <p className="text-gray-600">システムの設定とパラメータを管理します</p>
      </div>
      
      <ParametersTable />
    </div>
  )
}
