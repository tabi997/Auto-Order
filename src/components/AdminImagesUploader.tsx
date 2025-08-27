'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, ImageOff } from 'lucide-react';
import Image from 'next/image';

interface ImageData {
  id?: string;
  url: string;
  alt?: string;
}

interface AdminImagesUploaderProps {
  initialImages?: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
}

export function AdminImagesUploader({ 
  initialImages = [], 
  onChange, 
  maxImages = 8 
}: AdminImagesUploaderProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const addImage = useCallback(() => {
    if (!newImageUrl.trim()) return;
    if (images.length >= maxImages) return;

    const newImage: ImageData = {
      url: newImageUrl.trim(),
      alt: newImageAlt.trim() || undefined,
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onChange(updatedImages);
    
    setNewImageUrl('');
    setNewImageAlt('');
  }, [images, newImageUrl, newImageAlt, maxImages, onChange]);

  const removeImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  }, [images, onChange]);

  const updateImageAlt = useCallback((index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], alt: alt || undefined };
    setImages(updatedImages);
    onChange(updatedImages);
  }, [images, onChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">
          Imagini (max {maxImages})
        </Label>
        <p className="text-sm text-muted-foreground">
          Adaugă URL-uri pentru imagini. Prima imagine va fi folosită ca imagine de copertă.
        </p>
      </div>

      {/* Add new image form */}
      {canAddMore && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="new-image-url">URL imagine *</Label>
                <Input
                  id="new-image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-image-alt">Text alternativ</Label>
                <Input
                  id="new-image-alt"
                  placeholder="Descriere imagine (opțional)"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <Button 
              onClick={addImage} 
              disabled={!newImageUrl.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adaugă imagine
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Images list */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-3">
                <div className="relative aspect-[4/3] mb-3">
                  <Image
                    src={image.url}
                    alt={image.alt || `Imagine ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                    onError={(e) => {
                      // Fallback pentru imagini care nu se pot încărca
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-muted flex items-center justify-center rounded-md">
                            <div class="text-center">
                              <ImageOff class="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p class="text-xs text-muted-foreground">Imagine indisponibilă</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Copertă
                      </span>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                    aria-label="Șterge imaginea"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Text alternativ</Label>
                    <Input
                      value={image.alt || ''}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Descriere imagine"
                      size={1}
                      className="text-xs"
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate">
                    {image.url}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="text-sm text-muted-foreground">
        {images.length} / {maxImages} imagini
      </div>
    </div>
  );
}
