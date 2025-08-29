'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

const pathLabels: Record<string, string> = {
  'admin': 'Admin',
  'vehicles': 'Vehicule',
  'leads': 'Lead-uri',
  'settings': 'Setări',
  'testimonials': 'Testimoniale',
  'contact': 'Contact',
  'content': 'Conținut',
  'site': 'Site',
  'media': 'Media',
  'newsletter': 'Newsletter',
  'login': 'Autentificare'
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      if (segment === 'admin') {
        breadcrumbs.push({
          label: 'Dashboard',
          href: currentPath
        })
      } else if (pathLabels[segment]) {
        breadcrumbs.push({
          label: pathLabels[segment],
          href: index === segments.length - 1 ? undefined : currentPath
        })
      } else {
        // For dynamic segments like IDs, show a generic label
        breadcrumbs.push({
          label: 'Detalii',
          href: index === segments.length - 1 ? undefined : currentPath
        })
      }
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length <= 1) {
    return null
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link 
        href="/admin" 
        className="flex items-center space-x-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      
      {breadcrumbs.slice(1).map((breadcrumb, index) => (
        <div key={breadcrumb.href || index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {breadcrumb.href ? (
            <Link
              href={breadcrumb.href}
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {breadcrumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
