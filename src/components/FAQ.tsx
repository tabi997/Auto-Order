'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function FAQ() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>(['item-1']);

  const faqItems = [
    {
      id: 'item-1',
      question: t('faq.items.q1'),
      answer: t('faq.items.a1'),
    },
    {
      id: 'item-2',
      question: t('faq.items.q2'),
      answer: t('faq.items.a2'),
    },
    {
      id: 'item-3',
      question: t('faq.items.q3'),
      answer: t('faq.items.a3'),
    },
    {
      id: 'item-4',
      question: t('faq.items.q4'),
      answer: t('faq.items.a4'),
    },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
              <AccordionTrigger className="text-left hover:no-underline">
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
  );
}
