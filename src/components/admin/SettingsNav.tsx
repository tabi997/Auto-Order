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
    title: 'Testimoniale',
    description: 'Gestionează testimoniale și recenzii clienți',
    href: '/admin/settings/testimonials',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'Informații Contact',
    description: 'Modifică email, telefon, adresă și program',
    href: '/admin/settings/contact',
    icon: Contact,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Conținut Pagini',
    description: 'Editează textul din diferitele pagini',
    href: '/admin/settings/content',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Setări Site',
    description: 'Configurări generale site și SEO',
    href: '/admin/settings/site',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Imagini și Media',
    description: 'Gestionează imagini și fișiere media',
    href: '/admin/settings/media',
    icon: Image,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Newsletter',
    description: 'Configurări newsletter și comunicări',
    href: '/admin/settings/newsletter',
    icon: Mail,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
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
