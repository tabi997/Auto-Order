import { requireAdmin } from '@/lib/auth'
import { TestimonialsManager } from '@/components/admin/TestimonialsManager'

export default async function TestimonialsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionare Testimoniale</h1>
        <p className="text-gray-600 mt-2">
          Creează, editează și gestionează testimoniale clienți
        </p>
      </div>

      <TestimonialsManager />
    </div>
  )
}
