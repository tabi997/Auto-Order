'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ImageOff, Upload } from 'lucide-react';
import Image from 'next/image';
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
  listingId?: string;
}

export function AdminImagesUploader({ 
  initialImages = [], 
  onChange, 
  maxImages = 8,
  listingId
}: AdminImagesUploaderProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    console.log('Starting upload for file:', file.name, 'Size:', file.size);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'autoorder_unsigned');
    formData.append('folder', `auto-order/listings/${listingId || 'temp'}`);

    console.log('Upload preset:', 'autoorder_usigned');
    console.log('Folder:', `auto-order/listings/${listingId || 'temp'}`);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dccnyvv0j/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    console.log('File upload started. Files:', files.length);
    console.log('Available slots:', maxImages - images.length);

    setIsUploading(true);
    const availableSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    console.log('Files to upload:', filesToUpload.length);

    try {
      const uploadPromises = filesToUpload.map(uploadToCloudinary);
      const urls = await Promise.all(uploadPromises);

      console.log('Upload completed. URLs:', urls);

      const newImages = urls.map(url => ({
        url,
        alt: '',
      }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onChange(updatedImages);

      toast({
        title: "Upload reușit",
        description: `${newImages.length} imagine(i) încărcat(e) cu succes`,
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Eroare upload",
        description: "Nu s-a putut încărca imaginea",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, onChange, toast, listingId]);

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
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click pentru a încărca</span> sau trage și plasează
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max. 4MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
              </label>
            </div>
            {isUploading && (
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Se încarcă...
              </div>
            )}
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
