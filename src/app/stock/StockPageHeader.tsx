'use client';

import { useTranslation } from '@/i18n';
import { usePageContent } from '@/hooks/usePageContent';

export function StockPageHeader() {
  const { t } = useTranslation();
  const { getContent } = usePageContent({ pageId: 'stock' });

  // Use dynamic content with fallback to translations
  const pageHeader = getContent('header', t('stock.page.title'));
  const pageDescription = getContent('description', t('stock.page.subtitle'));

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {pageHeader}
      </h1>
      <p className="text-lg text-muted-foreground">
        {pageDescription}
      </p>
    </div>
  );
}
