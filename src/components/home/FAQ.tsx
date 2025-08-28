'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Ce garanții oferiți pentru mașinile din licitații?",
    answer: "Furnizăm raport tehnic detaliat, istoricul de service disponibil și, când este posibil, test OBD. Pentru vânzările B2B, garanțiile sunt limitate conform condițiilor vânzătorului, dar îți explicăm clar ce acoperă fiecare caz înainte de decizie."
  },
  {
    question: "Care este termenul de livrare pentru o mașină?",
    answer: "Termenul tipic este de 14-21 zile lucrătoare din momentul plății, în funcție de distanță, formalități și slotul de transport disponibil. Pentru mașini din țări mai apropiate, livrarea poate fi și mai rapidă."
  },
  {
    question: "Ce taxe și costuri suplimentare sunt implicate?",
    answer: "Costul total include: prețul vehiculului + comisionul nostru de intermediere + taxele platformei (dacă există) + transportul asigurat + costurile de înmatriculare/RAR în România. Îți oferim mereu o estimare scrisă detaliată înainte de decizie."
  },
  {
    question: "Este necesar un avans pentru rezervarea mașinii?",
    answer: "Da, după ce confirmi oferta, este necesar un avans de 10-20% din valoarea totală pentru a rezerva vehiculul. Restul sumei se plătește înainte de transport. Toate plățile se fac prin transfer bancar securizat."
  },
  {
    question: "Ce verificări efectuați înainte de achiziție?",
    answer: "Verificăm istoricul complet al mașinii, raportul tehnic, fotografiile detaliate, și când este posibil, efectuăm un test OBD. Analizăm și documentele pentru a ne asigura că totul este în regulă înainte de achiziție."
  },
  {
    question: "Cine se ocupă de actele și înmatricularea în România?",
    answer: "Noi ne ocupăm de tot procesul: organizăm transportul asigurat, colectăm toate documentele necesare (factura, CMR, fișa tehnică) și pregătim dosarul complet pentru RAR și înmatriculare în România."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Întrebări frecvente
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Răspunsuri la întrebările tale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tot ce trebuie să știi despre procesul AutoOrder
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-6 text-left font-medium hover:bg-muted/50"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0" />
                  )}
                </Button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ai alte întrebări? Suntem aici să te ajutăm să faci alegerea potrivită.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="#lead-quick">
                Cere ofertă personalizată
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/contact">
                Contactează-ne
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
