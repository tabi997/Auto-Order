'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, TrendingUp, Shield } from 'lucide-react';

const testimonials = [
  {
    name: "Mihai Popescu",
    location: "București",
    text: "Am primit VW Passat 2019 cu 2.000 € mai ieftin decât găsisem singur. Procesul a fost transparent și rapid.",
    rating: 5,
    vehicle: "VW Passat 2019"
  },
  {
    name: "Elena Dumitrescu",
    location: "Cluj",
    text: "BMW X3 perfect pentru nevoile mele. Echipa AutoOrder a fost profesionistă și mi-a explicat tot procesul clar.",
    rating: 5,
    vehicle: "BMW X3 2020"
  },
  {
    name: "Alexandru Ionescu",
    location: "Timișoara",
    text: "Recomand cu încredere! Am economisit timp și bani, iar mașina a ajuns exact cum mi s-a promis.",
    rating: 5,
    vehicle: "Audi A4 2018"
  }
];

const stats = [
  {
    value: "350+",
    label: "comenzi finalizate",
    icon: Users
  },
  {
    value: "96%",
    label: "livrări sub buget estimat",
    icon: TrendingUp
  },
  {
    value: "4.9/5",
    label: "rating clienți",
    icon: Star
  },
  {
    value: "100%",
    label: "garantat",
    icon: Shield
  }
];

const partners = [
  { name: "Openlane", logo: "/logos/openlane.svg" },
  { name: "ADESA", logo: "/logos/adesa.svg" },
  { name: "Transport Partner", logo: "/logos/transport.svg" }
];

export function SocialProof() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Ce spun clienții noștri
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Feedback real de la clienți mulțumiți
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-muted-foreground mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Vehicle info */}
                <div className="text-sm text-primary font-medium mb-2">
                  {testimonial.vehicle}
                </div>

                {/* Author */}
                <div className="text-sm text-muted-foreground">
                  {testimonial.name}, {testimonial.location}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partners */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8 text-muted-foreground">
            Parteneri de încredere
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 h-12 bg-muted rounded flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
