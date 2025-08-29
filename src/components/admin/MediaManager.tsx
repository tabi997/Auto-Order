'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CloudinaryUploader } from './CloudinaryUploader';
import { Image, Upload, Copy, ExternalLink, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: string;
  type: string;
  uploadedAt: Date;
}

export function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleImageUpload = (url: string) => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      url,
      filename: `image_${Date.now()}`,
      size: 'Unknown',
      type: 'image',
      uploadedAt: new Date(),
    };
    
    setMediaItems(prev => [newItem, ...prev]);
    
    toast({
      title: 'Success',
      description: 'Image uploaded successfully',
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Success',
        description: 'URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: 'Success',
        description: 'Image download started',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  const filteredMedia = mediaItems.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Imagini</span>
          </CardTitle>
          <CardDescription>
            Upload imagini pentru Hero, SEO și alte secțiuni ale site-ului
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CloudinaryUploader
            label="Upload Imagine"
            onUpload={handleImageUpload}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search media</Label>
          <Input
            id="search"
            placeholder="Caută în media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredMedia.length} item{filteredMedia.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Image Preview */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 truncate" title={item.filename}>
                      {item.filename}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.size} • {item.type}
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    {item.uploadedAt.toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1"
                    title="Copy URL"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(item.url, item.filename)}
                    title="Download"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No media found' : 'No media uploaded yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Upload your first image to get started'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Cum să folosești Media Manager</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-2 text-sm">
            <p>• <strong>Upload imagini:</strong> Drag & drop sau click pentru a selecta fișiere</p>
            <p>• <strong>Copy URL:</strong> Folosește URL-ul pentru a seta imagini în Hero, SEO sau alte secțiuni</p>
            <p>• <strong>Organizare:</strong> Toate imaginile sunt salvate în Cloudinary și optimizate automat</p>
            <p>• <strong>Compatibilitate:</strong> Suportă JPG, PNG, GIF cu dimensiuni maxime de 10MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
