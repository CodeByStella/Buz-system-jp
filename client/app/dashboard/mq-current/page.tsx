import { DashboardLayout } from '@/components/layout/dashboard-layout'
import MQCurrentSheet from '@/components/sheets/mq-current-sheet'

export default function MQCurrentPage() {
  return (
    <DashboardLayout>
      <MQCurrentSheet />
    </DashboardLayout>
  )
}
