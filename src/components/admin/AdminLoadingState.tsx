import { Loader2, Car, Users, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminLoadingStateProps {
  type?: 'vehicles' | 'leads' | 'settings' | 'general'
  message?: string
  className?: string
}

export function AdminLoadingState({
  type = 'general',
  message,
  className = ''
}: AdminLoadingStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'vehicles':
        return <Car className="h-8 w-8 text-muted-foreground" />
      case 'leads':
        return <Users className="h-8 w-8 text-muted-foreground" />
      case 'settings':
        return <Settings className="h-8 w-8 text-muted-foreground" />
      default:
        return <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'vehicles':
        return 'Se încarcă vehiculele...'
      case 'leads':
        return 'Se încarcă lead-urile...'
      case 'settings':
        return 'Se încarcă setările...'
      default:
        return 'Se încarcă...'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'vehicles':
        return 'Se preiau datele despre vehicule din baza de date'
      case 'leads':
        return 'Se preiau datele despre lead-uri din baza de date'
      case 'settings':
        return 'Se preiau configurațiile din baza de date'
      default:
        return 'Se procesează cererea, te rugăm să aștepți'
    }
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-lg">{message || getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {getDescription()}
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}

export function AdminTableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-12 bg-muted rounded-lg"></div>
      
      {/* Rows Skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-muted rounded-lg"></div>
      ))}
    </div>
  )
}
