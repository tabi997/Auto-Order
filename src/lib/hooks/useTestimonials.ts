import { useState, useEffect, useCallback } from 'react';
import { getTestimonials } from '@/app/actions/testimonials';

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  rating: number;
  content: string;
  avatar_url?: string;
  is_featured: boolean;
  order_index: number;
  badge?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Refresh testimonials (useful for admin panel updates)
  const refresh = useCallback(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    refresh
  };
}
