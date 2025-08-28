'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, FileText, Home, Car, Users, Mail, Info, Edit } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface PageContent {
  id: string
  title: string
  description: string
  sections: {
    [key: string]: {
      title: string
      content: string
      subtitle?: string
    }
  }
}

interface ContentData {
  [pageId: string]: PageContent
}

const defaultContent: ContentData = {
  'home': {
    id: 'home',
    title: 'Pagina Principală',
    description: 'Conținutul paginii principale',
    sections: {
      'hero': {
        title: 'Secțiunea Hero',
        subtitle: 'Titlu principal',
        content: 'Soluția ta pentru sourcing auto profesional și transparent'
      },
      'hero-subtitle': {
        title: 'Subtitlu Hero',
        subtitle: 'Descriere principală',
        content: 'Găsește mașina perfectă pentru afacerea ta cu ajutorul expertizelor noastre'
      },
      'features-intro': {
        title: 'Introducere Caracteristici',
        subtitle: 'Titlu secțiune',
        content: 'De ce să alegi AutoOrder pentru nevoile tale de sourcing auto?'
      },
      'cta-main': {
        title: 'Call-to-Action Principal',
        subtitle: 'Text buton',
        content: 'Începe Sourcing-ul'
      }
    }
  },
  'stock': {
    id: 'stock',
    title: 'Pagina Stoc',
    description: 'Conținutul paginii de stoc',
    sections: {
      'header': {
        title: 'Header Pagină',
        subtitle: 'Titlu principal',
        content: 'Stocul Nostru de Vehicule'
      },
      'description': {
        title: 'Descriere Pagină',
        subtitle: 'Text explicativ',
        content: 'Explorează selecția noastră de vehicule disponibile pentru achiziție imediată'
      },
      'filters-intro': {
        title: 'Introducere Filtre',
        subtitle: 'Text deasupra filtrelor',
        content: 'Filtrează vehiculele după preferințele tale'
      }
    }
  },
  'sourcing': {
    id: 'sourcing',
    title: 'Pagina Sourcing',
    description: 'Conținutul paginii de sourcing',
    sections: {
      'header': {
        title: 'Header Pagină',
        subtitle: 'Titlu principal',
        content: 'Servicii de Sourcing Auto'
      },
      'description': {
        title: 'Descriere Pagină',
        subtitle: 'Text explicativ',
        content: 'Găsește vehiculul perfect pentru afacerea ta cu ajutorul expertizelor noastre'
      },
      'process-intro': {
        title: 'Introducere Proces',
        subtitle: 'Text deasupra pașilor',
        content: 'Procesul nostru simplu și transparent'
      }
    }
  },
  'contact': {
    id: 'contact',
    title: 'Pagina Contact',
    description: 'Conținutul paginii de contact',
    sections: {
      'header': {
        title: 'Header Pagină',
        subtitle: 'Titlu principal',
        content: 'Contactează-ne'
      },
      'description': {
        title: 'Descriere Pagină',
        subtitle: 'Text explicativ',
        content: 'Suntem aici să te ajutăm cu orice întrebare ai avea despre serviciile noastre'
      },
      'form-intro': {
        title: 'Introducere Formular',
        subtitle: 'Text deasupra formularului',
        content: 'Completează formularul de mai jos și te vom contacta în cel mai scurt timp'
      }
    }
  }
}

export function ContentManager() {
  const [contentData, setContentData] = useState<ContentData>(defaultContent)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    subtitle: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('admin-page-content')
    if (saved) {
      setContentData(JSON.parse(saved))
    } else {
      localStorage.setItem('admin-page-content', JSON.stringify(defaultContent))
    }
  }, [])

  const handleEdit = (pageId: string, sectionKey: string) => {
    const section = contentData[pageId].sections[sectionKey]
    setEditForm({
      title: section.title,
      content: section.content,
      subtitle: section.subtitle || ''
    })
    setEditingSection(`${pageId}-${sectionKey}`)
  }

  const handleSave = () => {
    if (!editingSection) return

    const [pageId, sectionKey] = editingSection.split('-')
    const updatedContent = {
      ...contentData,
      [pageId]: {
        ...contentData[pageId],
        sections: {
          ...contentData[pageId].sections,
          [sectionKey]: {
            title: editForm.title,
            content: editForm.content,
            subtitle: editForm.subtitle || undefined
          }
        }
      }
    }

    setContentData(updatedContent)
    localStorage.setItem('admin-page-content', JSON.stringify(updatedContent))
    setEditingSection(null)
    setEditForm({ title: '', content: '', subtitle: '' })
    
    toast({
      title: "Salvat cu succes",
      description: "Conținutul a fost actualizat",
    })
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditForm({ title: '', content: '', subtitle: '' })
  }

  const renderEditForm = () => {
    if (!editingSection) return null

    return (
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-800">Editează Secțiunea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titlu Secțiune</Label>
            <Input
              id="edit-title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
          </div>
          
          {editForm.subtitle !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="edit-subtitle">Subtitlu (opțional)</Label>
              <Input
                id="edit-subtitle"
                value={editForm.subtitle}
                onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                placeholder="Subtitlu secțiune"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="edit-content">Conținut</Label>
            <Textarea
              id="edit-content"
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              rows={4}
              placeholder="Conținutul secțiunii..."
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvează
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Anulează
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderPageContent = (pageId: string, page: PageContent) => (
    <TabsContent key={pageId} value={pageId} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {pageId === 'home' && <Home className="h-5 w-5" />}
        {pageId === 'stock' && <Car className="h-5 w-5" />}
        {pageId === 'sourcing' && <Users className="h-5 w-5" />}
        {pageId === 'contact' && <Mail className="h-5 w-5" />}
        <h3 className="text-lg font-semibold">{page.title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(page.sections).map(([sectionKey, section]) => (
          <Card key={sectionKey} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{section.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(pageId, sectionKey)}
                  className="h-8 px-2"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </CardTitle>
              {section.subtitle && (
                <p className="text-sm text-muted-foreground">{section.subtitle}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Editor Conținut</h2>
        <p className="text-sm text-muted-foreground">Modifică textul din diferitele secțiuni ale paginilor</p>
      </div>

      {renderEditForm()}

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Pagina Principală
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Stoc
          </TabsTrigger>
          <TabsTrigger value="sourcing" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sourcing
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        {Object.entries(contentData).map(([pageId, page]) => 
          renderPageContent(pageId, page)
        )}
      </Tabs>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Pentru a modifica conținutul, apasă butonul &quot;Editează&quot; de pe secțiunea dorită.</p>
            <p>Toate modificările vor fi salvate local și vor fi vizibile imediat pe site.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
