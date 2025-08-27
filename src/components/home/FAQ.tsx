'use client';

import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useState } from 'react';

const faqs = [
  {
    questionKey: 'homeFaq.question1',
    answerKey: 'homeFaq.answer1',
    category: 'general',
  },
  {
    questionKey: 'homeFaq.question2',
    answerKey: 'homeFaq.answer2',
    category: 'process',
  },
  {
    questionKey: 'homeFaq.question3',
    answerKey: 'homeFaq.answer3',
    category: 'pricing',
  },
  {
    questionKey: 'homeFaq.question4',
    answerKey: 'homeFaq.answer4',
    category: 'delivery',
  },
  {
    questionKey: 'homeFaq.question5',
    answerKey: 'homeFaq.answer5',
    category: 'quality',
  },
  {
    questionKey: 'homeFaq.question6',
    answerKey: 'homeFaq.answer6',
    category: 'support',
  },
];

export function FAQ() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('homeFaq.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('homeFaq.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('homeFaq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion 
            type="multiple" 
            value={openItems}
            onValueChange={setOpenItems}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-lg border shadow-sm"
              >
                <AccordionTrigger 
                  className="px-6 py-4 hover:no-underline group"
                  onClick={() => handleToggle(`item-${index}`)}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t(faq.questionKey)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="pl-11">
                    <p className="text-muted-foreground leading-relaxed">
                      {t(faq.answerKey)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('homeFaq.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('homeFaq.cta.description')}
            </p>
            <Badge variant="default" className="text-lg px-6 py-3">
              {t('homeFaq.cta.button')}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
