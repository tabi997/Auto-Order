'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Image, File, Upload, Trash2, Download, Eye, Copy } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'document' | 'video'
  url: string
  size: number
  uploadedAt: string
  alt?: string
  description?: string
}

const defaultMedia: MediaItem[] = [
  {
    id: '1',
    name: 'logo.png',
    type: 'image',
    url: '/logo.png',
    size: 24576,
    uploadedAt: '2024-01-15',
    alt: 'Logo AutoOrder',
    description: 'Logo-ul principal al companiei'
  },
  {
    id: '2',
    name: 'hero-bg.jpg',
    type: 'image',
    url: '/hero-bg.jpg',
    size: 1024000,
    uploadedAt: '2024-01-15',
    alt: 'Background imagine hero',
    description: 'Imaginea de fundal pentru secțiunea hero'
  },
  {
    id: '3',
    name: 'brochure.pdf',
    type: 'document',
    url: '/brochure.pdf',
    size: 2048000,
    uploadedAt: '2024-01-10',
    description: 'Broșura companiei în format PDF'
  }
]

export function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultMedia)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-media-items')
    if (saved) {
      setMediaItems(JSON.parse(saved))
    } else {
      localStorage.setItem('admin-media-items', JSON.stringify(defaultMedia))
    }
  }, [])

  const saveMedia = (newMedia: MediaItem[]) => {
    setMediaItems(newMedia)
    localStorage.setItem('admin-media-items', JSON.stringify(newMedia))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: selectedFile.type.startsWith('image/') ? 'image' : 
            selectedFile.type.startsWith('video/') ? 'video' : 'document',
      url: URL.createObjectURL(selectedFile),
      size: selectedFile.size,
      uploadedAt: new Date().toISOString().split('T')[0],
      description: `Fișier încărcat: ${selectedFile.name}`
    }
    
    saveMedia([...mediaItems, newMedia])
    setSelectedFile(null)
    setUploading(false)
    
    toast({
      title: "Încărcat cu succes",
      description: "Fișierul a fost încărcat",
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi acest fișier?')) {
      const filtered = mediaItems.filter(item => item.id !== id)
      saveMedia(filtered)
      toast({
        title: "Șters cu succes",
        description: "Fișierul a fost șters",
      })
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copiat",
      description: "URL-ul a fost copiat în clipboard",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />
      case 'video':
        return <File className="h-8 w-8 text-red-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const renderUploadSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Încarcă Fișier Nou
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Selectează Fișier</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx"
            disabled={uploading}
          />
        </div>
        
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <File className="h-4 w-4" />
            <span>{selectedFile.name}</span>
            <Badge variant="outline">{formatFileSize(selectedFile.size)}</Badge>
          </div>
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Se încarcă...' : 'Încarcă'}
        </Button>
      </CardContent>
    </Card>
  )

  const renderMediaGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mediaItems.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(item.type)}
                <div>
                  <div className="font-semibold text-sm truncate max-w-32">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.type === 'image' ? 'Imagine' : 
                 item.type === 'video' ? 'Video' : 'Document'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {item.type === 'image' && (
              <div className="aspect-video bg-muted rounded overflow-hidden">
                <img 
                  src={item.url} 
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {item.description && (
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
            
            <div className="text-xs text-muted-foreground">
              Încărcat: {item.uploadedAt}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(item.url)}
                className="flex-1 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiază URL
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.url, '_blank')}
                className="flex-1 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Vezi
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Biblioteca Media</h2>
        <p className="text-sm text-gray-600">Gestionează toate fișierele media ale site-ului</p>
      </div>

      {renderUploadSection()}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Fișiere ({mediaItems.length})</h3>
          <p className="text-sm text-muted-foreground">Toate fișierele încărcate</p>
        </div>
      </div>

      {renderMediaGrid()}

      {mediaItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nu există fișiere media încă.</p>
          <p className="text-sm">Încarcă primul fișier pentru a începe.</p>
        </div>
      )}
    </div>
  )
}
