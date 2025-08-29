import { z } from 'zod';

export const HeroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  ctaLabel: z.string().min(1, 'CTA label is required'),
  ctaHref: z.string().min(1, 'CTA href is required'),
  heroImage: z.string().optional(),
});

export const HeaderSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subheadline: z.string().min(1, 'Subheadline is required'),
});

export const SEOSchema = z.object({
  title: z.string().min(1, 'SEO title is required'),
  description: z.string().min(1, 'SEO description is required'),
  ogImage: z.string().optional(),
});

export const NewsletterSchema = z.object({
  enabled: z.boolean(),
  provider: z.string().min(1, 'Provider is required'),
});

export const ContactSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  schedule: z.string().min(1, 'Schedule is required'),
});

export const SiteSettingsSchema = z.object({
  hero: HeroSchema,
  header: HeaderSchema,
  seo: SEOSchema,
  newsletter: NewsletterSchema,
  contact: ContactSchema,
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type Header = z.infer<typeof HeaderSchema>;
export type SEO = z.infer<typeof SEOSchema>;
export type Newsletter = z.infer<typeof NewsletterSchema>;
export type Contact = z.infer<typeof ContactSchema>;

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    title: 'Auto Order - Your Trusted Vehicle Partner',
    subtitle: 'Find the perfect vehicle with our expert sourcing and delivery service',
    ctaLabel: 'Get Started',
    ctaHref: '/contact',
    heroImage: '',
  },
  header: {
    headline: 'Auto Order',
    subheadline: 'Professional Vehicle Sourcing',
  },
  seo: {
    title: 'Auto Order - Professional Vehicle Sourcing Service',
    description: 'Expert vehicle sourcing and delivery service. Find your perfect car with Auto Order.',
    ogImage: '',
  },
  newsletter: {
    enabled: true,
    provider: 'mailchimp',
  },
  contact: {
    phone: '+44 123 456 789',
    email: 'info@autoorder.com',
    address: '123 Business Street, London, UK',
    schedule: 'Mon-Fri: 9AM-6PM',
  },
};
