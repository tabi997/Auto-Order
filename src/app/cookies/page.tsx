import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica cookies | AutoOrder',
  description: 'Politica cookies AutoOrder - cum folosim cookie-urile pe site-ul nostru.',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Politica cookies</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground">
          Această pagină va conține politica cookies completă a AutoOrder.
        </p>
      </div>
    </div>
  );
}
