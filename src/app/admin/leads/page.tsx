import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import LeadsManagement from '@/components/admin/LeadsManagement'

export default async function AdminLeadsPage() {
  const user = await requireAdmin()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <LeadsManagement />
}
