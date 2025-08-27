'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '@/i18n';

const testimonials = [
  {
    name: 'Ion Popescu',
    role: 'Dealer Auto',
    company: 'AutoMax București',
    rating: 5,
    contentKey: 'testimonials.testimonial1.content',
    avatar: '/avatars/ion-popescu.jpg',
    badge: 'testimonials.testimonial1.badge',
  },
  {
    name: 'Maria Ionescu',
    role: 'Manager Flotă',
    company: 'Transport Express',
    rating: 5,
    contentKey: 'testimonials.testimonial2.content',
    avatar: '/avatars/maria-ionescu.jpg',
    badge: 'testimonials.testimonial2.badge',
  },
  {
    name: 'Alexandru Dumitrescu',
    role: 'Proprietar',
    company: 'Firma Individuală',
    rating: 5,
    contentKey: 'testimonials.testimonial3.content',
    avatar: '/avatars/alexandru-dumitrescu.jpg',
    badge: 'testimonials.testimonial3.badge',
  },
  {
    name: 'Elena Vasilescu',
    role: 'Director Comercial',
    company: 'Auto Solutions',
    rating: 5,
    contentKey: 'testimonials.testimonial4.content',
    avatar: '/avatars/elena-vasilescu.jpg',
    badge: 'testimonials.testimonial4.badge',
  },
];

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t('testimonials.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
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
                  {t(testimonial.badge)}
                </Badge>
              </CardHeader>
              
              <CardContent>
                <blockquote className="text-muted-foreground leading-relaxed mb-4">
                  "{t(testimonial.contentKey)}"
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
            <Badge variant="default" className="text-lg px-6 py-3">
              {t('testimonials.cta.button')}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
