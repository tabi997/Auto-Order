import { ro } from './ro';
import { en } from './en';

export const translations = {
  ro,
  en,
} as const;

export type Locale = keyof typeof translations;
export type Translation = typeof ro;

// Simple translation function
export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Default locale
export const defaultLocale: Locale = 'ro';

// Get translation for current locale
export function useTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string) => t(locale, key),
    locale,
  };
}
