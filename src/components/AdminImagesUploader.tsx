'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ImageOff, Upload } from 'lucide-react';
import Image from 'next/image';
import { UploadButton } from './UploadThingProvider';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const addImage = useCallback((url: string) => {
    if (images.length >= maxImages) {
      toast({
        title: "Limită atinsă",
        description: `Nu poți încărca mai mult de ${maxImages} imagini.`,
        variant: "destructive",
      });
      return;
    }

    const newImage: ImageData = {
      url,
      alt: '',
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onChange(updatedImages);
  }, [images, maxImages, onChange, toast]);

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

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">
          Imagini (max {maxImages})
        </h3>
        <p className="text-sm text-muted-foreground">
          Încarcă imagini pentru vehicul. Prima imagine va fi folosită ca imagine de copertă.
        </p>
      </div>

      {/* Upload Button */}
      {canAddMore && (
        <Card>
          <CardContent className="p-4">
            <UploadButton
              endpoint="listingImages"
              onClientUploadComplete={(res: any) => {
                if (res && res.length > 0) {
                  res.forEach((file: any) => {
                    if (file.url) {
                      addImage(file.url);
                    }
                  });
                  toast({
                    title: "Succes",
                    description: "Imaginea a fost încărcată cu succes!",
                  });
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Eroare",
                  description: `Eroare la încărcarea imaginii: ${error.message}`,
                  variant: "destructive",
                });
              }}
              onUploadBegin={(fileName: string) => {
                console.log("Upload started for:", fileName);
              }}
              className="w-full"
              appearance={{
                button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md",
                allowedContent: "text-muted-foreground text-xs",
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group">
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
                  
                  {/* Cover Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Copertă
                      </span>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    aria-label="Șterge imaginea"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Image Details */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Text alternativ</label>
                    <input
                      value={image.alt || ''}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Descriere imagine"
                      className="w-full text-xs px-2 py-1 border rounded-md"
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
