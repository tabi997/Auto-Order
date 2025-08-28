'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listingSchema, ListingFormData } from '@/types/admin'
import { createListingAction } from '../../actions'
import { toast } from '@/components/ui/use-toast'
import { AdminImagesUploader } from '@/components/AdminImagesUploader'

export function ListingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      priceEur: 0,
      km: 0,
      fuel: 'Benzina',
      gearbox: 'Automata',
      body: 'SUV',
      country: '',
      type: 'BUY_NOW',
      status: 'DRAFT',
      shortDesc: '',
      sourceUrl: '',
      sourceName: '',
      images: [],
    },
  })

  const onSubmit = async (data: ListingFormData) => {
    console.log('🔍 ListingForm - onSubmit STARTED with data:', data);
    console.log('🔍 ListingForm - Form errors before submit:', form.formState.errors);
    console.log('🔍 ListingForm - Form is valid:', form.formState.isValid);
    
    setIsSubmitting(true)
    
    try {
      console.log('🔍 ListingForm - Calling createListingAction...');
      const result = await createListingAction(data)
      console.log('🔍 ListingForm - createListingAction result:', result);
      
      if (result.error) {
        console.error('❌ ListingForm - Error from action:', result.error);
        toast({
          title: "Eroare",
          description: result.error,
          variant: "destructive",
        })
      } else {
        console.log('✅ ListingForm - Success! Redirecting...');
        toast({
          title: "Succes",
          description: "Anunțul a fost creat cu succes!",
        })
        router.push('/admin/listings')
      }
    } catch (error) {
      console.error('💥 ListingForm - Unexpected error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată",
        variant: "destructive",
      })
    } finally {
      console.log('🔍 ListingForm - onSubmit FINISHED');
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informații vehicul</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('🔍 ListingForm - Form submit prevented, calling handleSubmit manually');
          form.handleSubmit(onSubmit)(e);
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titlu */}
            <div className="space-y-2">
              <Label htmlFor="title">Titlu *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="ex: BMW X5 3.0d"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                {...form.register('brand')}
                placeholder="ex: BMW"
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-red-500">{form.formState.errors.brand.message}</p>
              )}
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                {...form.register('model')}
                placeholder="ex: X5"
              />
              {form.formState.errors.model && (
                <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
              )}
            </div>

            {/* An */}
            <div className="space-y-2">
              <Label htmlFor="year">An *</Label>
              <Input
                id="year"
                type="number"
                {...form.register('year', { valueAsNumber: true })}
                min="1990"
                max={new Date().getFullYear() + 1}
              />
              {form.formState.errors.year && (
                <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
              )}
            </div>

            {/* Preț */}
            <div className="space-y-2">
              <Label htmlFor="priceEur">Preț (EUR) *</Label>
              <Input
                id="priceEur"
                type="number"
                {...form.register('priceEur', { valueAsNumber: true })}
                min="0"
                placeholder="0"
              />
              {form.formState.errors.priceEur && (
                <p className="text-sm text-red-500">{form.formState.errors.priceEur.message}</p>
              )}
            </div>

            {/* Kilometraj */}
            <div className="space-y-2">
              <Label htmlFor="km">Kilometraj *</Label>
              <Input
                id="km"
                type="number"
                {...form.register('km', { valueAsNumber: true })}
                min="0"
                placeholder="0"
              />
              {form.formState.errors.km && (
                <p className="text-sm text-red-500">{form.formState.errors.km.message}</p>
              )}
            </div>

            {/* Combustibil */}
            <div className="space-y-2">
              <Label htmlFor="fuel">Combustibil *</Label>
              <Select onValueChange={(value) => form.setValue('fuel', value as any)} defaultValue={form.getValues('fuel')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează combustibilul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Benzina">Benzina</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.fuel && (
                <p className="text-sm text-red-500">{form.formState.errors.fuel.message}</p>
              )}
            </div>

            {/* Cutie de viteze */}
            <div className="space-y-2">
              <Label htmlFor="gearbox">Cutie de viteze *</Label>
              <Select onValueChange={(value) => form.setValue('gearbox', value as any)} defaultValue={form.getValues('gearbox')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează cutia de viteze" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automata">Automata</SelectItem>
                  <SelectItem value="Manuala">Manuală</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gearbox && (
                <p className="text-sm text-red-500">{form.formState.errors.gearbox.message}</p>
              )}
            </div>

            {/* Tip caroserie */}
            <div className="space-y-2">
              <Label htmlFor="body">Tip caroserie *</Label>
              <Select onValueChange={(value) => form.setValue('body', value as any)} defaultValue={form.getValues('body')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tipul caroseriei" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Break">Break</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="MPV">MPV</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                  <SelectItem value="Alt">Alt</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.body && (
                <p className="text-sm text-red-500">{form.formState.errors.body.message}</p>
              )}
            </div>

            {/* Țară */}
            <div className="space-y-2">
              <Label htmlFor="country">Țară *</Label>
              <Input
                id="country"
                {...form.register('country')}
                placeholder="ex: Germania"
              />
              {form.formState.errors.country && (
                <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
              )}
            </div>

            {/* Tip anunț */}
            <div className="space-y-2">
              <Label htmlFor="type">Tip anunț *</Label>
              <Select onValueChange={(value) => form.setValue('type', value as any)} defaultValue={form.getValues('type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tipul anunțului" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY_NOW">Buy Now</SelectItem>
                  <SelectItem value="AUCTION">Licitație</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => form.setValue('status', value as any)} defaultValue={form.getValues('status')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează statusul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Publicat</SelectItem>
                  <SelectItem value="ARCHIVED">Arhivat</SelectItem>
                  <SelectItem value="SOLD">Vândut</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Descriere scurtă */}
          <div className="space-y-2">
            <Label htmlFor="shortDesc">Descriere scurtă</Label>
            <Textarea
              id="shortDesc"
              {...form.register('shortDesc')}
              placeholder="Descriere scurtă despre vehicul..."
              rows={3}
            />
            {form.formState.errors.shortDesc && (
              <p className="text-sm text-red-500">{form.formState.errors.shortDesc.message}</p>
            )}
          </div>

          {/* URL sursă */}
          <div className="space-y-2">
            <Label htmlFor="sourceUrl">URL sursă</Label>
            <Input
              id="sourceUrl"
              type="url"
              {...form.register('sourceUrl')}
              placeholder="https://www.openlane.com/car/12345"
            />
            {form.formState.errors.sourceUrl && (
              <p className="text-sm text-red-500">{form.formState.errors.sourceUrl.message}</p>
            )}
          </div>

          {/* Nume sursă */}
          <div className="space-y-2">
            <Label htmlFor="sourceName">Nume sursă</Label>
            <Input
              id="sourceName"
              {...form.register('sourceName')}
              placeholder="ex: Openlane"
            />
            {form.formState.errors.sourceName && (
              <p className="text-sm text-red-500">{form.formState.errors.sourceName.message}</p>
            )}
          </div>

          {/* Imagini */}
          <div className="space-y-2">
            <AdminImagesUploader
              initialImages={form.watch('images') || []}
              onChange={(images) => form.setValue('images', images)}
              listingId="new"
            />
            {form.formState.errors.images && (
              <p className="text-sm text-red-500">{form.formState.errors.images.message}</p>
            )}
          </div>

          {/* Butoane */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              disabled={isSubmitting}
              onClick={() => {
                console.log('🔍 ListingForm - Submit button clicked, calling handleSubmit');
                form.handleSubmit(onSubmit)();
              }}
            >
              {isSubmitting ? 'Se salvează...' : 'Salvează anunțul'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/listings')}
            >
              Anulează
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
