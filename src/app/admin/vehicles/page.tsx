import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import VehiclesManagement from '@/components/admin/VehiclesManagement'

export default async function AdminVehiclesPage() {
  const user = await requireAdmin()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <VehiclesManagement />
}
