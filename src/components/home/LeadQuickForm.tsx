'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Car, Phone, Mail } from 'lucide-react';

interface LeadFormData {
  vehicleModel: string;
  budget: string;
  contact: string;
  contactType: 'phone' | 'email';
  km?: string;
  fuel?: string;
  gearbox?: string;
}

export function LeadQuickForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    vehicleModel: '',
    budget: '',
    contact: '',
    contactType: 'phone'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Client AutoOrder',
          phone: formData.contactType === 'phone' ? formData.contact : '',
          email: formData.contactType === 'email' ? formData.contact : '',
          requestType: 'offer',
          message: `Model dorit: ${formData.vehicleModel}, Buget: ${formData.budget}${formData.km ? `, KM: ${formData.km}` : ''}${formData.fuel ? `, Combustibil: ${formData.fuel}` : ''}${formData.gearbox ? `, Cutie: ${formData.gearbox}` : ''}`,
          gdpr: true,
          source: 'homepage_quick_form',
          budget: parseInt(formData.budget.replace(/\D/g, '')) || undefined,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        toast({
          title: "Mulțumim!",
          description: "Te contactăm în 15–30 min.",
        });
        setIsSubmitted(true);
        setFormData({
          vehicleModel: '',
          budget: '',
          contact: '',
          contactType: 'phone'
        });
        setShowAdditionalFields(false);
      } else {
        toast({
          title: "Eroare",
          description: result.message || "A apărut o eroare. Încearcă din nou.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare. Încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Cererea a fost trimisă!</h3>
          <p className="text-muted-foreground mb-4">
            Te contactăm în 15–30 minute cu oferte personalizate.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full"
          >
            Trimite altă cerere
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto" id="lead-quick">
      <CardHeader>
        <CardTitle className="text-center">Primește ofertă personalizată</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Model */}
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Marca/Model</Label>
            <Input
              id="vehicleModel"
              placeholder="ex. VW Passat, BMW X3"
              value={formData.vehicleModel}
              onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
              required
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Buget (EUR)</Label>
            <Input
              id="budget"
              placeholder="ex. 15000"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              required
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <div className="flex gap-2">
              <Select
                value={formData.contactType}
                onValueChange={(value: 'phone' | 'email') => handleInputChange('contactType', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">
                    <Phone className="h-4 w-4" />
                  </SelectItem>
                  <SelectItem value="email">
                    <Mail className="h-4 w-4" />
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="contact"
                placeholder={formData.contactType === 'phone' ? 'ex. 0722123456' : 'ex. email@example.com'}
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                required
                className="flex-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Se trimite...' : 'Primește ofertă'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Progressive Disclosure */}
          {!showAdditionalFields && (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setShowAdditionalFields(true)}
            >
              + Adaugă detalii (opțional)
            </Button>
          )}

          {/* Additional Fields */}
          {showAdditionalFields && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="km">Kilometri maximi</Label>
                <Input
                  id="km"
                  placeholder="ex. 150000"
                  value={formData.km || ''}
                  onChange={(e) => handleInputChange('km', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel">Combustibil</Label>
                <Select
                  value={formData.fuel || ''}
                  onValueChange={(value) => handleInputChange('fuel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează combustibilul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Benzină">Benzină</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hibrid">Hibrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="GPL">GPL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gearbox">Cutie de viteze</Label>
                <Select
                  value={formData.gearbox || ''}
                  onValueChange={(value) => handleInputChange('gearbox', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează cutia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manuală">Manuală</SelectItem>
                    <SelectItem value="Automată">Automată</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
