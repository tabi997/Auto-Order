'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
  className?: string;
}

export function FAQItem({ question, answer, value, className = '' }: FAQItemProps) {
  return (
    <AccordionItem 
      value={value} 
      className={cn(
        'bg-background rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline group">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {question}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <div className="pl-11">
          <p className="text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
