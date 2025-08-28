import { requireAdmin } from '@/lib/auth'
import { ContentManager } from '@/components/admin/ContentManager'

export default async function AdminContentPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conținut Pagini</h1>
        <p className="text-gray-600 mt-2">
          Editează textul și conținutul din diferitele pagini ale site-ului
        </p>
      </div>

      <ContentManager />
    </div>
  )
}
