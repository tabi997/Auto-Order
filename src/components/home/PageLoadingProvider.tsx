'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PageLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  loadingComponents: Set<string>
  setComponentLoading: (componentId: string, loading: boolean) => void
}

const PageLoadingContext = createContext<PageLoadingContextType | undefined>(undefined)

export function usePageLoading() {
  const context = useContext(PageLoadingContext)
  if (context === undefined) {
    throw new Error('usePageLoading must be used within a PageLoadingProvider')
  }
  return context
}

interface PageLoadingProviderProps {
  children: ReactNode
}

export function PageLoadingProvider({ children }: PageLoadingProviderProps) {
  const [loadingComponents, setLoadingComponents] = useState<Set<string>>(new Set())

  const setComponentLoading = (componentId: string, loading: boolean) => {
    setLoadingComponents(prev => {
      const newSet = new Set(prev)
      if (loading) {
        newSet.add(componentId)
      } else {
        newSet.delete(componentId)
      }
      return newSet
    })
  }

  const isLoading = loadingComponents.size > 0

  return (
    <PageLoadingContext.Provider value={{
      isLoading,
      setIsLoading: () => {}, // Not used in this implementation
      loadingComponents,
      setComponentLoading
    }}>
      {children}
    </PageLoadingContext.Provider>
  )
}
