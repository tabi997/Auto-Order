import { requireAdmin } from '@/lib/auth'
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm'

export default async function SiteSettingsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setări Site</h1>
        <p className="text-gray-600 mt-2">
          Configurează Hero, Header, SEO, Contact și Newsletter
        </p>
      </div>

      <SiteSettingsForm />
    </div>
  )
}
