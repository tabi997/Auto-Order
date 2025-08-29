'use client'

import { Skeleton } from './Skeleton'

interface ContentLoaderProps {
  loading: boolean
  children: React.ReactNode
  skeleton?: React.ReactNode
  minHeight?: string
}

export function ContentLoader({ 
  loading, 
  children, 
  skeleton, 
  minHeight = "min-h-[200px]" 
}: ContentLoaderProps) {
  if (loading) {
    return (
      <div className={minHeight}>
        {skeleton || (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}
