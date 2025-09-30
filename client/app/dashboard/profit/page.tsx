import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProfitSheet } from '@/components/sheets/profit-sheet'

export default function ProfitPage() {
  return (
    <DashboardLayout>
      <ProfitSheet />
    </DashboardLayout>
  )
}
