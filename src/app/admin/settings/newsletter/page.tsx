import { requireAdmin } from '@/lib/auth'
import { NewsletterSettingsManager } from '@/components/admin/NewsletterSettingsManager'

export default async function AdminNewsletterPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setări Newsletter</h1>
        <p className="text-gray-600 mt-2">
          Configurează newsletter-ul și comunicările cu clienții
        </p>
      </div>

      <NewsletterSettingsManager />
    </div>
  )
}
