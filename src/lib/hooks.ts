'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Hook for managing query parameters in URL
export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);
  
  const getParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);
  
  const setParam = useCallback((key: string, value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value === null || value === '') {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    
    // Reset to page 1 when filters change
    if (key !== 'page') {
      newSearchParams.delete('page');
    }
    
    router.push(`?${newSearchParams.toString()}`);
  }, [router, searchParams]);
  
  const setParams = useCallback((params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    if (!Object.keys(params).includes('page')) {
      newSearchParams.delete('page');
    }
    
    router.push(`?${newSearchParams.toString()}`);
  }, [router, searchParams]);
  
  const clearParams = useCallback(() => {
    router.push('');
  }, [router]);
  
  return {
    getParam,
    getParams,
    setParam,
    setParams,
    clearParams,
    searchParams,
  };
}

// Hook for managing local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue] as const;
}

// Hook for managing session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue] as const;
}

// Hook for managing form state
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  
  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  
  const updateFields = useCallback((fields: Partial<T>) => {
    setState(prev => ({
      ...prev,
      ...fields,
    }));
  }, []);
  
  const resetForm = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  return {
    state,
    setState,
    updateField,
    updateFields,
    resetForm,
  };
}

// Hook for managing loading states
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  
  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

// Hook for managing toast notifications
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>>([]);
  
  const addToast = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    const id = Date.now().toString();
    const toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success: (message: string, duration?: number) => addToast('success', message, duration),
    error: (message: string, duration?: number) => addToast('error', message, duration),
    warning: (message: string, duration?: number) => addToast('warning', message, duration),
    info: (message: string, duration?: number) => addToast('info', message, duration),
  };
}
