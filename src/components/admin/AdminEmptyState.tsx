import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Users, Settings, Plus, Search } from 'lucide-react'
import Link from 'next/link'

interface AdminEmptyStateProps {
  type?: 'vehicles' | 'leads' | 'settings' | 'search' | 'general'
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  showAction?: boolean
  className?: string
}

export function AdminEmptyState({
  type = 'general',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  showAction = true,
  className = ''
}: AdminEmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'vehicles':
        return <Car className="h-16 w-16 text-muted-foreground" />
      case 'leads':
        return <Users className="h-16 w-16 text-muted-foreground" />
      case 'settings':
        return <Settings className="h-16 w-16 text-muted-foreground" />
      case 'search':
        return <Search className="h-16 w-16 text-muted-foreground" />
      default:
        return <Settings className="h-16 w-16 text-muted-foreground" />
    }
  }

  const getDefaultTitle = () => {
    switch (type) {
      case 'vehicles':
        return 'Nu există vehicule'
      case 'leads':
        return 'Nu există lead-uri'
      case 'settings':
        return 'Nu există setări'
      case 'search':
        return 'Nu s-au găsit rezultate'
      default:
        return 'Nu există date'
    }
  }

  const getDefaultDescription = () => {
    switch (type) {
      case 'vehicles':
        return 'Nu există vehicule în baza de date. Adaugă primul vehicul pentru a începe.'
      case 'leads':
        return 'Nu există lead-uri în baza de date. Lead-urile vor apărea aici când clienții vor face cereri.'
      case 'settings':
        return 'Nu există setări configurate. Configurează setările pentru a personaliza site-ul.'
      case 'search':
        return 'Încearcă să modifici criteriile de căutare sau să resetezi filtrele.'
      default:
        return 'Nu există date de afișat. Verifică mai târziu sau contactează administratorul.'
    }
  }

  const getDefaultActionLabel = () => {
    switch (type) {
      case 'vehicles':
        return 'Adaugă vehicul'
      case 'leads':
        return 'Vezi toate lead-urile'
      case 'settings':
        return 'Configurează setări'
      case 'search':
        return 'Resetează filtrele'
      default:
        return 'Începe'
    }
  }

  const renderAction = () => {
    if (!showAction) return null

    const label = actionLabel || getDefaultActionLabel()

    if (actionHref) {
      return (
        <Button asChild className="mt-4">
          <Link href={actionHref}>
            <Plus className="h-4 w-4 mr-2" />
            {label}
          </Link>
        </Button>
      )
    }

    if (onAction) {
      return (
        <Button onClick={onAction} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          {label}
        </Button>
      )
    }

    return null
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-xl">
            {title || getDefaultTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {description || getDefaultDescription()}
          </p>
          {renderAction()}
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminSearchEmptyState({
  searchTerm,
  onClearSearch,
  className = ''
}: {
  searchTerm: string
  onClearSearch: () => void
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <Search className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Nu s-au găsit rezultate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Nu s-au găsit rezultate pentru "{searchTerm}". Încearcă să modifici termenii de căutare.
          </p>
          <Button variant="outline" onClick={onClearSearch} className="mt-4">
            <Search className="h-4 w-4 mr-2" />
            Resetează căutarea
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
