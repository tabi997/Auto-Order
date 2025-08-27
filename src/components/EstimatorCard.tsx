'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Clock, Shield } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface EstimatorCardProps {
  title: string;
  description: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function EstimatorCard({
  title,
  description,
  value,
  unit,
  icon,
  variant = 'default',
  trend,
  className = '',
}: EstimatorCardProps) {
  const { t } = useTranslation();

  const variantClasses = {
    default: 'bg-background border-border',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-500" />,
    down: <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />,
    stable: <Clock className="h-4 w-4 text-blue-500" />,
  };

  const defaultIcon = icon || <Calculator className="h-6 w-6 text-primary" />;

  return (
    <Card className={`${variantClasses[variant]} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {defaultIcon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {trend && (
            <Badge variant="outline" className="flex items-center space-x-1">
              {trendIcons[trend]}
              <span className="text-xs">
                {trend === 'up' && t('estimator.trendUp')}
                {trend === 'down' && t('estimator.trendDown')}
                {trend === 'stable' && t('estimator.trendStable')}
              </span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
          </div>
          
          {/* Additional info or actions can go here */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{t('estimator.verified')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
