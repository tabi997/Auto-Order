'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Euro, Truck, Percent } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface CalculationResult {
  purchasePrice: number;
  commission: number;
  transport: number;
  total: number;
  breakdown: {
    purchase: number;
    commissionAmount: number;
    transportAmount: number;
  };
}

export function PriceCalc() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    purchasePrice: '',
    country: '',
    commission: '5',
    transport: '3',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = [
    { code: 'DE', name: t('countries.DE') },
    { code: 'FR', name: t('countries.FR') },
    { code: 'NL', name: t('countries.NL') },
    { code: 'BE', name: t('countries.BE') },
    { code: 'IT', name: t('countries.IT') },
  ];

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Prețul de achiziție trebuie să fie mai mare decât 0';
    }

    if (!formData.country) {
      newErrors.country = 'Selectează o țară';
    }

    if (!formData.commission || parseFloat(formData.commission) < 0) {
      newErrors.commission = 'Comisionul trebuie să fie pozitiv';
    }

    if (!formData.transport || parseFloat(formData.transport) < 0) {
      newErrors.transport = 'Transportul trebuie să fie pozitiv';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const calculatePrice = useCallback(() => {
    if (!validateForm()) return;

    const purchasePrice = parseFloat(formData.purchasePrice);
    const commissionPercent = parseFloat(formData.commission);
    const transportPercent = parseFloat(formData.transport);

    const commissionAmount = (purchasePrice * commissionPercent) / 100;
    const transportAmount = (purchasePrice * transportPercent) / 100;
    const total = purchasePrice + commissionAmount + transportAmount;

    setResult({
      purchasePrice,
      commission: commissionPercent,
      transport: transportPercent,
      total,
      breakdown: {
        purchase: purchasePrice,
        commissionAmount,
        transportAmount,
      },
    });
  }, [formData, validateForm]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      purchasePrice: '',
      country: '',
      commission: '5',
      transport: '3',
    });
    setResult(null);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6" />
          {t('calculator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('calculator.purchasePrice')}
            </label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="35000"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                className={`pl-10 ${errors.purchasePrice ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.purchasePrice && (
              <p className="text-sm text-destructive">{errors.purchasePrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('calculator.country')}
            </label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange('country', value)}
            >
              <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selectează țara" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('calculator.commission')}
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="5"
                value={formData.commission}
                onChange={(e) => handleInputChange('commission', e.target.value)}
                className={`pl-10 ${errors.commission ? 'border-destructive' : ''}`}
                step="0.1"
                min="0"
                max="20"
              />
            </div>
            {errors.commission && (
              <p className="text-sm text-destructive">{errors.commission}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('calculator.transport')}
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="3"
                value={formData.transport}
                onChange={(e) => handleInputChange('transport', e.target.value)}
                className={`pl-10 ${errors.transport ? 'border-destructive' : ''}`}
                step="0.1"
                min="0"
                max="15"
              />
            </div>
            {errors.transport && (
              <p className="text-sm text-destructive">{errors.transport}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculatePrice} className="flex-1">
            {t('calculator.calculate')}
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('calculator.total')}</h3>
              <div className="text-3xl font-bold text-primary">
                €{result.total.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">{t('calculator.breakdown')}</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Preț achiziție:</span>
                  <span className="font-medium">€{result.breakdown.purchase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comision ({result.commission}%):</span>
                  <span className="font-medium">€{result.breakdown.commissionAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport ({result.transport}%):</span>
                  <span className="font-medium">€{result.breakdown.transportAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>€{result.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">
                Economie estimată: €{(result.breakdown.purchase * 0.15).toLocaleString()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Timp estimat: 2-4 săptămâni
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
