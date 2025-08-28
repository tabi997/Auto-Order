'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Edit, Trash2, Star, Search } from 'lucide-react'
import VehicleForm from './VehicleForm'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  km: number
  fuel: string
  transmission: string
  price_est: number
  badges: string[]
  images: string[]
  source: string
  featured: boolean
  featured_position: number
  created_at: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      
      if (data.data) {
        setVehicles(data.data)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca vehiculele",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featured: !vehicle.featured,
          featured_position: !vehicle.featured ? Date.now() : 0
        })
      })

      if (response.ok) {
        setVehicles(vehicles.map(v => 
          v.id === vehicle.id 
            ? { ...v, featured: !v.featured, featured_position: !v.featured ? Date.now() : 0 }
            : v
        ))
        toast({
          title: "Succes",
          description: `Vehiculul ${vehicle.featured ? 'eliminat din' : 'adăugat în'} recomandări`,
        })
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza vehiculul",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (vehicle: Vehicle) => {
    if (!confirm(`Ești sigur că vrei să ștergi ${vehicle.make} ${vehicle.model}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== vehicle.id))
        toast({
          title: "Succes",
          description: "Vehiculul a fost șters",
        })
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge vehiculul",
        variant: "destructive",
      })
    }
  }

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare Vehicule</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adaugă vehicul
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editează vehiculul' : 'Adaugă vehicul nou'}
              </DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={editingVehicle}
              onSuccess={() => {
                setIsFormOpen(false)
                setEditingVehicle(null)
                fetchVehicles()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Caută după marcă sau model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{vehicle.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={vehicle.featured}
                    onCheckedChange={() => handleToggleFeatured(vehicle)}
                    aria-label="Toggle featured"
                  />
                  {vehicle.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Kilometri:</span>
                  <span>{vehicle.km.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Combustibil:</span>
                  <span className="capitalize">{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cutie:</span>
                  <span className="capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Preț estimat:</span>
                  <span>{formatPrice(vehicle.price_est)}</span>
                </div>
              </div>

              {vehicle.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {vehicle.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Editează vehiculul</DialogTitle>
                    </DialogHeader>
                    <VehicleForm
                      vehicle={vehicle}
                      onSuccess={() => {
                        fetchVehicles()
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(vehicle)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'Nu s-au găsit vehicule care să corespundă căutării.' : 'Nu există vehicule în baza de date.'}
          </p>
        </div>
      )}
    </div>
  )
}
