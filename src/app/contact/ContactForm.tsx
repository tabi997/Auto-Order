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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Car,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useToastContext } from '@/components/ToastProvider';

// Enhanced contact form schema
const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
    .max(100, 'Numele nu poate avea mai mult de 100 de caractere')
    .trim(),
  phone: z.string()
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 caractere')
    .max(20, 'Telefonul nu poate avea mai mult de 20 de caractere')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Format telefon invalid')
    .trim(),
  email: z.string()
    .email('Email invalid')
    .max(100, 'Email-ul nu poate avea mai mult de 100 de caractere')
    .trim(),
  company: z.string()
    .max(100, 'Numele companiei nu poate avea mai mult de 100 de caractere')
    .optional(),
  requestType: z.enum(['offer', 'evaluation', 'question', 'partnership']),
  vehicleDetails: z.object({
    make: z.string().min(1, 'Marcă este obligatorie').max(50, 'Marcă prea lungă').optional(),
    model: z.string().min(1, 'Model este obligatoriu').max(50, 'Model prea lung').optional(),
    year: z.string()
      .min(4, 'An invalid')
      .max(4, 'An invalid')
      .regex(/^\d{4}$/, 'Anul trebuie să fie format din 4 cifre')
      .refine(val => {
        const year = parseInt(val);
        return year >= 1990 && year <= new Date().getFullYear() + 1;
      }, 'Anul trebuie să fie între 1990 și ' + (new Date().getFullYear() + 1))
      .optional(),
    budget: z.string().max(100, 'Buget prea lung').optional(),
  }).optional(),
  message: z.string()
    .min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere')
    .max(1000, 'Mesajul nu poate avea mai mult de 1000 de caractere')
    .trim(),
  gdpr: z.boolean().refine(val => val === true, 'Trebuie să fii de acord cu GDPR'),
  marketing: z.boolean().optional(),
}).refine((data) => {
  // If requestType is 'offer', vehicle details should be provided
  if (data.requestType === 'offer') {
    if (!data.vehicleDetails?.make || !data.vehicleDetails?.model) {
      return false;
    }
  }
  return true;
}, {
  message: "Pentru oferte personalizate, marca și modelul sunt obligatorii",
  path: ["vehicleDetails"]
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

// Contact information data
const contactInfo = {
  email: 'contact@autoorder.ro',
  phone: '+40 123 456 789',
  address: 'București, România',
  schedule: 'Luni-Vineri, 9:00-18:00',
  whatsapp: '+40 123 456 789'
};

// Benefits of contacting
const contactBenefits = [
  {
    icon: Car,
    title: 'Ofertă personalizată',
    description: 'Spune-ne ce vrei și îți facem o ofertă personalizată din licitații B2B',
    badge: '1'
  },
  {
    icon: Calculator,
    title: 'Evaluare gratuită',
    description: 'Evaluăm nevoile tale și îți recomandăm cea mai bună abordare',
    badge: '2'
  },
  {
    icon: HelpCircle,
    title: 'Suport expert',
    description: 'Răspundem la toate întrebările tale despre procesul nostru',
    badge: '3'
  }
];

interface ContactFormProps {
  defaultRequestType?: 'offer' | 'evaluation' | 'question' | 'partnership';
  onSuccess?: () => void;
}

export function ContactForm({ defaultRequestType = 'offer', onSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { success, error } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVehicleFields, setShowVehicleFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      requestType: defaultRequestType,
      gdpr: false,
      marketing: false,
      vehicleDetails: {
        make: '',
        model: '',
        year: '',
        budget: '',
      },
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const requestType = watch('requestType');
  const gdpr = watch('gdpr');
  const vehicleDetails = watch('vehicleDetails');

  // Set default request type from URL params or props
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['offer', 'evaluation', 'question', 'partnership'].includes(type)) {
      setValue('requestType', type as any);
    } else if (defaultRequestType) {
      setValue('requestType', defaultRequestType);
    }
  }, [searchParams, setValue, defaultRequestType]);

  // Show vehicle fields for offer requests
  useEffect(() => {
    setShowVehicleFields(requestType === 'offer');
    // Clear vehicle validation errors when switching away from offer
    if (requestType !== 'offer') {
      clearErrors('vehicleDetails');
    }
  }, [requestType, clearErrors]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to match LeadZ schema
      const leadData = {
        marca_model: data.vehicleDetails?.make && data.vehicleDetails?.model 
          ? `${data.vehicleDetails.make} ${data.vehicleDetails.model} ${data.vehicleDetails.year || ''}`.trim()
          : `${data.requestType} - ${data.name}`,
        buget: data.vehicleDetails?.budget || 
               (data.requestType === 'offer' ? 'Contact pentru ofertă' : 'Contact pentru evaluare'),
        contact: `${data.name}${data.company ? ` (${data.company})` : ''} - ${data.phone} - ${data.email}`,
        extra: {
          requestType: data.requestType,
          message: data.message,
          company: data.company,
          vehicleDetails: data.vehicleDetails,
          marketing: data.marketing,
          source: 'contact_page',
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (result.ok) {
        success(result.message || 'Mesajul a fost trimis cu succes!');
        reset();
        // Reset form to initial state
        setValue('requestType', defaultRequestType);
        setValue('gdpr', false);
        setValue('marketing', false);
        setValue('vehicleDetails', {
          make: '',
          model: '',
          year: '',
          budget: '',
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
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

  const handleRequestTypeChange = (value: string) => {
    setValue('requestType', value as any);
    // Trigger validation for the new request type
    setTimeout(() => trigger('requestType'), 100);
  };

  // Check if form is valid considering vehicle details
  const isFormValid = isValid && (requestType !== 'offer' || (vehicleDetails?.make && vehicleDetails?.model));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Contact Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Send className="h-6 w-6 text-primary" />
              Trimite un mesaj
            </CardTitle>
            <p className="text-muted-foreground">
              Completează formularul de mai jos și te vom contacta în cel mai scurt timp
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informații personale
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nume complet *
                    </label>
                    <Input
                      {...register('name')}
                      placeholder="Numele tău complet"
                      className={errors.name ? 'border-destructive focus:ring-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Telefon *
                    </label>
                    <Input
                      {...register('phone')}
                      placeholder="+40 123 456 789"
                      className={errors.phone ? 'border-destructive focus:ring-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="email@example.com"
                      className={errors.email ? 'border-destructive focus:ring-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Companie (opțional)
                    </label>
                    <Input
                      {...register('company')}
                      placeholder="Numele companiei"
                    />
                  </div>
                </div>
              </div>

              {/* Request Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Tip solicitare
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Ce vrei să realizezi? *
                  </label>
                  <Select
                    value={requestType}
                    onValueChange={handleRequestTypeChange}
                  >
                    <SelectTrigger className={errors.requestType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selectează tipul solicitării" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offer">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Vreau o ofertă personalizată
                        </div>
                      </SelectItem>
                      <SelectItem value="evaluation">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Vreau o evaluare gratuită
                        </div>
                      </SelectItem>
                      <SelectItem value="question">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          Am o întrebare
                        </div>
                      </SelectItem>
                      <SelectItem value="partnership">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Propun o parteneriat
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.requestType && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.requestType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Vehicle Details - Only show for offer requests */}
              {showVehicleFields && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Detalii vehicul (opțional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Marcă
                      </label>
                      <Input
                        {...register('vehicleDetails.make')}
                        placeholder="ex: BMW, Mercedes, Audi"
                        className={errors.vehicleDetails?.make ? 'border-destructive focus:ring-destructive' : ''}
                      />
                      {errors.vehicleDetails?.make && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.vehicleDetails.make.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Model
                      </label>
                      <Input
                        {...register('vehicleDetails.model')}
                        placeholder="ex: X5, C-Class, A4"
                        className={errors.vehicleDetails?.model ? 'border-destructive focus:ring-destructive' : ''}
                      />
                      {errors.vehicleDetails?.model && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.vehicleDetails.model.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        An
                      </label>
                      <Input
                        {...register('vehicleDetails.year')}
                        placeholder="ex: 2020"
                        type="number"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className={errors.vehicleDetails?.year ? 'border-destructive focus:ring-destructive' : ''}
                      />
                      {errors.vehicleDetails?.year && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.vehicleDetails.year.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Buget estimat
                      </label>
                      <Input
                        {...register('vehicleDetails.budget')}
                        placeholder="ex: 15.000 EUR"
                        className={errors.vehicleDetails?.budget ? 'border-destructive focus:ring-destructive' : ''}
                      />
                      {errors.vehicleDetails?.budget && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.vehicleDetails.budget.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mesajul tău
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Descrie ce vrei să realizezi *
                  </label>
                  <Textarea
                    {...register('message')}
                    placeholder="Descrie nevoile tale, preferințele sau întrebările pe care le ai..."
                    rows={4}
                    className={errors.message ? 'border-destructive focus:ring-destructive' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.message.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watch('message')?.length || 0}/1000 caractere
                  </p>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Acorduri
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gdpr"
                      checked={gdpr}
                      onCheckedChange={(checked) => setValue('gdpr', checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="gdpr"
                      className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sunt de acord cu{' '}
                      <a href="/gdpr" className="text-primary hover:underline">
                        politica de confidențialitate
                      </a>{' '}
                      și procesarea datelor mele personale *
                    </label>
                  </div>
                  {errors.gdpr && (
                    <p className="text-sm text-destructive flex items-center gap-1 ml-6">
                      <AlertCircle className="h-3 w-3" />
                      {errors.gdpr.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={watch('marketing')}
                      onCheckedChange={(checked) => setValue('marketing', checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Vreau să primesc oferte și noutăți despre serviciile AutoOrder
                      <span className="text-muted-foreground"> (opțional)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Se trimite...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Trimite mesajul
                  </div>
                )}
              </Button>

              {/* Success Message Placeholder */}
              {!isSubmitting && isFormValid && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Formularul este valid și gata de trimitere!
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information & Benefits */}
      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Informații contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Adresă</p>
                <p className="font-medium">{contactInfo.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">{contactInfo.schedule}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>De ce să ne contactezi?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1 flex-shrink-0">
                  {benefit.badge}
                </Badge>
                <div className="flex items-start gap-3">
                  <benefit.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Response Time Promise */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Răspuns rapid garantat</h3>
              <p className="text-sm text-muted-foreground">
                Ne angajăm să răspundem în maxim 2 ore în timpul programului de lucru
              </p>
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
                <p className="text-xs">{contactInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
