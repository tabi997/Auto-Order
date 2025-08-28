import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Users, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // Fetch real-time statistics
  const [vehiclesResult, leadsResult] = await Promise.all([
    supabase.from('vehicles').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true })
  ])

  const vehiclesCount = vehiclesResult.count || 0
  const leadsCount = leadsResult.count || 0

  // Fetch recent vehicles for quick access
  const { data: recentVehicles } = await supabase
    .from('vehicles')
    .select('id, make, model, year, price_est, featured')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Gestionare vehicule și lead-uri
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicule</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesCount}</div>
            <p className="text-xs text-muted-foreground">
              vehicule în stoc
            </p>
            <Link href="/admin/vehicles">
              <Button variant="outline" size="sm" className="mt-2">
                Gestionare vehicule
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead-uri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount}</div>
            <p className="text-xs text-muted-foreground">
              lead-uri noi
            </p>
            <Link href="/admin/leads">
              <Button variant="outline" size="sm" className="mt-2">
                Gestionare lead-uri
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statistici</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              vizualizări astăzi
            </p>
            <Button variant="outline" size="sm" className="mt-2" disabled>
              Vezi statistici
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vehicles */}
      {recentVehicles && recentVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Vehicule recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {vehicle.make} {vehicle.model} {vehicle.year}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      €{vehicle.price_est?.toLocaleString() || 'N/A'}
                      {vehicle.featured && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/vehicles?edit=${vehicle.id}`}>
                        Editează
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/stock/${vehicle.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Vezi public
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/vehicles">
                <Button variant="outline" className="w-full">
                  Vezi toate vehiculele
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acțiuni rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/vehicles">
              <Button className="w-full h-16 text-lg">
                <Car className="h-6 w-6 mr-2" />
                Gestionare Vehicule
              </Button>
            </Link>
            
            <Link href="/admin/leads">
              <Button className="w-full h-16 text-lg">
                <Users className="h-6 w-6 mr-2" />
                Gestionare Lead-uri
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
