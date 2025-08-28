'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CheckCircle } from 'lucide-react'

const leadSchema = z.object({
  marca_model: z.string().min(2, 'Specifică marca și modelul'),
  buget: z.string().min(1, 'Selectează bugetul'),
  contact: z.string().min(1, 'Introdu contactul'),
})

type LeadFormData = z.infer<typeof leadSchema>

const budgetOptions = [
  { value: 'sub-5000', label: 'Sub 5.000 €' },
  { value: '5000-10000', label: '5.000 - 10.000 €' },
  { value: '10000-15000', label: '10.000 - 15.000 €' },
  { value: '15000-20000', label: '15.000 - 20.000 €' },
  { value: '20000-30000', label: '20.000 - 30.000 €' },
  { value: 'peste-30000', label: 'Peste 30.000 €' },
]

export default function LeadQuickForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Mulțumim!",
          description: "Te contactăm în 15–30 min.",
          duration: 5000,
        })
        
        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'submit', {
            event_category: 'lead_form',
            event_label: 'homepage_quick_form',
            data_analytics_id: 'lead_submit'
          })
        }
      } else {
        const errorData = await response.json()
        toast({
          title: "Eroare",
          description: errorData.error || "A apărut o eroare. Încearcă din nou.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      toast({
        title: "Eroare",
        description: "A apărut o eroare. Încearcă din nou.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="lead-quick" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mulțumim pentru solicitarea ta!</h3>
              <p className="text-gray-600 mb-4">
                Echipa noastră te va contacta în următoarele 15-30 de minute pentru a discuta detalii și a-ți oferi o cotație personalizată.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline"
              >
                Cere altă ofertă
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="lead-quick" className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Cere ofertă în 60s</CardTitle>
            <p className="text-gray-600">
              Spune-ne ce mașină vrei și îți oferim costul final
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="marca_model">Marca și modelul dorit</Label>
                <Input
                  id="marca_model"
                  placeholder="ex: BMW X3, Audi A4, VW Golf"
                  {...register('marca_model')}
                  className={errors.marca_model ? 'border-red-500' : ''}
                />
                {errors.marca_model && (
                  <p className="text-red-500 text-sm mt-1">{errors.marca_model.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="buget">Bugetul tău</Label>
                <Select onValueChange={(value) => setValue('buget', value)}>
                  <SelectTrigger className={errors.buget ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selectează bugetul" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.buget && (
                  <p className="text-red-500 text-sm mt-1">{errors.buget.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact">Telefon sau email</Label>
                <Input
                  id="contact"
                  placeholder="ex: 0722123456 sau email@example.com"
                  {...register('contact')}
                  className={errors.contact ? 'border-red-500' : ''}
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                data-analytics-id="hero_cta"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  'Cere ofertă în 60s'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
