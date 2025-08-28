import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  try {
    const user = await requireAdmin()
    
    if (!user) {
      console.log('Admin access denied - redirecting to login')
      redirect('/admin/login')
    }
    
    console.log('Admin access granted:', user.id)
    return <AdminDashboard />
  } catch (error) {
    console.error('Admin page error:', error)
    redirect('/admin/login')
  }
}
