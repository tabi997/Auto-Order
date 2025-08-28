import { Toaster } from "@/components/ui/toaster"
import { requireAdmin } from "@/lib/auth"
import AdminNavbar from "./AdminNavbar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify admin access
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
