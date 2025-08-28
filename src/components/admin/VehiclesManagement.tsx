'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { AdminImagesUploader } from '@/components/AdminImagesUploader'
import { Car, Plus, Edit, Trash2, Star, Eye, ExternalLink } from 'lucide-react'
import { VehicleZ } from '@/schemas/vehicle'
import Link from 'next/link'
import { getAdminVehicles, createAdminVehicle, updateAdminVehicle, deleteAdminVehicle } from '@/app/actions/admin'

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

export default function VehiclesManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    km: 0,
    fuel: 'benzina',
    transmission: 'manuala',
    price_est: 0,
    badges: [] as string[],
    images: [] as string[],
    source: '',
    featured: false,
    featured_position: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const data = await getAdminVehicles()
      setVehicles(data.data || [])
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca vehiculele",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validatedData = VehicleZ.parse(formData)
    
    // Map schema fields to database structure
    const vehicleData = {
      make: validatedData.make,
      model: validatedData.model,
      year: validatedData.year,
      km: validatedData.km,
      fuel: validatedData.fuel,
      transmission: validatedData.transmission,
      price_est: validatedData.price_est,
      badges: validatedData.badges || [],
      images: validatedData.images || [],
      source: validatedData.source || '',
      featured: validatedData.featured || false,
      featured_position: validatedData.featured_position || 0,
    }
    
    try {
      if (editingVehicle) {
        await updateAdminVehicle(editingVehicle.id, vehicleData)
      } else {
        await createAdminVehicle(vehicleData)
      }

      toast({
        title: "Succes",
        description: editingVehicle ? "Vehicul actualizat" : "Vehicul creat",
      })
      
      setIsDialogOpen(false)
      resetForm()
      fetchVehicles()
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva vehiculul",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      km: vehicle.km,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      price_est: vehicle.price_est,
      badges: vehicle.badges,
      images: vehicle.images,
      source: vehicle.source,
      featured: vehicle.featured,
      featured_position: vehicle.featured_position
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest vehicul?')) return

    try {
      await deleteAdminVehicle(id)

      toast({
        title: "Succes",
        description: "Vehicul șters",
      })

      fetchVehicles()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge vehiculul",
        variant: "destructive",
      })
    }
  }

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    try {
      await updateAdminVehicle(vehicle.id, {
        featured: !vehicle.featured
      })
      toast({
        title: "Succes",
        description: "Status featured actualizat",
      })
      fetchVehicles()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      km: 0,
      fuel: 'benzina',
      transmission: 'manuala',
      price_est: 0,
      badges: [],
      images: [],
      source: '',
      featured: false,
      featured_position: 0
    })
  }

  const openNewDialog = () => {
    setEditingVehicle(null)
    resetForm()
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Se încarcă vehiculele...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestionare Vehicule</h1>
          <p className="text-muted-foreground">
            Adaugă, editează sau șterge vehicule din stoc
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Vehicul
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editează Vehicul' : 'Adaugă Vehicul Nou'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Marcă *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">An *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">KM *</Label>
                  <Input
                    id="km"
                    type="number"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_est">Preț Estimat (€) *</Label>
                  <Input
                    id="price_est"
                    type="number"
                    value={formData.price_est}
                    onChange={(e) => setFormData({...formData, price_est: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuel">Combustibil *</Label>
                  <Select value={formData.fuel} onValueChange={(value) => setFormData({...formData, fuel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="benzina">Benzină</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hibrid">Hibrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmisie *</Label>
                  <Select value={formData.transmission} onValueChange={(value) => setFormData({...formData, transmission: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuala">Manuală</SelectItem>
                      <SelectItem value="automata">Automată</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Link Sursă</Label>
                <Input
                  id="source"
                  type="url"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Imagini</Label>
                <AdminImagesUploader
                  initialImages={formData.images.map(url => ({ url }))}
                  onChange={(images) => setFormData({...formData, images: images.map(img => img.url)})}
                  maxImages={8}
                  listingId={editingVehicle?.id}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <Label htmlFor="featured">Vehicul Featured (apare pe homepage)</Label>
              </div>

              {formData.featured && (
                <div className="space-y-2">
                  <Label htmlFor="featured_position">Poziție Featured</Label>
                  <Input
                    id="featured_position"
                    type="number"
                    value={formData.featured_position}
                    onChange={(e) => setFormData({...formData, featured_position: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Anulează
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Actualizează' : 'Adaugă'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {vehicle.images[0] && (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year} • {vehicle.km.toLocaleString()} km • {vehicle.fuel} • {vehicle.transmission}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {vehicle.price_est.toLocaleString()} €
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {vehicle.featured && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(vehicle)}
                  >
                    <Star className={`h-4 w-4 ${vehicle.featured ? 'fill-yellow-400' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/stock/${vehicle.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {vehicles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nu există vehicule</h3>
              <p className="text-muted-foreground mb-4">
                Adaugă primul vehicul în stoc pentru a începe
              </p>
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Vehicul
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
