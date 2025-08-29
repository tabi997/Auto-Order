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
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-8 px-6 py-3 text-sm font-medium border-slate-200 text-slate-600 bg-white/80 backdrop-blur-sm">
            Întrebări frecvente
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
            Răspunsuri la întrebările tale
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Tot ce trebuie să știi despre procesul AutoOrder. 
            Suntem aici să răspundem la toate întrebările tale.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 mb-24">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-500 bg-white hover:bg-slate-50/50 overflow-hidden group border border-slate-100">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-6 text-left font-medium hover:bg-slate-50 transition-all duration-300 group"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 border border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
                        <HelpCircle className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 bg-white">
                            {faq.category}
                          </Badge>
                        </div>
                        <span className="pr-4 text-base md:text-lg leading-relaxed font-medium text-slate-900">{faq.question}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="h-6 w-6 text-slate-600 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-slate-400 group-hover:text-slate-600 transition-all duration-300" />
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
                          <div className="border-t border-slate-100 pt-6">
                            <p className="text-slate-600 leading-relaxed text-base md:text-lg font-light">
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
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="bg-white rounded-3xl p-12 md:p-16 max-w-4xl mx-auto border border-slate-100 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-light mb-6 text-slate-900">
              Ai alte întrebări?
            </h3>
            <p className="text-lg text-slate-600 mb-10 font-light">
              Suntem aici să te ajutăm să faci alegerea potrivită. 
              Contactează-ne pentru orice clarificări suplimentare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
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
                className="text-lg px-8 py-6 h-auto border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 transform hover:scale-105"
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
