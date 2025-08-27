import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termeni și condiții | AutoOrder',
  description: 'Termeni și condiții AutoOrder - regulile de utilizare a serviciilor noastre.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Termeni și condiții</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground">
          Această pagină va conține termenii și condițiile complete ale AutoOrder.
        </p>
      </div>
    </div>
  );
}
