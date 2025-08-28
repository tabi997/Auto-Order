import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Users, TrendingUp, ExternalLink, Phone, Mail, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

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

  // Fetch recent leads with status information
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, marca_model, buget, contact, status, created_at, extra')
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch leads by status for statistics
  const { data: leadsByStatus } = await supabase
    .from('leads')
    .select('status')

  // Calculate status distribution
  const statusCounts = leadsByStatus?.reduce((acc: Record<string, number>, lead) => {
    acc[lead.status || 'new'] = (acc[lead.status || 'new'] || 0) + 1
    return acc
  }, {}) || {}

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Nou', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      qualified: { label: 'Calificat', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      quoted: { label: 'Cotat', variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprobat', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      ordered: { label: 'Comandat', variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrat', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEmail = (contact: string) => {
    return contact.includes('@')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Gestionare vehicule și lead-uri
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              lead-uri totale
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
            <CardTitle className="text-sm font-medium">Lead-uri noi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.new || 0}</div>
            <p className="text-xs text-muted-foreground">
              în așteptare
            </p>
            <Link href="/admin/leads?status=new">
              <Button variant="outline" size="sm" className="mt-2">
                Vezi lead-uri noi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversii</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leadsCount > 0 ? Math.round(((statusCounts.ordered || 0) + (statusCounts.delivered || 0)) / leadsCount * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              rata de conversie
            </p>
            <Link href="/admin/leads?status=ordered">
              <Button variant="outline" size="sm" className="mt-2">
                Vezi comenzi
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Leads Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Distribuția Lead-urilor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status)}
                    <span className="text-sm text-muted-foreground">
                      {status === 'new' && 'Nou'}
                      {status === 'qualified' && 'Calificat'}
                      {status === 'quoted' && 'Cotat'}
                      {status === 'approved' && 'Aprobat'}
                      {status === 'ordered' && 'Comandat'}
                      {status === 'delivered' && 'Livrat'}
                    </span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
              {Object.keys(statusCounts).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nu există lead-uri încă
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lead-uri Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads && recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {lead.marca_model}
                        </h4>
                        {getStatusBadge(lead.status || 'new')}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>Buget: {lead.buget}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isEmail(lead.contact) ? (
                            <Mail className="h-3 w-3" />
                          ) : (
                            <Phone className="h-3 w-3" />
                          )}
                          <span>{lead.contact}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/leads?edit=${lead.id}`}>
                          Vezi detalii
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nu există lead-uri recente</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full">
                  Vezi toate lead-urile
                </Button>
              </Link>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Link href="/admin/leads?status=new">
              <Button variant="outline" className="w-full h-16 text-lg">
                <TrendingUp className="h-6 w-6 mr-2" />
                Lead-uri Noi
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
