import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './actions'
import { DashboardContent } from './DashboardContent'

export const metadata: Metadata = {
  title: 'Admin Dashboard - AutoOrder',
  description: 'Panoul de administrare AutoOrder',
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <DashboardContent user={user} />
}
