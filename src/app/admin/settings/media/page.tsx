import { requireAdmin } from '@/lib/auth'
import { MediaManager } from '@/components/admin/MediaManager'

export default async function MediaPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionare Media</h1>
        <p className="text-gray-600 mt-2">
          Upload și gestionează imagini pentru Hero, SEO și alte secțiuni
        </p>
      </div>

      <MediaManager />
    </div>
  )
}
