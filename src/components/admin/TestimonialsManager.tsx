'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, Edit, Trash2, Save, X, User, Building, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Testimonial } from '@/lib/hooks/useTestimonials'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/app/actions/testimonials'

const defaultTestimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  role: '',
  company: '',
  rating: 5,
  content: '',
  badge: 'Client fidel',
  active: true
}

const badgeOptions = [
  'Dealer verificat',
  'Client fidel',
  'Prima achiziție',
  'Partener de afaceri',
  'Client VIP',
  'Dealer premium'
]

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState(defaultTestimonial)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load testimonials from API
  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await getTestimonials()
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca testimonialele",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  const handleAdd = () => {
    setIsAdding(true)
    setFormData(defaultTestimonial)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      rating: testimonial.rating,
      content: testimonial.content,
      badge: testimonial.badge,
      active: testimonial.active
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultTestimonial)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Eroare",
        description: "Numele și conținutul sunt obligatorii",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      if (isAdding) {
        // Create new testimonial
        await createTestimonial(formData)

        toast({
          title: "Succes",
          description: "Testimonial creat cu succes",
        })
        setIsAdding(false)
      } else if (editingId) {
        // Update existing testimonial
        await updateTestimonial(editingId, formData)

        toast({
          title: "Succes",
          description: "Testimonial actualizat cu succes",
        })
        setEditingId(null)
      }
      
      setFormData(defaultTestimonial)
      loadTestimonials() // Refresh the list
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva testimonialul",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest testimonial?')) {
      return
    }

    try {
      await deleteTestimonial(id)

      toast({
        title: "Succes",
        description: "Testimonial șters cu succes",
      })
      loadTestimonials() // Refresh the list
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge testimonialul",
        variant: "destructive"
      })
    }
  }

  const toggleActive = async (id: string) => {
    const testimonial = testimonials.find(t => t.id === id)
    if (!testimonial) return

    try {
      await updateTestimonial(id, {
        ...testimonial,
        active: !testimonial.active
      })

      toast({
        title: "Succes",
        description: `Testimonial ${!testimonial.active ? 'activat' : 'dezactivat'} cu succes`,
      })
      loadTestimonials() // Refresh the list
    } catch (error) {
      console.error('Error updating testimonial:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza testimonialul",
        variant: "destructive"
      })
    }
  }

  const renderForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAdding ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          {isAdding ? 'Adaugă Testimonial Nou' : 'Editează Testimonial'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nume *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Numele clientului"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Funcție</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="ex: Dealer Auto, Manager"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Companie</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Numele companiei"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} stele
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge</Label>
            <Select value={formData.badge} onValueChange={(value) => setFormData({ ...formData, badge: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {badgeOptions.map(badge => (
                  <SelectItem key={badge} value={badge}>
                    {badge}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Testimonial *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Testimonialul clientului..."
            rows={4}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="active">Activ (vizibil pe site)</Label>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Salvează...' : 'Salvează'}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Anulează
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Testimoniale ({testimonials.length})</h2>
          <p className="text-sm text-gray-600">Gestionează toate testimonialele site-ului</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adaugă Testimonial
        </Button>
      </div>

      {(isAdding || editingId) && renderForm()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className={`${!testimonial.active ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              {testimonial.company && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {testimonial.company}
                </div>
              )}
              
              <Badge variant="outline" className="text-xs">
                {testimonial.badge}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <blockquote className="text-sm text-muted-foreground mb-4 italic">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(testimonial.id)}
                  className="text-xs"
                >
                  {testimonial.active ? 'Dezactivează' : 'Activează'}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                    className="text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editează
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Șterge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nu există testimoniale încă.</p>
          <p className="text-sm">Pentru a modifica testimonialele, apasă butonul &quot;Editează&quot; de pe testimonialul dorit.</p>
          <p>Toate modificările vor fi salvate local și vor fi vizibile imediat pe site.</p>
        </div>
      )}
    </div>
  )
}
