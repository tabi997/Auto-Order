'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  Contact, 
  FileText, 
  Globe, 
  Image, 
  Mail,
  Phone,
  MapPin,
  Star,
  Users
} from 'lucide-react'

const settingsSections = [
  {
    title: 'Setări Site',
    description: 'Hero, Header, SEO, Contact, Newsletter',
    href: '/admin/settings/site',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Testimoniale',
    description: 'Gestionează testimoniale și recenzii clienți',
    href: '/admin/settings/testimonials',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Media',
    description: 'Upload imagini pentru Hero și SEO',
    href: '/admin/settings/media',
    icon: Image,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export function SettingsNav() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {settingsSections.map((section) => {
        const IconComponent = section.icon
        return (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className={`h-6 w-6 ${section.color}`} />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription className="text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Click pentru a accesa →
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
