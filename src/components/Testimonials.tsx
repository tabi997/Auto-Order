'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { useHomeTranslation } from '@/i18n';
import { useTestimonials } from '@/lib/hooks/useTestimonials';
import Link from 'next/link';

export function Testimonials() {
  const { t } = useHomeTranslation();
  const { testimonials, loading, error } = useTestimonials();

  if (loading) {
    return (
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              {t('testimonials.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('testimonials.subtitle')}
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              {t('testimonials.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('testimonials.subtitle')}
            </h2>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Nu sunt testimoniale disponibile momentan.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('testimonials.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('testimonials.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-md transition-all duration-300 rounded-2xl shadow-sm h-full flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12">
                    {testimonial.avatar ? (
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Quote className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {testimonial.badge}
                </Badge>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <blockquote className="text-muted-foreground leading-relaxed mb-4 flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <div className="border-t pt-4 mt-auto">
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}{testimonial.company ? ` • ${testimonial.company}` : ''}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('testimonials.cta.title')}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('testimonials.cta.description')}
            </p>
            <Button asChild size="lg" className="px-6 py-3">
              <Link href="/contact?type=reference" aria-label="Cere referință AutoOrder">
                {t('testimonials.cta.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
