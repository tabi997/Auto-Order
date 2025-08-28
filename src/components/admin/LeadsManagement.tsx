'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Users, Phone, Mail, Calendar, MessageSquare } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

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
      new: { label: 'Nou', variant: 'default' as const },
      qualified: { label: 'Calificat', variant: 'secondary' as const },
      quoted: { label: 'Cotat', variant: 'outline' as const },
      approved: { label: 'Aprobat', variant: 'default' as const },
      ordered: { label: 'Comandat', variant: 'secondary' as const },
      delivered: { label: 'Livrat', variant: 'default' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    return <Badge variant={config.variant}>{config.label}</Badge>
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

      <div className="grid gap-4">
        {leads.map((lead) => (
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(lead.created_at)}</span>
                  </div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {leads.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nu există lead-uri</h3>
              <p className="text-muted-foreground">
                Lead-urile vor apărea aici când clienții vor face solicitări
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
