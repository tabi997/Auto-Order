'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { useHomeTranslation } from '@/i18n';
import Link from 'next/link';

const testimonials = [
  {
    name: 'Ion Popescu',
    role: 'Dealer Auto',
    company: 'AutoMax București',
    rating: 5,
    content: 'AutoOrder mi-a găsit exact mașina pe care o căutam, la un preț excelent. Procesul a fost transparent și rapid.',
    avatar: '/avatars/ion-popescu.jpg',
    badge: 'Dealer verificat',
  },
  {
    name: 'Maria Ionescu',
    role: 'Manager Flotă',
    company: 'Transport Express',
    rating: 5,
    content: 'Pentru flota noastră, AutoOrder a fost soluția perfectă. Am economisit timp și bani cu sourcing-ul lor.',
    avatar: '/avatars/maria-ionescu.jpg',
    badge: 'Client fidel',
  },
  {
    name: 'Alexandru Dumitrescu',
    role: 'Proprietar',
    company: 'Firma Individuală',
    rating: 5,
    content: 'Prima dată când am folosit serviciul și am fost impresionat de profesionalism. Recomand cu încredere.',
    avatar: '/avatars/alexandru-dumitrescu.jpg',
    badge: 'Prima achiziție',
  },
  {
    name: 'Elena Vasilescu',
    role: 'Director Comercial',
    company: 'Auto Solutions',
    rating: 5,
    content: 'Colaborarea cu AutoOrder ne-a permis să extindem oferta cu vehicule de calitate la prețuri competitive.',
    avatar: '/avatars/elena-vasilescu.jpg',
    badge: 'Partener de afaceri',
  },
];

export function Testimonials() {
  const { t } = useHomeTranslation();

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
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-md transition-all duration-300 rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
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
              
              <CardContent>
                <blockquote className="text-muted-foreground leading-relaxed mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
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
