import { requireAdmin } from '@/lib/auth'
import { TestimonialsManager } from '@/components/admin/TestimonialsManager'

export default async function AdminTestimonialsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionează Testimoniale</h1>
        <p className="text-gray-600 mt-2">
          Adaugă, editează sau șterge testimoniale și recenzii clienți
        </p>
      </div>

      <TestimonialsManager />
    </div>
  )
}
