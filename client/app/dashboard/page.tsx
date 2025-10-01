import { redirect } from 'next/navigation'

export default function DashboardIndexRedirect() {
  redirect('/dashboard/start')
}
