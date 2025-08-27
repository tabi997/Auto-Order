'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminNavbar } from '../AdminNavbar'
import { getListingsAction, bulkUpdateStatusAction, deleteListingAction } from '../actions'
import { AdminUser, ListingWithImages } from '@/types/admin'
// Using string literals instead of enums for SQLite compatibility
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  ExternalLink,
  Check,
  X
} from 'lucide-react'

interface ListingsContentProps {
  user: AdminUser
}

export function ListingsContent({ user }: ListingsContentProps) {
  const [listings, setListings] = useState<ListingWithImages[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadListings()
  }, [currentPage, search, filters])

  const loadListings = async () => {
    setIsLoading(true)
    try {
      const result = await getListingsAction(currentPage, 20, search, filters)
      if (result.success) {
        setListings(result.listings)
        setTotalPages(result.pages)
      }
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAction = async (status: string) => {
    if (selectedIds.length === 0) return

    try {
      const result = await bulkUpdateStatusAction(selectedIds, status)
      if (result.success) {
        setSelectedIds([])
        loadListings()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest anunț?')) return

    try {
      const result = await deleteListingAction(id)
      if (result.success) {
        loadListings()
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PUBLISHED: 'bg-green-100 text-green-800',
      DRAFT: 'bg-yellow-100 text-yellow-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
      SOLD: 'bg-purple-100 text-purple-800',
    }
    return <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      BUY_NOW: 'bg-blue-100 text-blue-800',
      AUCTION: 'bg-gray-100 text-gray-800',
    }
    return <Badge className={variants[type] || 'bg-gray-100 text-gray-800'}>{type}</Badge>
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(listings.map(l => l.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(itemId => itemId !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestionare Anunțuri</h1>
          <Link href="/admin/listings/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              Anunț Nou
            </Button>
          </Link>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Caută anunțuri..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Toate statusurile</option>
                <option value="PUBLISHED">Publicate</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Arhivate</option>
                <option value="SOLD">Vândute</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Toate tipurile</option>
                <option value="BUY_NOW">Buy Now</option>
                <option value="AUCTION">Licitație</option>
              </select>
              
              <Button
                onClick={() => setFilters({ status: '', type: '' })}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                Resetează
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedIds.length} anunțuri selectate
                </p>
                <div className="flex space-x-2">
                                      <Button
                      onClick={() => handleBulkAction("PUBLISHED")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Publică
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("ARCHIVED")}
                      size="sm"
                      variant="outline"
                    >
                      Arhivează
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Anunțuri ({listings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Se încarcă...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === listings.length && listings.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-3 font-medium">Anunț</th>
                      <th className="text-left p-3 font-medium">An</th>
                      <th className="text-left p-3 font-medium">Km</th>
                      <th className="text-left p-3 font-medium">Preț</th>
                      <th className="text-left p-3 font-medium">Tip</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Țară</th>
                      <th className="text-left p-3 font-medium">Sursa</th>
                      <th className="text-left p-3 font-medium">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(listing.id)}
                            onChange={(e) => handleSelectItem(listing.id, e.target.checked)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-sm text-gray-600">
                              {listing.brand} {listing.model}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">{listing.year}</td>
                        <td className="p-3">{listing.km.toLocaleString()}</td>
                        <td className="p-3 font-medium">€{listing.priceEur.toLocaleString()}</td>
                        <td className="p-3">{getTypeBadge(listing.type)}</td>
                        <td className="p-3">{getStatusBadge(listing.status)}</td>
                        <td className="p-3">{listing.country}</td>
                        <td className="p-3">
                          {listing.sourceUrl && (
                            <a
                              href={listing.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Link href={`/admin/listings/${listing.id}/edit`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/stock/${listing.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(listing.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Anterior
              </Button>
              
              <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                Pagina {currentPage} din {totalPages}
              </span>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Următor
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
