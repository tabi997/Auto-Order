'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UploadButton from '@/components/UploadButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface UploadResult {
  url: string;
  public_id: string;
}

export function UploadTestContent() {
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);

  const handleUploaded = (results: UploadResult[]) => {
    setUploadedImages(prev => [...prev, ...results]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copiat',
        description: 'URL-ul a fost copiat în clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const removeImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.public_id !== publicId));
  };

  const clearAll = () => {
    setUploadedImages([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Încarcă imagini</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadButton
            folder="auto-order/test"
            onUploaded={handleUploaded}
            onStart={() => {
              console.log('🔍 UploadTestContent - Upload started');
            }}
            onError={(err) => {
              console.error('❌ UploadTestContent - Upload error:', err);
            }}
          />
          <p className="text-sm text-muted-foreground">
            Acceptă imagini (JPG, PNG, WebP, etc.) până la 10MB fiecare.
          </p>
        </CardContent>
      </Card>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Imagini încărcate ({uploadedImages.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Șterge toate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={image.public_id} className="border rounded-lg p-4 space-y-3">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Image Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {image.public_id.split('/').pop()}
                      </Badge>
                    </div>

                    {/* URL Display */}
                    <div className="text-xs text-muted-foreground break-all">
                      {image.url}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(image.url)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiază URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={image.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Deschide
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeImage(image.public_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Șterge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucțiuni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium mb-2">Configurare Cloudinary:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Creează un cont gratuit pe <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cloudinary.com</a></li>
              <li>În Dashboard, găsește Cloud Name, API Key și API Secret</li>
              <li>Adaugă variabilele în fișierul .env:</li>
            </ol>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Funcționalități:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Upload multiple imagini simultan</li>
              <li>Validare tip fișier (doar imagini)</li>
              <li>Limită dimensiune 10MB per fișier</li>
              <li>Upload semnat și securizat</li>
              <li>Preview imagini încărcate</li>
              <li>Copiere URL în clipboard</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
