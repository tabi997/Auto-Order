'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/app/contact/ContactForm';
import { FaComments, FaTimes, FaArrowDown } from 'react-icons/fa';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

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
      <FaComments className="h-4 w-4" />
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
            <FaTimes className="h-4 w-4" />
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
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = useScrollVisibility(100);

  // Debounced hover state to prevent excessive re-renders
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle mobile touch events
  const handleTouchStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Delay hiding to allow for touch interactions
    setTimeout(() => setIsHovered(false), 1000);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  }, []);

  return (
    <>
      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } ${
          // Responsive positioning with orientation support
          'bottom-4 right-4 sm:bottom-6 sm:right-6'
        } ${
          // Handle landscape orientation on mobile
          'landscape:bottom-2 landscape:right-2 sm:landscape:bottom-6 sm:landscape:right-6'
        }`}
        role="complementary"
        aria-label="Contact rapid"
      >
        <Button
          onClick={() => setOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          variant="outline"
          className="relative rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 group focus:ring-4 focus:ring-primary/20 focus:outline-none ${
            // Responsive sizing
            'h-14 w-14 sm:h-16 sm:w-16'
          } ${
            // Reduced motion support
            'motion-reduce:transition-none'
          }"
          size="lg"
          aria-label="Deschide formularul de contact"
          title="Contact rapid"
        >
          <div className="relative">
            <FaComments 
              className={`transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${
                // Responsive icon sizing
                'h-5 w-5 sm:h-6 sm:w-6'
              } ${
                // Reduced motion support
                'motion-reduce:transition-transform-none'
              }`} 
              aria-hidden="true"
            />
            {/* Enhanced notification indicator with subtle animation */}
            <div 
              className="absolute -top-1 -right-1 bg-destructive rounded-full ${
                // Responsive indicator sizing
                'h-2.5 w-2.5 sm:h-3 sm:w-3'
              } ${
                // Subtle animation that's less distracting
                'animate-ping motion-reduce:animate-none'
              }"
              aria-label="Contact rapid disponibil"
              role="status"
            />
            {/* Static indicator for better visibility */}
            <div 
              className="absolute -top-1 -right-1 bg-destructive rounded-full ${
                // Responsive indicator sizing
                'h-2.5 w-2.5 sm:h-3 sm:w-3'
              }"
              aria-hidden="true"
            />
          </div>
          
          {/* Enhanced tooltip with better positioning and accessibility */}
          <div 
            className="absolute opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10 ${
              // Responsive tooltip positioning
              'right-full mr-2 sm:mr-3 top-1/2 transform -translate-y-1/2'
            } ${
              // Hide tooltip on mobile to prevent layout issues
              'hidden sm:block'
            }"
            role="tooltip"
            aria-hidden="true"
          >
            <div className="bg-popover text-popover-foreground text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap shadow-lg border border-border">
              Contact rapid
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-popover border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
          </div>
        </Button>

        {/* Mobile-friendly alternative text */}
        <div className="block sm:hidden mt-2 text-center">
          <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
            Contact
          </span>
        </div>
      </div>

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
