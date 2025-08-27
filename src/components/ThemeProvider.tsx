'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  attribute?: 'class' | 'data-theme'
  defaultTheme?: 'light' | 'dark' | 'system'
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
