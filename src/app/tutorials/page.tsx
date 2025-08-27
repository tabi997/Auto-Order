import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutoriale | AutoOrder',
  description: 'Tutoriale AutoOrder - cum să folosești serviciile noastre de sourcing și licitații B2B.',
};

export default function TutorialsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Cum funcționează</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground">
          Această pagină va conține tutorialele complete despre cum să folosești serviciile AutoOrder.
        </p>
      </div>
    </div>
  );
}
