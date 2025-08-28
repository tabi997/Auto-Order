import { requireAdmin } from '@/lib/auth'
import { SettingsNav } from '@/components/admin/SettingsNav'

export default async function AdminSettingsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setări Admin</h1>
        <p className="text-gray-600 mt-2">
          Gestionează conținutul site-ului, testimoniale, informații de contact și alte setări
        </p>
      </div>

      <SettingsNav />
    </div>
  )
}
