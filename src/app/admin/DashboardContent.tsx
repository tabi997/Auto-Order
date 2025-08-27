'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminNavbar } from './AdminNavbar'
import { getDashboardStatsAction } from './actions'
import { AdminUser } from '@/types/admin'
import { 
  Car, 
  FileText, 
  Upload, 
  Users, 
  TrendingUp,
  LogOut 
} from 'lucide-react'

interface DashboardStats {
  total: number
  published: number
  draft: number
  archived: number
  sold: number
}

interface DashboardContentProps {
  user: AdminUser
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getDashboardStatsAction()
        if (result.success) {
          setStats(result.stats)
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total Anunțuri',
      value: stats?.total || 0,
      description: 'Toate anunțurile',
      icon: Car,
      color: 'bg-blue-500',
    },
    {
      title: 'Publicate',
      value: stats?.published || 0,
      description: 'Anunțuri active',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Draft',
      value: stats?.draft || 0,
      description: 'În lucru',
      icon: FileText,
      color: 'bg-yellow-500',
    },
    {
      title: 'Arhivate',
      value: stats?.archived || 0,
      description: 'Anunțuri arhivate',
      icon: FileText,
      color: 'bg-gray-500',
    },
    {
      title: 'Vândute',
      value: stats?.sold || 0,
      description: 'Tranzacții finalizate',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bun venit, {user.name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Panoul de administrare AutoOrder
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Gestionare Anunțuri
              </CardTitle>
              <CardDescription>
                Creează, editează și gestionează anunțurile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/listings">
                <Button className="w-full">
                  Vezi Anunțuri
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Openlane
              </CardTitle>
              <CardDescription>
                Importă anunțuri din linkuri Openlane
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/import">
                <Button className="w-full">
                  Import
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Utilizatori
              </CardTitle>
              <CardDescription>
                Gestionează utilizatorii și permisiunile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" disabled>
                În curând
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Activitate Recentă</CardTitle>
              <CardDescription>
                Ultimele acțiuni din sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nu există activitate recentă</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
