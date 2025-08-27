'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Car, Euro, Calendar, Gauge, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/i18n';
import { useToast } from '@/lib/hooks';

const valuationSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  email: z.string().email('Email invalid'),
  phone: z.string().min(10, 'Numărul de telefon trebuie să aibă cel puțin 10 cifre'),
  vehicleBrand: z.string().min(1, 'Selectează marca'),
  vehicleModel: z.string().min(1, 'Introdu modelul'),
  vehicleYear: z.string().min(4, 'Anul trebuie să aibă 4 cifre'),
  vehicleKm: z.string().min(1, 'Introdu kilometrajul'),
  estimatedValue: z.string().min(1, 'Introdu valoarea estimată'),
  description: z.string().min(10, 'Descrierea trebuie să aibă cel puțin 10 caractere'),
  gdpr: z.boolean().refine(val => val === true, 'Trebuie să accepți GDPR'),
});

type ValuationFormData = z.infer<typeof valuationSchema>;

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleData?: {
    brand: string;
    model: string;
    year: number;
    km: number;
    estimatedValue: number;
  };
}

export function ValuationModal({ isOpen, onClose, vehicleData }: ValuationModalProps) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      gdpr: false,
      ...(vehicleData && {
        vehicleBrand: vehicleData.brand,
        vehicleModel: vehicleData.model,
        vehicleYear: vehicleData.year.toString(),
        vehicleKm: vehicleData.km.toString(),
        estimatedValue: vehicleData.estimatedValue.toString(),
      }),
    },
  });

  const gdprAccepted = watch('gdpr');

  const onSubmit = async (data: ValuationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success(t('valuation.success.message'));
      
      reset();
      onClose();
    } catch (err) {
      error(t('valuation.error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t('valuation.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('valuation.subtitle')}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vehicle Info Card */}
          {vehicleData && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>{t('valuation.vehicleInfo')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicleData.brand}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicleData.model}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicleData.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicleData.km.toLocaleString()} km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('valuation.personalInfo')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.name')}</label>
                  <Input
                    {...register('name')}
                    placeholder={t('valuation.namePlaceholder')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.email')}</label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder={t('valuation.emailPlaceholder')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('valuation.phone')}</label>
                <Input
                  {...register('phone')}
                  placeholder={t('valuation.phonePlaceholder')}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('valuation.vehicleDetails')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.brand')}</label>
                  <Select value={watch('vehicleBrand')} onValueChange={(value) => setValue('vehicleBrand', value)}>
                    <SelectTrigger className={errors.vehicleBrand ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t('valuation.selectBrand')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Mercedes">Mercedes</SelectItem>
                      <SelectItem value="Audi">Audi</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Opel">Opel</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                      <SelectItem value="other">{t('valuation.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vehicleBrand && (
                    <p className="text-sm text-destructive">{errors.vehicleBrand.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.model')}</label>
                  <Input
                    {...register('vehicleModel')}
                    placeholder={t('valuation.modelPlaceholder')}
                    className={errors.vehicleModel ? 'border-destructive' : ''}
                  />
                  {errors.vehicleModel && (
                    <p className="text-sm text-destructive">{errors.vehicleModel.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.year')}</label>
                  <Input
                    {...register('vehicleYear')}
                    type="number"
                    min="1900"
                    max="2024"
                    placeholder="2020"
                    className={errors.vehicleYear ? 'border-destructive' : ''}
                  />
                  {errors.vehicleYear && (
                    <p className="text-sm text-destructive">{errors.vehicleYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.kilometers')}</label>
                  <Input
                    {...register('vehicleKm')}
                    type="number"
                    placeholder="50000"
                    className={errors.vehicleKm ? 'border-destructive' : ''}
                  />
                  {errors.vehicleKm && (
                    <p className="text-sm text-destructive">{errors.vehicleKm.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('valuation.estimatedValue')}</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register('estimatedValue')}
                      type="number"
                      placeholder="15000"
                      className={`pl-10 ${errors.estimatedValue ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.estimatedValue && (
                    <p className="text-sm text-destructive">{errors.estimatedValue.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('valuation.description')}</label>
                <Textarea
                  {...register('description')}
                  placeholder={t('valuation.descriptionPlaceholder')}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* GDPR */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="gdpr"
                  checked={gdprAccepted}
                  onCheckedChange={(checked) => setValue('gdpr', checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <label htmlFor="gdpr" className="text-sm font-medium">
                    {t('valuation.gdpr.title')}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {t('valuation.gdpr.description')}
                  </p>
                </div>
              </div>
              {errors.gdpr && (
                <p className="text-sm text-destructive">{errors.gdpr.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                {t('valuation.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('valuation.submitting') : t('valuation.submit')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
