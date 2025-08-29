'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowRight, Info } from 'lucide-react';

interface CalculationResult {
  auctionPrice: number;
  transport: number;
  commission: number;
  taxes: number;
  total: number;
}

export function CostMiniCalculator() {
  const [auctionPrice, setAuctionPrice] = useState('');
  const [country, setCountry] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const countries = [
    { value: 'germany', label: 'Germania' },
    { value: 'france', label: 'Franța' },
    { value: 'italy', label: 'Italia' },
    { value: 'spain', label: 'Spania' },
    { value: 'netherlands', label: 'Olanda' },
    { value: 'belgium', label: 'Belgia' }
  ];

  const calculateCosts = () => {
    const price = parseFloat(auctionPrice);
    if (!price || !country) return;

    // Simplified calculation logic
    const transport = price * 0.08; // 8% transport
    const commission = price * 0.05; // 5% commission
    const taxes = price * 0.02; // 2% taxes

    const calculation: CalculationResult = {
      auctionPrice: price,
      transport,
      commission,
      taxes,
      total: price + transport + commission + taxes
    };

    setResult(calculation);
  };

  const handleGetOffer = () => {
    if (result) {
      // Navigate to contact page instead of scrolling to lead form
      window.location.href = '/contact';
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculator estimativ de costuri
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Estimează costul total pentru mașina dorită
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Inputs */}
        <div className="space-y-2">
          <Label htmlFor="auctionPrice">Preț licitație (EUR)</Label>
          <Input
            id="auctionPrice"
            type="number"
            placeholder="ex. 15000"
            value={auctionPrice}
            onChange={(e) => setAuctionPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Țara de origine</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează țara" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={calculateCosts}
          className="w-full"
          disabled={!auctionPrice || !country}
        >
          Calculează costul total
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Preț licitație:</span>
                <span className="font-medium">{result.auctionPrice.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Transport asigurat:</span>
                <span>{result.transport.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Comision AutoOrder:</span>
                <span>{result.commission.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxe & acte:</span>
                <span>{result.taxes.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Cost total estimat:</span>
                <span className="text-primary">{result.total.toLocaleString()} €</span>
              </div>
            </div>

            <Button 
              onClick={handleGetOffer}
              className="w-full"
            >
              Cere ofertă personalizată
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p>
                Rezultatul este orientativ. Costurile finale depind de sursa licitației, starea vehiculului și opțiunile de transport.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
