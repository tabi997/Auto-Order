'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowRight, Info, TrendingUp, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <Card className="w-full max-w-lg mx-auto border-0 shadow-sm hover:shadow-lg transition-all duration-500 bg-white border border-slate-100">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Calculator className="h-8 w-8 text-slate-600" />
        </div>
        <CardTitle className="text-2xl font-light text-slate-900 mb-3">
          Calculator estimativ de costuri
        </CardTitle>
        <p className="text-slate-600 font-light">
          Estimează costul total pentru mașina dorită
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 px-8 pb-8">
        {/* Inputs */}
        <div className="space-y-3">
          <Label htmlFor="auctionPrice" className="text-sm font-medium text-slate-700">
            Preț licitație (EUR)
          </Label>
          <Input
            id="auctionPrice"
            type="number"
            placeholder="ex. 15000"
            value={auctionPrice}
            onChange={(e) => setAuctionPrice(e.target.value)}
            className="h-12 text-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="country" className="text-sm font-medium text-slate-700">
            Țara de origine
          </Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="h-12 text-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-300">
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
          className="w-full h-12 text-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
          disabled={!auctionPrice || !country}
        >
          Calculează costul total
        </Button>

        {/* Results */}
        {result && (
          <motion.div 
            className="space-y-4 pt-6 border-t border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Preț licitație:</span>
                <span className="font-medium text-lg text-slate-900">{result.auctionPrice.toLocaleString()} €</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Transport asigurat:</span>
                </div>
                <span className="font-medium text-slate-700">{result.transport.toLocaleString()} €</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Comision AutoOrder:</span>
                </div>
                <span className="font-medium text-slate-700">{result.commission.toLocaleString()} €</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Taxe & acte:</span>
                </div>
                <span className="font-medium text-slate-700">{result.taxes.toLocaleString()} €</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-lg font-medium text-slate-900">Cost total estimat:</span>
                <span className="text-2xl font-medium text-slate-900">{result.total.toLocaleString()} €</span>
              </div>
            </div>

            <Button 
              onClick={handleGetOffer}
              className="w-full h-12 text-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
            >
              Cere ofertă personalizată
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-start gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <p>
                Rezultatul este orientativ. Costurile finale depind de sursa licitației, starea vehiculului și opțiunile de transport.
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
