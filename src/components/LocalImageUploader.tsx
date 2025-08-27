'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageData {
  id?: string;
  url: string;
  alt?: string;
}

interface LocalImageUploaderProps {
  onImagesUploaded: (images: ImageData[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  listingId?: string; // ID-ul listing-ului pentru organizarea fișierelor
}

export function LocalImageUploader({ 
  onImagesUploaded, 
  maxFiles = 8, 
  maxFileSize = 4,
  listingId
}: LocalImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const oversizedFiles = Array.from(files).filter(
      file => file.size > maxFileSize * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `Maximum file size is ${maxFileSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      // Add listingId for organization (use temp ID if not available)
      formData.append('listingId', listingId || 'temp-' + Date.now());
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const newImages: ImageData[] = result.urls.map((url: string) => ({
          url: url,
          alt: '',
        }));
        
        console.log('LocalImageUploader - New images:', newImages);
        console.log('LocalImageUploader - Current uploaded images:', uploadedImages);
        
        const allImages = [...uploadedImages, ...newImages];
        setUploadedImages(allImages);
        
        console.log('LocalImageUploader - Calling onImagesUploaded with NEW images only:', newImages);
        // FIXED: Pass only the new images, not all images
        onImagesUploaded(newImages);
        
        toast({
          title: "Upload successful",
          description: `${result.urls.length} image(s) uploaded`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [maxFiles, maxFileSize, uploadedImages, onImagesUploaded]);

  const removeImage = useCallback((index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    // FIXED: Pass the updated list when removing images
    onImagesUploaded(newImages);
  }, [uploadedImages, onImagesUploaded]);

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label htmlFor="local-image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isUploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max {maxFiles} files, {maxFileSize}MB each
            </p>
          </div>
        </label>
        <input
          id="local-image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.alt || `Uploaded image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
          Uploading images...
        </div>
      )}
    </div>
  );
}
