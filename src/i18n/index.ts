import { ro } from './ro';
import { en } from './en';
import homeData from './home.json';
import stockData from './stock.json';

export const translations = {
  ro: {
    ...ro,
    home: homeData,
    stock: stockData,
  },
  en: {
    ...en,
    home: homeData, // For now, use Romanian content for both
    stock: stockData, // For now, use Romanian content for both
  },
} as const;

export type Locale = keyof typeof translations;
export type Translation = typeof ro;

// Enhanced translation function that handles nested keys, home.json, and parameters
export function t(locale: Locale, key: string, params?: Record<string, any>): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value === 'string' && params) {
    // Replace parameters in the string
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }
  
  return typeof value === 'string' ? value : key;
}

// Default locale
export const defaultLocale: Locale = 'ro';

// Get translation for current locale
export function useTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string, params?: Record<string, any>) => t(locale, key, params),
    locale,
  };
}

// Helper function to get home-specific translations
export function useHomeTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string) => t(locale, `home.${key}`),
    locale,
  };
}
