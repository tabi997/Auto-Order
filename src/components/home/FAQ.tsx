'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: "Ce garanții oferiți pentru mașinile din licitații?",
    answer: "Furnizăm raport tehnic detaliat, istoricul de service disponibil și, când este posibil, test OBD. Pentru vânzările B2B, garanțiile sunt limitate conform condițiilor vânzătorului, dar îți explicăm clar ce acoperă fiecare caz înainte de decizie.",
    category: "Garanții"
  },
  {
    question: "Care este termenul de livrare pentru o mașină?",
    answer: "Termenul tipic este de 14-21 zile lucrătoare din momentul plății, în funcție de distanță, formalități și slotul de transport disponibil. Pentru mașini din țări mai apropiate, livrarea poate fi și mai rapidă.",
    category: "Livrare"
  },
  {
    question: "Ce taxe și costuri suplimentare sunt implicate?",
    answer: "Costul total include: prețul vehiculului + comisionul nostru de intermediere + taxele platformei (dacă există) + transportul asigurat + costurile de înmatriculare/RAR în România. Îți oferim mereu o estimare scrisă detaliată înainte de decizie.",
    category: "Costuri"
  },
  {
    question: "Este necesar un avans pentru rezervarea mașinii?",
    answer: "Da, după ce confirmi oferta, este necesar un avans de 10-20% din valoarea totală pentru a rezerva vehiculul. Restul sumei se plătește înainte de transport. Toate plățile se fac prin transfer bancar securizat.",
    category: "Plăți"
  },
  {
    question: "Ce verificări efectuați înainte de achiziție?",
    answer: "Verificăm istoricul complet al mașinii, raportul tehnic, fotografiile detaliate, și când este posibil, efectuăm un test OBD. Analizăm și documentele pentru a ne asigura că totul este în regulă înainte de achiziție.",
    category: "Verificări"
  },
  {
    question: "Cine se ocupă de actele și înmatricularea în România?",
    answer: "Noi ne ocupăm de tot procesul: organizăm transportul asigurat, colectăm toate documentele necesare (factura, CMR, fișa tehnică) și pregătim dosarul complet pentru RAR și înmatriculare în România.",
    category: "Acte"
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">
            Întrebări frecvente
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Răspunsuri la întrebările tale
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tot ce trebuie să știi despre procesul AutoOrder. 
            Suntem aici să răspundem la toate întrebările tale.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 mb-20">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-6 text-left font-medium hover:bg-muted/50 transition-all duration-300 group"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <span className="pr-4 text-lg leading-relaxed">{faq.question}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="h-6 w-6 text-primary transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-all duration-300" />
                      )}
                    </div>
                  </Button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-muted/50 pt-6">
                            <p className="text-muted-foreground leading-relaxed text-lg">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ai alte întrebări?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Suntem aici să te ajutăm să faci alegerea potrivită. 
              Contactează-ne pentru orice clarificări suplimentare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  Cere ofertă personalizată
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 h-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
              >
                <a href="/contact">
                  Contactează-ne
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
