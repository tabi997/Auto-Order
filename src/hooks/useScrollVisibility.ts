import { useState, useEffect } from 'react';

/**
 * Custom hook for scroll-based visibility
 * Hides element when scrolling down, shows when scrolling up
 * @param threshold - Scroll threshold in pixels before hiding (default: 100)
 * @returns boolean indicating if element should be visible
 */
export function useScrollVisibility(threshold = 100): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        // Scrolling down and past threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    // Only add listener on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [threshold]);

  return isVisible;
}
