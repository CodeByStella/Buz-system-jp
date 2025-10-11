import { ParametersTable } from '@/components/admin/parameters-table'
import { Header } from '@/components/layout/header'

export default function AdminPage() {
  return (
    <div className="h-screen bg-gray-50  flex flex-col">
      <Header />
      <div className="flex-1  flex justify-center">
        <div className="w-full max-w-[1440px] h-full p-4">
          <div className="h-full border border-gray-200 bg-white ">
            <div className="flex h-full">
              <div className="flex-1 flex flex-col ">
                <main className="flex-1 p-6 overflow-auto space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
                    <p className="text-gray-600">システムの設定とパラメータを管理します</p>
                  </div>
                  <ParametersTable />
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
