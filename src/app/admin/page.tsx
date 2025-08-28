import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const user = await requireAdmin()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
