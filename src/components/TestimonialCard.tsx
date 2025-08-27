'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  rating: number;
  content: string;
  avatar?: string;
  badge?: string;
  className?: string;
}

export function TestimonialCard({
  name,
  role,
  company,
  rating,
  content,
  avatar,
  badge,
  className = '',
}: TestimonialCardProps) {
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300',
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Quote className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </div>
        
        <div className="flex items-center mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <blockquote className="text-muted-foreground leading-relaxed mb-4">
          "{content}"
        </blockquote>
        
        <div className="border-t pt-4">
          <div className="font-semibold text-foreground">
            {name}
          </div>
          <div className="text-sm text-muted-foreground">
            {role} • {company}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
