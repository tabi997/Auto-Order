'use client';

import { useState } from 'react';
import { LocalImageUploader } from '@/components/LocalImageUploader';

interface ImageData {
  id?: string;
  url: string;
  alt?: string;
}

export default function TestUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);

  const handleImagesUploaded = (images: ImageData[]) => {
    console.log('TestUploadPage - handleImagesUploaded called with:', images);
    setUploadedImages(images);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Test Local Image Upload
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Component
          </h2>
          <LocalImageUploader
            onImagesUploaded={handleImagesUploaded}
            maxFiles={5}
            maxFileSize={4}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Uploaded Images State
          </h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Total images: {uploadedImages.length}
            </p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <div className="text-xs text-gray-600">
                    <p><strong>URL:</strong> {image.url}</p>
                    <p><strong>Alt:</strong> {image.alt || 'N/A'}</p>
                    <p><strong>Index:</strong> {index}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Raw State Data:
            </h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(uploadedImages, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
