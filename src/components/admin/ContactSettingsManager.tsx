'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Clock, Save, Globe, Building, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useSettings, ContactInfo } from '@/hooks/useSettings'

const defaultContactInfo: ContactInfo = {
  company: {
    name: 'AutoOrder',
    description: 'Soluția ta pentru sourcing auto profesional și transparent',
    website: 'https://autoorder.ro'
  },
  contact: {
    email: 'contact@autoorder.ro',
    phone: '+40 123 456 789',
    address: 'Strada Exemplu, Nr. 123',
    city: 'București',
    postalCode: '010000',
    country: 'România'
  },
  schedule: {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 18:00',
    saturday: '10:00 - 16:00',
    sunday: 'Închis'
  },
  social: {
    facebook: 'https://facebook.com/autoorder',
    instagram: 'https://instagram.com/autoorder',
    linkedin: 'https://linkedin.com/company/autoorder',
    youtube: 'https://youtube.com/@autoorder'
  }
}

export function ContactSettingsManager() {
  const { settings, loading, updateSettings } = useSettings()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ContactInfo>(defaultContactInfo)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings?.contact_info) {
      setFormData(settings.contact_info)
    }
  }, [settings])

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateSettings('contact_info', formData)
      setIsEditing(false)
      toast({
        title: "Salvat cu succes",
        description: "Informațiile de contact au fost actualizate în baza de date",
      })
    } catch (error) {
      toast({
        title: "Eroare la salvare",
        description: "Nu s-au putut salva informațiile. Încearcă din nou.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (settings?.contact_info) {
      setFormData(settings.contact_info)
    }
    setIsEditing(false)
  }

  const handleInputChange = (section: keyof ContactInfo, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderCompanySection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informații Companie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nume Companie</Label>
          <Input
            id="company-name"
            value={formData.company.name}
            onChange={(e) => handleInputChange('company', 'name', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-description">Descriere</Label>
          <Textarea
            id="company-description"
            value={formData.company.description}
            onChange={(e) => handleInputChange('company', 'description', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-website">Website</Label>
          <Input
            id="company-website"
            value={formData.company.website}
            onChange={(e) => handleInputChange('company', 'website', e.target.value)}
            disabled={!isEditing}
            type="url"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderContactSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Informații Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              disabled={!isEditing}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefon</Label>
            <Input
              id="contact-phone"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
              disabled={!isEditing}
              type="tel"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-address">Adresă</Label>
          <Input
            id="contact-address"
            value={formData.contact.address}
            onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-city">Oraș</Label>
            <Input
              id="contact-city"
              value={formData.contact.city}
              onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-postal">Cod Postal</Label>
            <Input
              id="contact-postal"
              value={formData.contact.postalCode}
              onChange={(e) => handleInputChange('contact', 'postalCode', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-country">Țară</Label>
            <Input
              id="contact-country"
              value={formData.contact.country}
              onChange={(e) => handleInputChange('contact', 'country', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderScheduleSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Program de Funcționare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.schedule).map(([day, hours]) => (
            <div key={day} className="space-y-2">
              <Label htmlFor={`schedule-${day}`} className="capitalize">
                {day === 'monday' ? 'Luni' : 
                 day === 'tuesday' ? 'Marți' :
                 day === 'wednesday' ? 'Miercuri' :
                 day === 'thursday' ? 'Joi' :
                 day === 'friday' ? 'Vineri' :
                 day === 'saturday' ? 'Sâmbătă' : 'Duminică'}
              </Label>
              <Input
                id={`schedule-${day}`}
                value={hours}
                onChange={(e) => handleInputChange('schedule', day, e.target.value)}
                disabled={!isEditing}
                placeholder="ex: 09:00 - 18:00"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderSocialSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Rețele Sociale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.social).map(([platform, url]) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={`social-${platform}`} className="capitalize">
                {platform === 'facebook' ? 'Facebook' :
                 platform === 'instagram' ? 'Instagram' :
                 platform === 'linkedin' ? 'LinkedIn' :
                 platform === 'youtube' ? 'YouTube' : platform}
              </Label>
              <Input
                id={`social-${platform}`}
                value={url}
                onChange={(e) => handleInputChange('social', platform, e.target.value)}
                disabled={!isEditing}
                type="url"
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Se încarcă setările...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Configurare Contact</h2>
          <p className="text-sm text-muted-foreground">
            Configurați setările pentru formularul de contact și notificările de email.
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Editează
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Se salvează...' : 'Salvează'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Anulează
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {renderCompanySection()}
        {renderContactSection()}
        {renderScheduleSection()}
        {renderSocialSection()}
      </div>

      {!isEditing && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Pentru a modifica informațiile, apasă butonul &quot;Editează&quot; de mai sus.</p>
              <p>Toate modificările vor fi salvate local și vor fi vizibile imediat pe site.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
