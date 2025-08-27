import { ro } from './ro';
import { en } from './en';
import homeData from './home.json';

export const translations = {
  ro: {
    ...ro,
    home: homeData,
  },
  en: {
    ...en,
    home: homeData, // For now, use Romanian content for both
  },
} as const;

export type Locale = keyof typeof translations;
export type Translation = typeof ro;

// Enhanced translation function that handles nested keys and home.json
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

// Helper function to get home-specific translations
export function useHomeTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string) => t(locale, `home.${key}`),
    locale,
  };
}
