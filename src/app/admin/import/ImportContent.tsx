'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminNavbar } from '../AdminNavbar'
import { importListingsAction } from '../actions'
import { AdminUser, ImportFormData, ImportResult, importSchema } from '@/types/admin'
// Using string literals instead of enums for SQLite compatibility
import { 
  Upload, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react'

interface ImportContentProps {
  user: AdminUser
}

export function ImportContent({ user }: ImportContentProps) {
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
  })

  const onSubmit = async (data: ImportFormData) => {
    setIsImporting(true)
    setImportResult(null)

    try {
      const result = await importListingsAction(data)
      setImportResult(result)
      
      if (result.success) {
        reset()
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Eroare la import',
        errors: ['Eroare neașteptată la import'],
      })
    } finally {
      setIsImporting(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Openlane</h1>
          <p className="text-gray-600 mt-2">
            Importă anunțuri din linkuri Openlane. Fiecare URL va crea un anunț în status DRAFT.
          </p>
        </div>

        {/* Import Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Anunțuri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
                  Linkuri Openlane (unul per linie)
                </label>
                <Textarea
                  id="urls"
                  placeholder="https://www.openlane.com/car/12345/buy-now&#10;https://www.openlane.com/car/67890/buy-now&#10;https://www.openlane.com/car/11111/buy-now"
                  rows={8}
                  {...register('urls')}
                  className="font-mono text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Introduceți un URL per linie. Maximum 30 URL-uri per import.
                </p>
                {errors.urls && (
                  <p className="mt-1 text-sm text-red-600">{errors.urls.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>• Fiecare URL va crea un anunț în status DRAFT</p>
                  <p>• Puteți completa informațiile manual după import</p>
                  <p>• Rate limit: 30 URL-uri per minut</p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isImporting}
                  className="flex items-center space-x-2"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Se importă...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Importă</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Import Results */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Rezultat Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  importResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.message}
                  </p>
                </div>

                {importResult.listings && importResult.listings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Anunțuri create:</h4>
                    <div className="space-y-2">
                      {importResult.listings.map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{listing.title}</span>
                            {getStatusBadge(listing.status)}
                          </div>
                          <Link href={`/admin/listings/${listing.id}/edit`}>
                            <Button size="sm" variant="outline" className="flex items-center space-x-2">
                              <span>Completează</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.errors && importResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-3">Erori:</h4>
                    <div className="space-y-2">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucțiuni Import</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Format URL-uri acceptate:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• https://www.openlane.com/car/12345/buy-now</li>
                    <li>• https://www.openlane.com/car/67890/auction</li>
                    <li>• https://www.openlane.com/car/11111/buy-now</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">După import:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Anunțurile sunt create în status DRAFT</li>
                    <li>• Completați informațiile manual</li>
                    <li>• Schimbați statusul în PUBLISHED când gata</li>
                    <li>• Toate acțiunile sunt logate în AuditLog</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


