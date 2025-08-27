import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDPR | AutoOrder',
  description: 'Informații GDPR AutoOrder - drepturile tale privind prelucrarea datelor personale.',
};

export default function GDPRPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">GDPR - Drepturile tale</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground">
          Această pagină va conține informațiile complete despre drepturile GDPR ale AutoOrder.
        </p>
      </div>
    </div>
  );
}
