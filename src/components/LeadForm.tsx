'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Send, User, Phone, Mail, MessageSquare, Euro } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useToast } from '@/lib/hooks';

const LeadFormSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  phone: z.string().min(10, 'Telefonul trebuie să aibă cel puțin 10 caractere'),
  email: z.string().email('Email invalid'),
  requestType: z.enum(['offer', 'evaluation', 'question']),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
  gdpr: z.boolean().refine(val => val === true, 'Trebuie să fii de acord cu GDPR'),
  budget: z.string().optional(),
  vehicleId: z.string().optional(),
});

type LeadFormData = z.infer<typeof LeadFormSchema>;

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<LeadFormData>;
  title?: string;
  submitButtonText?: string;
}

export function LeadForm({ 
  isOpen, 
  onClose, 
  defaultValues = {},
  title = "Solicită ofertă",
  submitButtonText = "Trimite solicitarea"
}: LeadFormProps) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      requestType: 'offer',
      gdpr: false,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const requestType = watch('requestType');

  const onSubmit = async (data: LeadFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          budget: data.budget ? parseFloat(data.budget) : undefined,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        success(result.message || 'Solicitarea a fost trimisă cu succes!');
        reset();
        onClose();
      } else {
        error(result.message || 'A apărut o eroare la trimiterea solicitării');
      }
    } catch (err) {
      error('A apărut o eroare la trimiterea solicitării');
      console.error('Error submitting lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('contact.form.name')} *
              </label>
              <Input
                {...register('name')}
                placeholder="Numele tău complet"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('contact.form.phone')} *
              </label>
              <Input
                {...register('phone')}
                placeholder="+40 123 456 789"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('contact.form.email')} *
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('contact.form.requestType')} *
              </label>
              <Select
                value={requestType}
                onValueChange={(value) => setValue('requestType', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offer">
                    {t('contact.form.requestTypes.offer')}
                  </SelectItem>
                  <SelectItem value="evaluation">
                    {t('contact.form.requestTypes.evaluation')}
                  </SelectItem>
                  <SelectItem value="question">
                    {t('contact.form.requestTypes.question')}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.requestType && (
                <p className="text-sm text-destructive">{errors.requestType.message}</p>
              )}
            </div>

            {requestType === 'offer' && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Buget estimat (EUR)
                </label>
                <Input
                  {...register('budget')}
                  type="number"
                  placeholder="25000"
                  min="0"
                  step="1000"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('contact.form.message')} *
              </label>
              <Textarea
                {...register('message')}
                placeholder="Descrie ce vrei să realizezi..."
                rows={4}
                className={errors.message ? 'border-destructive' : ''}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdpr"
                  checked={watch('gdpr')}
                  onCheckedChange={(checked) => setValue('gdpr', checked as boolean)}
                />
                <label
                  htmlFor="gdpr"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('contact.form.gdpr')} *
                </label>
              </div>
              {errors.gdpr && (
                <p className="text-sm text-destructive">{errors.gdpr.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Se trimite...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {submitButtonText}
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Anulează
              </Button>
            </div>

            {defaultValues.vehicleId && (
              <div className="pt-2">
                <Badge variant="secondary" className="text-xs">
                  Vehicul: {defaultValues.vehicleId}
                </Badge>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
