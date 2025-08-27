'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logoutAction } from './actions'
import { AdminUser } from '@/types/admin'
import { Car, Upload, Settings, LogOut } from 'lucide-react'

interface AdminNavbarProps {
  user: AdminUser
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  const handleLogout = async () => {
    await logoutAction()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800'
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator'
      case 'EDITOR':
        return 'Editor'
      case 'VIEWER':
        return 'Vizualizator'
      default:
        return role
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AutoOrder Admin</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/admin/listings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Anunțuri
              </Link>
              <Link href="/admin/import" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Import
              </Link>
            </div>
            
            {/* Buton adăugare anunț nou */}
            <Link href="/admin/listings/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Car className="h-4 w-4 mr-2" />
                Adaugă anunț
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || user.email}
                </p>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Deconectare</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
