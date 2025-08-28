'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, Globe, Search, Shield, Palette, Bell } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    language: string
    timezone: string
    maintenanceMode: boolean
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
    googleAnalytics: string
    googleTagManager: string
  }
  appearance: {
    primaryColor: string
    logoUrl: string
    faviconUrl: string
    enableDarkMode: boolean
  }
  notifications: {
    emailNotifications: boolean
    adminEmail: string
    enableAlerts: boolean
  }
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'AutoOrder',
    siteDescription: 'Soluția ta pentru sourcing auto profesional și transparent',
    language: 'ro',
    timezone: 'Europe/Bucharest',
    maintenanceMode: false
  },
  seo: {
    metaTitle: 'AutoOrder - Sourcing Auto Profesional',
    metaDescription: 'Găsește mașina perfectă pentru afacerea ta cu ajutorul expertizelor noastre de sourcing auto',
    keywords: 'sourcing auto, vehicule, dealer auto, flotă auto, românia',
    googleAnalytics: '',
    googleTagManager: ''
  },
  appearance: {
    primaryColor: '#2563eb',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    enableDarkMode: true
  },
  notifications: {
    emailNotifications: true,
    adminEmail: 'admin@autoorder.ro',
    enableAlerts: true
  }
}

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem('admin-site-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(parsed)
      setFormData(parsed)
    } else {
      localStorage.setItem('admin-site-settings', JSON.stringify(defaultSettings))
    }
  }, [])

  const handleSave = () => {
    setSettings(formData)
    localStorage.setItem('admin-site-settings', JSON.stringify(formData))
    setIsEditing(false)
    toast({
      title: "Salvat cu succes",
      description: "Setările site-ului au fost actualizate",
    })
  }

  const handleCancel = () => {
    setFormData(settings)
    setIsEditing(false)
  }

  const handleInputChange = (section: keyof SiteSettings, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderGeneralSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Setări Generale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Nume Site</Label>
            <Input
              id="site-name"
              value={formData.general.siteName}
              onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-language">Limbă</Label>
            <Input
              id="site-language"
              value={formData.general.language}
              onChange={(e) => handleInputChange('general', 'language', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-description">Descriere Site</Label>
          <Textarea
            id="site-description"
            value={formData.general.siteDescription}
            onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site-timezone">Fus Orar</Label>
            <Input
              id="site-timezone"
              value={formData.general.timezone}
              onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance-mode"
              checked={formData.general.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange('general', 'maintenanceMode', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="maintenance-mode">Mod Mentenanță</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSEOSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Setări SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input
            id="meta-title"
            value={formData.seo.metaTitle}
            onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea
            id="meta-description"
            value={formData.seo.metaDescription}
            onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-keywords">Cuvinte Cheie</Label>
          <Input
            id="meta-keywords"
            value={formData.seo.keywords}
            onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
            disabled={!isEditing}
            placeholder="cuvânt1, cuvânt2, cuvânt3"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ga-id">Google Analytics ID</Label>
            <Input
              id="ga-id"
              value={formData.seo.googleAnalytics}
              onChange={(e) => handleInputChange('seo', 'googleAnalytics', e.target.value)}
              disabled={!isEditing}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
            <Input
              id="gtm-id"
              value={formData.seo.googleTagManager}
              onChange={(e) => handleInputChange('seo', 'googleTagManager', e.target.value)}
              disabled={!isEditing}
              placeholder="GTM-XXXXXXX"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderAppearanceSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Aspect și Design
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Culoare Principală</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primary-color"
                value={formData.appearance.primaryColor}
                onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                disabled={!isEditing}
                type="color"
                className="w-16 h-10"
              />
              <Input
                value={formData.appearance.primaryColor}
                onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                disabled={!isEditing}
                placeholder="#2563eb"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={formData.appearance.enableDarkMode}
              onCheckedChange={(checked) => handleInputChange('appearance', 'enableDarkMode', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="dark-mode">Activează Modul Întunecat</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo-url">URL Logo</Label>
            <Input
              id="logo-url"
              value={formData.appearance.logoUrl}
              onChange={(e) => handleInputChange('appearance', 'logoUrl', e.target.value)}
              disabled={!isEditing}
              placeholder="/logo.png"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-url">URL Favicon</Label>
            <Input
              id="favicon-url"
              value={formData.appearance.faviconUrl}
              onChange={(e) => handleInputChange('appearance', 'faviconUrl', e.target.value)}
              disabled={!isEditing}
              placeholder="/favicon.ico"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderNotificationsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificări și Alerte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={formData.notifications.emailNotifications}
              onCheckedChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="email-notifications">Notificări Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-alerts"
              checked={formData.notifications.enableAlerts}
              onCheckedChange={(checked) => handleInputChange('notifications', 'enableAlerts', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="enable-alerts">Activează Alerte</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email Administrator</Label>
          <Input
            id="admin-email"
            value={formData.notifications.adminEmail}
            onChange={(e) => handleInputChange('notifications', 'adminEmail', e.target.value)}
            disabled={!isEditing}
            type="email"
            placeholder="admin@autoorder.ro"
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Configurare Site</h2>
          <p className="text-sm text-gray-600">Modifică setările generale ale site-ului</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
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
        {renderSEOSection()}
        {renderAppearanceSection()}
        {renderNotificationsSection()}
      </div>

      {!isEditing && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Pentru a modifica setările site-ului, apasă butonul &quot;Editează&quot; de mai sus.</p>
              <p>Toate modificările vor fi salvate local și vor fi vizibile imediat pe site.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
