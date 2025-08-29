'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Shield, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Euro, 
  CheckCircle, 
  Info,
  Send,
  Target,
  Users,
  Zap,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useToast } from '@/lib/hooks';
import { createLead } from '@/app/actions/leads';

const SourcingFormSchema = {
  name: '',
  phone: '',
  email: '',
  brand: '',
  model: '',
  budget: '',
  yearMin: '',
  kmMax: '',
  preferences: '',
  gdpr: false,
};

export function SourcingContent() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(SourcingFormSchema);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.email) {
      error('Te rugăm să completezi toate câmpurile obligatorii');
      return;
    }

    if (!formData.gdpr) {
      error('Trebuie să fii de acord cu GDPR');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createLead({
        marca_model: `${formData.brand} ${formData.model}`.trim() || 'Sourcing Brief',
        buget: formData.budget ? `${formData.budget} EUR` : 'Contact pentru ofertă',
        contact: `${formData.name} - ${formData.phone} - ${formData.email}`,
        extra: {
          requestType: 'offer',
          message: `Sourcing brief: ${formData.brand} ${formData.model}, buget: ${formData.budget}EUR, an: ${formData.yearMin}+, km: ${formData.kmMax}-, preferințe: ${formData.preferences}`,
          gdpr: formData.gdpr,
          source: 'sourcing_page',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          brand: formData.brand,
          model: formData.model,
          budget: formData.budget,
          yearMin: formData.yearMin,
          kmMax: formData.kmMax,
          preferences: formData.preferences,
        },
      }, 'sourcing_page');

      if (result.ok) {
        success('Cererea ta a fost trimisă cu succes! Vom reveni în cel mai scurt timp cu o ofertă personalizată.');
        setFormData(SourcingFormSchema);
      } else {
        error(result.message || 'A apărut o eroare la trimiterea cererii');
      }
    } catch (err) {
      error('A apărut o eroare la trimiterea cererii');
      console.error('Error submitting sourcing brief:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Process Overview */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t('sourcing.process')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold">1. Brief personalizat</h3>
            <p className="text-sm text-muted-foreground">
              Ne spui exact ce vrei și îți facem un plan personalizat
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold">2. Sourcing inteligent</h3>
            <p className="text-sm text-muted-foreground">
              Căutăm în toate licitațiile B2B europene pentru tine
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold">3. Ofertă garantată</h3>
            <p className="text-sm text-muted-foreground">
              Îți oferim cea mai bună variantă cu garanție 100%
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          De ce sourcing-ul nostru?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Economii garantate</h3>
              <p className="text-xs text-muted-foreground">
                Până la 40% față de prețurile de pe piață
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Transparență totală</h3>
              <p className="text-xs text-muted-foreground">
                Vezi fiecare pas al procesului
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Viteză de execuție</h3>
              <p className="text-xs text-muted-foreground">
                Rezultate în 2-4 săptămâni
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Expertiză dedicată</h3>
              <p className="text-xs text-muted-foreground">
                Echipă specializată în licitații B2B
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Brief Form */}
      <section>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6" />
              Spune-ne ce vrei
            </CardTitle>
            <p className="text-muted-foreground">
              Completează rapid ce vrei și îți facem o ofertă personalizată
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informații personale
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nume complet *
                    </label>
                    <Input
                      placeholder="Numele tău complet"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Telefon *
                    </label>
                    <Input
                      placeholder="+40 123 456 789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Detalii vehicul
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('sourcing.briefForm.brand')}
                    </label>
                    <Input
                      placeholder="ex: BMW, Mercedes, Audi..."
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('sourcing.briefForm.model')}
                    </label>
                    <Input
                      placeholder="ex: X5, C-Class, A4..."
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('sourcing.briefForm.budget')} (EUR)
                    </label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('sourcing.briefForm.yearMin')}
                    </label>
                    <Input
                      type="number"
                      placeholder="2018"
                      min="2000"
                      max="2024"
                      value={formData.yearMin}
                      onChange={(e) => handleInputChange('yearMin', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('sourcing.briefForm.kmMax')}
                    </label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={formData.kmMax}
                      onChange={(e) => handleInputChange('kmMax', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('sourcing.briefForm.preferences')}
                  </label>
                  <Textarea
                    placeholder="Descrie preferințele tale: combustibil, cutie de viteze, dotări, culoare, etc."
                    rows={3}
                    value={formData.preferences}
                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="gdpr-sourcing"
                    checked={formData.gdpr}
                    onCheckedChange={(checked: boolean | 'indeterminate') => handleInputChange('gdpr', checked as boolean)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="gdpr-sourcing"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sunt de acord cu prelucrarea datelor mele personale *
                  </label>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={!formData.gdpr || isSubmitting || !formData.name || !formData.phone || !formData.email}
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
                    Trimite cererea
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          {t('sourcing.questions')}
        </h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Ce sunt licitațiile B2B?</h3>
              <p className="text-sm text-muted-foreground">
                Licitațiile B2B sunt evenimente organizate pentru companii și dealerii autorizați, 
                unde se vând vehicule în loturi mari la prețuri competitive.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Cum garantezi calitatea vehiculelor?</h3>
              <p className="text-sm text-muted-foreground">
                Toate vehiculele sunt verificate înainte de achiziție și vin cu documentație completă. 
                Oferim garanție 100% pentru serviciile noastre.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Cât costă serviciul de sourcing?</h3>
              <p className="text-sm text-muted-foreground">
                Comisionul nostru este transparent și se calculează ca procent din prețul de achiziție. 
                Nu există costuri ascunse sau comisioane suplimentare.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Ce fac dacă nu sunt mulțumit de oferta?</h3>
              <p className="text-sm text-muted-foreground">
                Nu plătești nimic dacă nu ești mulțumit. Oferim garanție 100% și nu există obligații 
                până nu ești complet satisfăcut cu oferta.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Informații importante
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Sourcing-ul nostru se face exclusiv în licitații B2B autorizate din Europa. 
              Toate vehiculele vin cu documentație completă și sunt verificate înainte de achiziție. 
              Contactează-ne pentru detalii complete despre procesul nostru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
