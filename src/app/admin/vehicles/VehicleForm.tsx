'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VehicleZ } from '@/schemas/vehicle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Upload, X } from 'lucide-react'
import type { VehicleInput } from '@/schemas/vehicle'

interface VehicleFormProps {
  vehicle?: any
  onSuccess: () => void
}

export default function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(VehicleZ),
    defaultValues: vehicle || {
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
      featured_position: 0,
    },
  })

  const watchedImages = watch('images', [])

  const onSubmit = async (data: VehicleInput) => {
    setIsSubmitting(true)
    
    try {
      const url = vehicle 
        ? `/api/admin/vehicles/${vehicle.id}`
        : '/api/admin/vehicles'
      
      const method = vehicle ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Succes",
          description: vehicle ? "Vehiculul a fost actualizat" : "Vehiculul a fost adăugat",
        })
        onSuccess()
        if (!vehicle) {
          reset()
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la salvare')
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare la salvare",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        const currentImages = watch('images', [])
        setValue('images', [...currentImages, data.url])
        toast({
          title: "Succes",
          description: "Imaginea a fost încărcată",
        })
      } else {
        throw new Error('Eroare la încărcarea imaginii')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut încărca imaginea",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    const currentImages = watch('images', [])
    setValue('images', currentImages.filter((_, i) => i !== index))
  }

  const addBadge = (badge: string) => {
    const currentBadges = watch('badges', [])
    if (!currentBadges.includes(badge)) {
      setValue('badges', [...currentBadges, badge])
    }
  }

  const removeBadge = (badge: string) => {
    const currentBadges = watch('badges', [])
    setValue('badges', currentBadges.filter(b => b !== badge))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Marcă *</Label>
          <Input
            id="make"
            {...register('make')}
            className={errors.make ? 'border-red-500' : ''}
          />
          {errors.make && (
            <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            {...register('model')}
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="year">An *</Label>
          <Input
            id="year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            className={errors.year ? 'border-red-500' : ''}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="km">Kilometri *</Label>
          <Input
            id="km"
            type="number"
            {...register('km', { valueAsNumber: true })}
            className={errors.km ? 'border-red-500' : ''}
          />
          {errors.km && (
            <p className="text-red-500 text-sm mt-1">{errors.km.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fuel">Combustibil *</Label>
          <Select onValueChange={(value) => setValue('fuel', value)} defaultValue={watch('fuel')}>
            <SelectTrigger className={errors.fuel ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selectează combustibilul" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="benzina">Benzină</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hibrid">Hibrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuel && (
            <p className="text-red-500 text-sm mt-1">{errors.fuel.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="transmission">Cutie de viteze *</Label>
          <Select onValueChange={(value) => setValue('transmission', value)} defaultValue={watch('transmission')}>
            <SelectTrigger className={errors.transmission ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selectează cutia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manuala">Manuală</SelectItem>
              <SelectItem value="automata">Automată</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && (
            <p className="text-red-500 text-sm mt-1">{errors.transmission.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price_est">Preț estimat (EUR) *</Label>
          <Input
            id="price_est"
            type="number"
            step="0.01"
            {...register('price_est', { valueAsNumber: true })}
            className={errors.price_est ? 'border-red-500' : ''}
          />
          {errors.price_est && (
            <p className="text-red-500 text-sm mt-1">{errors.price_est.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="source">Link Openlane (opțional)</Label>
          <Input
            id="source"
            type="url"
            {...register('source')}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label>Badge-uri</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Fără accidente', 'Primul proprietar', 'Service istoric', 'Garantie'].map((badge) => (
            <Button
              key={badge}
              type="button"
              variant={watch('badges', []).includes(badge) ? 'default' : 'outline'}
              size="sm"
              onClick={() => watch('badges', []).includes(badge) ? removeBadge(badge) : addBadge(badge)}
            >
              {badge}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Imagini</Label>
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleImageUpload(file)
              }
            }}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage}
          />
          <label htmlFor="image-upload">
            <Button type="button" variant="outline" disabled={uploadingImage}>
              {uploadingImage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploadingImage ? 'Se încarcă...' : 'Încarcă imagine'}
            </Button>
          </label>
        </div>
        
        {watchedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {watchedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Imagine ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={watch('featured')}
          onCheckedChange={(checked) => setValue('featured', checked)}
        />
        <Label htmlFor="featured">Vehicul recomandat</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {vehicle ? 'Actualizează' : 'Adaugă'} vehiculul
        </Button>
      </div>
    </form>
  )
}
