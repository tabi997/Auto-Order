'use client'

import { useState, useEffect } from 'react'

export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

// Hook pentru a preveni flash-ul de conținut vechi
export function useNoFlash<T>(serverValue: T, clientValue: T): T {
  const isHydrated = useHydrationSafe()
  return isHydrated ? clientValue : serverValue
}

// Hook pentru a afișa conținut doar după hidratare
export function useClientOnly<T>(value: T, fallback?: T): T | undefined {
  const isHydrated = useHydrationSafe()
  return isHydrated ? value : fallback
}
