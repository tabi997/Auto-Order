'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, Mail, Users, Settings, Bell, Send, FileText } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface NewsletterSettings {
  general: {
    enabled: boolean
    name: string
    description: string
    frequency: string
    timezone: string
  }
  templates: {
    welcome: string
    newsletter: string
    promotional: string
  }
  subscribers: {
    autoConfirm: boolean
    requireConfirmation: boolean
    maxSubscribers: number
    categories: string[]
  }
  sending: {
    fromEmail: string
    fromName: string
    replyTo: string
    maxPerHour: number
    enableTracking: boolean
  }
}

const defaultSettings: NewsletterSettings = {
  general: {
    enabled: true,
    name: 'AutoOrder Newsletter',
    description: 'Primeste cele mai noi oferte și noutăți despre vehicule',
    frequency: 'weekly',
    timezone: 'Europe/Bucharest'
  },
  templates: {
    welcome: 'Bun venit la newsletter-ul AutoOrder! Vei primi cele mai noi oferte și noutăți despre vehicule.',
    newsletter: 'Iată cele mai noi oferte și noutăți despre vehicule de la AutoOrder.',
    promotional: 'Ofertă specială pentru abonații newsletter-ului nostru!'
  },
  subscribers: {
    autoConfirm: false,
    requireConfirmation: true,
    maxSubscribers: 10000,
    categories: ['Oferte', 'Noutăți', 'Promoții', 'Sfaturi']
  },
  sending: {
    fromEmail: 'newsletter@autoorder.ro',
    fromName: 'AutoOrder',
    replyTo: 'contact@autoorder.ro',
    maxPerHour: 1000,
    enableTracking: true
  }
}

const frequencyOptions = [
  { value: 'daily', label: 'Zilnic' },
  { value: 'weekly', label: 'Săptămânal' },
  { value: 'biweekly', label: 'La 2 săptămâni' },
  { value: 'monthly', label: 'Lunar' }
]

export function NewsletterSettingsManager() {
  const [settings, setSettings] = useState<NewsletterSettings>(defaultSettings)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<NewsletterSettings>(defaultSettings)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('admin-newsletter-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(parsed)
      setFormData(parsed)
    } else {
      localStorage.setItem('admin-newsletter-settings', JSON.stringify(defaultSettings))
    }
  }, [])

  const handleSave = () => {
    setSettings(formData)
    localStorage.setItem('admin-newsletter-settings', JSON.stringify(formData))
    setIsEditing(false)
    toast({
      title: "Salvat cu succes",
      description: "Setările newsletter-ului au fost actualizate",
    })
  }

  const handleCancel = () => {
    setFormData(settings)
    setIsEditing(false)
  }

  const handleInputChange = (section: keyof NewsletterSettings, field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.subscribers.categories.includes(newCategory.trim())) {
      const updated = {
        ...formData,
        subscribers: {
          ...formData.subscribers,
          categories: [...formData.subscribers.categories, newCategory.trim()]
        }
      }
      setFormData(updated)
      setNewCategory('')
    }
  }

  const removeCategory = (category: string) => {
    const updated = {
      ...formData,
      subscribers: {
        ...formData.subscribers,
        categories: formData.subscribers.categories.filter(c => c !== category)
      }
    }
    setFormData(updated)
  }

  const renderGeneralSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Setări Generale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="newsletter-enabled"
            checked={formData.general.enabled}
            onCheckedChange={(checked) => handleInputChange('general', 'enabled', checked)}
            disabled={!isEditing}
          />
          <Label htmlFor="newsletter-enabled">Activează Newsletter</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-name">Nume Newsletter</Label>
            <Input
              id="newsletter-name"
              value={formData.general.name}
              onChange={(e) => handleInputChange('general', 'name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-frequency">Frecvență</Label>
            <Select 
              value={formData.general.frequency} 
              onValueChange={(value) => handleInputChange('general', 'frequency', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newsletter-description">Descriere</Label>
          <Textarea
            id="newsletter-description"
            value={formData.general.description}
            onChange={(e) => handleInputChange('general', 'description', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newsletter-timezone">Fus Orar</Label>
          <Input
            id="newsletter-timezone"
            value={formData.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderTemplatesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Template-uri Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="welcome-template">Template Bun Venit</Label>
          <Textarea
            id="welcome-template"
            value={formData.templates.welcome}
            onChange={(e) => handleInputChange('templates', 'welcome', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newsletter-template">Template Newsletter</Label>
          <Textarea
            id="newsletter-template"
            value={formData.templates.newsletter}
            onChange={(e) => handleInputChange('templates', 'newsletter', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promotional-template">Template Promoțional</Label>
          <Textarea
            id="promotional-template"
            value={formData.templates.promotional}
            onChange={(e) => handleInputChange('templates', 'promotional', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderSubscribersSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Setări Abonați
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-confirm"
              checked={formData.subscribers.autoConfirm}
              onCheckedChange={(checked) => handleInputChange('subscribers', 'autoConfirm', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="auto-confirm">Confirmare Automată</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="require-confirmation"
              checked={formData.subscribers.requireConfirmation}
              onCheckedChange={(checked) => handleInputChange('subscribers', 'requireConfirmation', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="require-confirmation">Necesită Confirmare</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-subscribers">Număr Maxim Abonați</Label>
          <Input
            id="max-subscribers"
            value={formData.subscribers.maxSubscribers}
            onChange={(e) => handleInputChange('subscribers', 'maxSubscribers', parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            type="number"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Categorii Newsletter</Label>
          <div className="flex gap-2 flex-wrap">
            {formData.subscribers.categories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                {isEditing && (
                  <button
                    onClick={() => removeCategory(category)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nouă categorie"
                className="flex-1"
              />
              <Button onClick={addCategory} size="sm">
                Adaugă
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderSendingSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Setări Trimitere
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-email">Email Expeditor</Label>
            <Input
              id="from-email"
              value={formData.sending.fromEmail}
              onChange={(e) => handleInputChange('sending', 'fromEmail', e.target.value)}
              disabled={!isEditing}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="from-name">Nume Expeditor</Label>
            <Input
              id="from-name"
              value={formData.sending.fromName}
              onChange={(e) => handleInputChange('sending', 'fromName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reply-to">Email Răspuns</Label>
          <Input
            id="reply-to"
            value={formData.sending.replyTo}
            onChange={(e) => handleInputChange('sending', 'replyTo', e.target.value)}
            disabled={!isEditing}
            type="email"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-per-hour">Maxim pe Oră</Label>
            <Input
              id="max-per-hour"
              value={formData.sending.maxPerHour}
              onChange={(e) => handleInputChange('sending', 'maxPerHour', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              type="number"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-tracking"
              checked={formData.sending.enableTracking}
              onCheckedChange={(checked) => handleInputChange('sending', 'enableTracking', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="enable-tracking">Activează Tracking</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Configurare Newsletter</h2>
          <p className="text-sm text-gray-600">Modifică setările newsletter-ului și comunicărilor</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Editează
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvează
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Anulează
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {renderGeneralSection()}
        {renderTemplatesSection()}
        {renderSubscribersSection()}
        {renderSendingSection()}
      </div>

      {!isEditing && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Pentru a modifica setările newsletter-ului, apasă butonul &quot;Editează&quot; de mai sus.</p>
              <p>Toate modificările vor fi salvate local și vor fi vizibile imediat pe site.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
