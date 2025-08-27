'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useHomeTranslation } from '@/i18n';
import Script from 'next/script';

export function FAQ() {
  const { t } = useHomeTranslation();
  const [openItems, setOpenItems] = useState<string[]>(['item-1']);

  const faqItems = [
    {
      id: 'item-1',
      question: t('faq.items.0.q'),
      answer: t('faq.items.0.a'),
    },
    {
      id: 'item-2',
      question: t('faq.items.1.q'),
      answer: t('faq.items.1.a'),
    },
    {
      id: 'item-3',
      question: t('faq.items.2.q'),
      answer: t('faq.items.2.a'),
    },
    {
      id: 'item-4',
      question: t('faq.items.3.q'),
      answer: t('faq.items.3.a'),
    },
    {
      id: 'item-5',
      question: t('faq.items.4.q'),
      answer: t('faq.items.4.a'),
    },
    {
      id: 'item-6',
      question: t('faq.items.5.q'),
      answer: t('faq.items.5.a'),
    },
    {
      id: 'item-7',
      question: t('faq.items.6.q'),
      answer: t('faq.items.6.a'),
    },
    {
      id: 'item-8',
      question: t('faq.items.7.q'),
      answer: t('faq.items.7.a'),
    },
    {
      id: 'item-9',
      question: t('faq.items.8.q'),
      answer: t('faq.items.8.a'),
    },
    {
      id: 'item-10',
      question: t('faq.items.9.q'),
      answer: t('faq.items.9.a'),
    },
  ];

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6" />
            {t('faq.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="w-full"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b">
                <AccordionTrigger className="text-left hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
