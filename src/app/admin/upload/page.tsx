import { Metadata } from 'next';
import { UploadTestContent } from './UploadTestContent';

export const metadata: Metadata = {
  title: 'Test Upload - Admin',
  description: 'Test page for Cloudinary upload functionality',
};

export default function UploadTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Upload Cloudinary</h1>
        <UploadTestContent />
      </div>
    </div>
  );
}
