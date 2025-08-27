'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
  features?: string[];
  className?: string;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  features = [],
  className = '',
}: BenefitCardProps) {
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300 border-0 shadow-sm',
      className
    )}>
      <CardHeader className="pb-4">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300',
          bgColor
        )}>
          <Icon className={cn('h-6 w-6', color)} />
        </div>
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Features list */}
        {features.length > 0 && (
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-muted-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
