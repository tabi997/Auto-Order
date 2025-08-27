'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'highlighted' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = 'default',
  size = 'md',
  className = '',
}: FeatureCardProps) {
  const variantClasses = {
    default: 'bg-background border-border hover:shadow-lg',
    highlighted: 'bg-primary/5 border-primary/20 hover:shadow-lg hover:border-primary/30',
    muted: 'bg-muted/50 border-muted hover:shadow-md',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconContainerSizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  return (
    <Card className={cn(
      'group transition-all duration-300 border-0 shadow-sm',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      <CardHeader className="pb-4">
        <div className={cn(
          'w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300',
          iconContainerSizes[size]
        )}>
          <Icon className={cn('text-primary', iconSizes[size])} />
        </div>
        <CardTitle className={cn(
          'font-semibold',
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={cn(
          'text-muted-foreground leading-relaxed',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
