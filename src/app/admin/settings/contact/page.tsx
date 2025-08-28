import { requireAdmin } from '@/lib/auth'
import { ContactSettingsManager } from '@/components/admin/ContactSettingsManager'

export default async function AdminContactSettingsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Informații Contact</h1>
        <p className="text-gray-600 mt-2">
          Modifică informațiile de contact afișate pe site
        </p>
      </div>

      <ContactSettingsManager />
    </div>
  )
}
