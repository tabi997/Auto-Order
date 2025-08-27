'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { User, Phone, Mail, MessageSquare, MapPin, Clock, Send } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useToast } from '@/lib/hooks';

const ContactFormSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  phone: z.string().min(10, 'Telefonul trebuie să aibă cel puțin 10 caractere'),
  email: z.string().email('Email invalid'),
  requestType: z.enum(['offer', 'evaluation', 'question']),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
  gdpr: z.boolean().refine(val => val === true, 'Trebuie să fii de acord cu GDPR'),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export function ContactForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      requestType: 'offer',
      gdpr: false,
    },
    mode: 'onChange',
  });

  const requestType = watch('requestType');

  // Set default request type from URL params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'offer') {
      setValue('requestType', 'offer');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
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
          source: 'contact_page',
        }),
      });

      const result = await response.json();

      if (result.ok) {
        success(result.message || 'Mesajul a fost trimis cu succes!');
        reset();
      } else {
        error(result.message || 'A apărut o eroare la trimiterea mesajului');
      }
    } catch (err) {
      error('A apărut o eroare la trimiterea mesajului');
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Trimite un mesaj
          </CardTitle>
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('contact.form.message')} *
              </label>
              <Textarea
                {...register('message')}
                placeholder="Descrie ce vrei să realizezi sau ce întrebări ai..."
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

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Se trimite...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Trimite mesajul
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('contact.contactInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{t('contact.contactInfo.email')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{t('contact.contactInfo.phone')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Adresă</p>
                <p className="font-medium">{t('contact.contactInfo.address')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">Luni-Vineri, 9:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>De ce să ne contactezi?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">1</Badge>
              <div>
                <h4 className="font-medium">Ofertă personalizată</h4>
                <p className="text-sm text-muted-foreground">
                  Spune-ne ce vrei și îți facem o ofertă personalizată din licitații B2B
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">2</Badge>
              <div>
                <h4 className="font-medium">Evaluare gratuită</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluăm nevoile tale și îți recomandăm cea mai bună abordare
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">3</Badge>
              <div>
                <h4 className="font-medium">Suport expert</h4>
                <p className="text-sm text-muted-foreground">
                  Răspundem la toate întrebările tale despre procesul nostru
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Locația noastră</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Hartă va fi afișată aici</p>
                <p className="text-xs">București, România</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
