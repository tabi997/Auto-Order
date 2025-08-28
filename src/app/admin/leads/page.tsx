import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import LeadsManagement from '@/components/admin/LeadsManagement'

export default async function AdminLeadsPage() {
  try {
    const user = await requireAdmin()
    
    if (!user) {
      console.log('Admin access denied for leads - redirecting to login')
      redirect('/admin/login')
    }
    
    console.log('Admin access granted for leads:', user.id)
    return <LeadsManagement />
  } catch (error) {
    console.error('Admin leads page error:', error)
    redirect('/admin/login')
  }
}
