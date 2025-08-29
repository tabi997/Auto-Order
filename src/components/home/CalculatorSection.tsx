'use client';

import { CostMiniCalculator } from './CostMiniCalculator';

export function CalculatorSection() {
  // Use hardcoded content instead of dynamic content
  const calculatorTitle = 'Calculează costul total';
  const calculatorSubtitle = 'Estimează costurile pentru mașina dorită';

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {calculatorTitle}
          </h2>
          <p className="text-xl text-muted-foreground">
            {calculatorSubtitle}
          </p>
        </div>
        <CostMiniCalculator />
      </div>
    </section>
  );
}
