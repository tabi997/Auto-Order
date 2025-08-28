'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Users, Phone, Mail, Calendar, MessageSquare, Search, Filter, Eye, Download } from 'lucide-react'
import Link from 'next/link'

interface Lead {
  id: string
  marca_model: string
  buget: string
  contact: string
  extra: Record<string, any>
  status: string
  created_at: string
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads')
      const data = await response.json()
      setLeads(data.data || [])
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca lead-urile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.marca_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.buget.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLeads(filtered)
  }

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error('Eroare la actualizare')

      toast({
        title: "Succes",
        description: "Status actualizat",
      })

      fetchLeads()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Nou', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      qualified: { label: 'Calificat', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      quoted: { label: 'Cotat', variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprobat', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      ordered: { label: 'Comandat', variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrat', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEmail = (contact: string) => {
    return contact.includes('@')
  }

  const getStatusCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length
  }

  const exportLeadsToCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: "Eroare",
        description: "Nu există lead-uri de exportat",
        variant: "destructive",
      })
      return
    }

    const headers = ['ID', 'Mașină', 'Buget', 'Contact', 'Status', 'Data creării', 'Detalii suplimentare']
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `"${lead.marca_model}"`,
        `"${lead.buget}"`,
        `"${lead.contact}"`,
        lead.status,
        formatDate(lead.created_at),
        `"${Object.entries(lead.extra).map(([k, v]) => `${k}: ${v}`).join('; ')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Succes",
      description: `${filteredLeads.length} lead-uri exportate cu succes`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Se încarcă lead-urile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionare Lead-uri</h1>
        <p className="text-muted-foreground">
          Gestionează solicitările clienților
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getStatusCount('new')}</div>
            <p className="text-xs text-muted-foreground">Noi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getStatusCount('qualified')}</div>
            <p className="text-xs text-muted-foreground">Calificate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{getStatusCount('quoted')}</div>
            <p className="text-xs text-muted-foreground">Cotate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{getStatusCount('approved')}</div>
            <p className="text-xs text-muted-foreground">Aprobate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{getStatusCount('ordered')}</div>
            <p className="text-xs text-muted-foreground">Comandate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getStatusCount('delivered')}</div>
            <p className="text-xs text-muted-foreground">Livrate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtre și Căutare</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după mașină, contact sau buget..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrează după status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate statusurile</SelectItem>
                <SelectItem value="new">Nou</SelectItem>
                <SelectItem value="qualified">Calificat</SelectItem>
                <SelectItem value="quoted">Cotat</SelectItem>
                <SelectItem value="approved">Aprobat</SelectItem>
                <SelectItem value="ordered">Comandat</SelectItem>
                <SelectItem value="delivered">Livrat</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center justify-center">
              {filteredLeads.length} din {leads.length} lead-uri
            </div>
            
            <Button 
              onClick={exportLeadsToCSV} 
              variant="outline" 
              className="flex items-center space-x-2"
              disabled={filteredLeads.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {lead.marca_model}
                    </h3>
                    {getStatusBadge(lead.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Buget:</span>
                      <span className="font-medium">{lead.buget}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isEmail(lead.contact) ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">Contact:</span>
                      <span className="font-medium">{lead.contact}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Data:</span>
                      <span className="font-medium">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>

                  {Object.keys(lead.extra).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Detalii suplimentare:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(lead.extra).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="ml-1 font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nou</SelectItem>
                      <SelectItem value="qualified">Calificat</SelectItem>
                      <SelectItem value="quoted">Cotat</SelectItem>
                      <SelectItem value="approved">Aprobat</SelectItem>
                      <SelectItem value="ordered">Comandat</SelectItem>
                      <SelectItem value="delivered">Livrat</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/leads?edit=${lead.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Vezi detalii
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredLeads.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {leads.length === 0 ? 'Nu există lead-uri' : 'Nu s-au găsit lead-uri'}
              </h3>
              <p className="text-muted-foreground">
                {leads.length === 0 
                  ? 'Lead-urile vor apărea aici când clienții vor face solicitări'
                  : 'Încearcă să modifici filtrele de căutare'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
