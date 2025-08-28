import { requireAdmin } from '@/lib/auth'
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager'

export default async function AdminSiteSettingsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setări Site</h1>
        <p className="text-gray-600 mt-2">
          Configurări generale site, SEO și alte setări
        </p>
      </div>

      <SiteSettingsManager />
    </div>
  )
}
