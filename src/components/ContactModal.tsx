'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/app/contact/ContactForm';
import { MessageSquare, X } from 'lucide-react';

interface ContactModalProps {
  trigger?: React.ReactNode;
  defaultRequestType?: 'offer' | 'evaluation' | 'question' | 'partnership';
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContactModal({ 
  trigger, 
  defaultRequestType = 'offer',
  title = 'Contactează-ne',
  description = 'Completează formularul și te vom contacta în cel mai scurt timp',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: ContactModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  const handleClose = () => {
    onOpenChange(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="gap-2">
      <MessageSquare className="h-4 w-4" />
      Contact
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <p className="text-muted-foreground text-center mt-2">
            {description}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-6">
          <ContactForm 
            defaultRequestType={defaultRequestType}
            onSuccess={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Floating Contact Button Component
export function FloatingContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/90"
        size="lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <ContactModal
        open={open}
        onOpenChange={setOpen}
        title="Contact rapid"
        description="Ai o întrebare? Vrei o ofertă? Suntem aici să te ajutăm!"
      />
    </>
  );
}

// Quick Contact Button with predefined request type
export function QuickContactButton({ 
  requestType, 
  children, 
  variant = "default",
  size = "default" 
}: {
  requestType: 'offer' | 'evaluation' | 'question' | 'partnership';
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const [open, setOpen] = useState(false);

  const getTitle = () => {
    switch (requestType) {
      case 'offer': return 'Cere o ofertă personalizată';
      case 'evaluation': return 'Solicită o evaluare gratuită';
      case 'question': return 'Ai o întrebare?';
      case 'partnership': return 'Propune un parteneriat';
      default: return 'Contactează-ne';
    }
  };

  const getDescription = () => {
    switch (requestType) {
      case 'offer': return 'Completează detaliile și primești o ofertă personalizată în maxim 2 ore';
      case 'evaluation': return 'Evaluăm nevoile tale și îți oferim recomandări personalizate';
      case 'question': return 'Răspundem la toate întrebările tale despre serviciile noastre';
      case 'partnership': return 'Discutăm oportunități de colaborare și parteneriat';
      default: return 'Completează formularul și te vom contacta în cel mai scurt timp';
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        {children}
      </Button>

      <ContactModal
        open={open}
        onOpenChange={setOpen}
        defaultRequestType={requestType}
        title={getTitle()}
        description={getDescription()}
      />
    </>
  );
}
