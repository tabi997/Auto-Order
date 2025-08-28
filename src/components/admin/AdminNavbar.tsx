'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Car, Users, Settings, LogOut } from 'lucide-react'
import { signOutClient } from '@/lib/auth-client'

export function AdminNavbar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOutClient()
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              AutoOrder Admin
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin/vehicles">
                <Button
                  variant={isActive('/admin/vehicles') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Car className="h-4 w-4" />
                  <span>Vehicule</span>
                </Button>
              </Link>
              
              <Link href="/admin/leads">
                <Button
                  variant={isActive('/admin/leads') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Lead-uri</span>
                </Button>
              </Link>
              
              <Link href="/admin/settings">
                <Button
                  variant={isActive('/admin/settings') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Setări</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Deconectare</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
