'use client'

import { usePageLoading } from './PageLoadingProvider'
import { Skeleton } from '@/components/ui/Skeleton'

export function GlobalLoadingOverlay() {
  const { isLoading } = usePageLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Se încarcă conținutul...</p>
      </div>
    </div>
  )
}
