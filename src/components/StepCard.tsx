'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
  color?: string;
  bgColor?: string;
  details?: string[];
  className?: string;
}

export function StepCard({
  icon: Icon,
  title,
  description,
  stepNumber,
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  details = [],
  className = '',
}: StepCardProps) {
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300 text-center relative',
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10',
            bgColor
          )}>
            <Icon className={cn('h-8 w-8', color)} />
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-3">
          <Badge variant="outline" className="text-sm">
            Pasul {stepNumber}
          </Badge>
        </div>
        
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Step details */}
        {details.length > 0 && (
          <div className="space-y-2 text-left">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
