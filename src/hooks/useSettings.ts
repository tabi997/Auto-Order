import { useState, useEffect } from 'react';

export interface ContactInfo {
  company: {
    name: string;
    description: string;
    website: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

export interface SiteConfig {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

export interface FooterConfig {
  about: string;
  description: string;
  newsletter: {
    title: string;
    description: string;
    cta: string;
    badge: string;
  };
}

export interface Settings {
  contact_info: ContactInfo;
  site_config: SiteConfig;
  footer_config: FooterConfig;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (key: string, value: any) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const result = await response.json();
      
      // Update local state
      if (settings) {
        setSettings(prev => prev ? {
          ...prev,
          [key]: value
        } : null);
      }

      return result;
    } catch (err) {
      console.error('Error updating setting:', err);
      throw err;
    }
  };

  const updateMultipleSettings = async (updates: Array<{ key: string; value: any }>) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();
      
      // Update local state
      if (settings) {
        const newSettings = { ...settings };
        updates.forEach(({ key, value }) => {
          newSettings[key as keyof Settings] = value;
        });
        setSettings(newSettings);
      }

      return result;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    updateMultipleSettings,
  };
}
