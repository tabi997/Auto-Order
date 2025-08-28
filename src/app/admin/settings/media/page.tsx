import { requireAdmin } from '@/lib/auth'
import { MediaManager } from '@/components/admin/MediaManager'

export default async function AdminMediaPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Imagini și Media</h1>
        <p className="text-gray-600 mt-2">
          Gestionează imagini și fișiere media pentru site
        </p>
      </div>

      <MediaManager />
    </div>
  )
}
