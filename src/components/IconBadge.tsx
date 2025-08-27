'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconBadge({ 
  icon: Icon, 
  children, 
  variant = 'default',
  size = 'md',
  className 
}: IconBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Badge 
      variant={variant} 
      className={cn(
        'inline-flex items-center gap-1.5',
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {children}
    </Badge>
  );
}
