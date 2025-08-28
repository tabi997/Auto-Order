'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Car, Send } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  price_est: number
  images: string[]
}

interface OfferRequestFormProps {
  vehicle: Vehicle
}

export default function OfferRequestForm({ vehicle }: OfferRequestFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget: '',
    timeline: '',
    preferredContact: 'email'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Solicitare trimisă cu succes!",
        description: "Vă vom contacta în cel mai scurt timp cu o ofertă personalizată.",
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        budget: '',
        timeline: '',
        preferredContact: 'email'
      })
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut trimite solicitarea. Vă rugăm să încercați din nou.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="ghost" asChild>
          <Link href={`/stock/${vehicle.id}`} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Înapoi la detalii vehicul</span>
          </Link>
        </Button>
      </div>

      {/* Vehicle Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <Car className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </h2>
              <p className="text-2xl font-bold text-primary">
                €{vehicle.price_est.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offer Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Solicită verificare / ofertă</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Introduceți numele complet"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="exemplu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Număr de telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+40 123 456 789"
              />
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Buget estimat (€)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Ex: 15000"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline achiziție</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="Ex: În următoarele 2 săptămâni"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj suplimentar</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Descrieți cerințele specifice, întrebări sau detalii suplimentare..."
                rows={4}
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2">
              <Label>Metodă preferată de contact</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  />
                  <span>Telefon</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Se trimite...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Trimite solicitarea
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Ce urmează?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              După trimiterea solicitării, echipa noastră va analiza vehiculul și va verifica:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Starea tehnică și istoricul vehiculului</li>
              <li>Prețul de piață și oportunitatea</li>
              <li>Documentele și conformitatea</li>
              <li>Logistica și transportul</li>
            </ul>
            <p>
              Veți primi o ofertă personalizată în cel mai scurt timp posibil, de obicei în 24-48 de ore.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
