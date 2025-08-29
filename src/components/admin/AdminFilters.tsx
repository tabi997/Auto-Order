'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FilterOption {
  value: string
  label: string
}

interface AdminFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter?: string
  onStatusChange?: (value: string) => void
  statusOptions?: FilterOption[]
  placeholder?: string
  showStatusFilter?: boolean
  className?: string
}

export function AdminFilters({
  searchTerm,
  onSearchChange,
  statusFilter = 'all',
  onStatusChange,
  statusOptions = [
    { value: 'all', label: 'Toate' },
    { value: 'new', label: 'Nou' },
    { value: 'qualified', label: 'Calificat' },
    { value: 'quoted', label: 'Cotat' },
    { value: 'approved', label: 'Aprobat' },
    { value: 'ordered', label: 'Comandat' },
    { value: 'delivered', label: 'Livrat' }
  ],
  placeholder = 'Caută...',
  showStatusFilter = true,
  className = ''
}: AdminFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClearFilters = () => {
    onSearchChange('')
    if (onStatusChange) {
      onStatusChange('all')
    }
  }

  const hasActiveFilters = searchTerm || (statusFilter && statusFilter !== 'all')

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtre și Căutare</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-3"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Resetează</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-3"
            >
              {isExpanded ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Ascunde</span>
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Filtre</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input - Always Visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* Expandable Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {showStatusFilter && onStatusChange && (
              <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={onStatusChange}>
                  <SelectTrigger id="status-filter" className="h-10">
                    <SelectValue placeholder="Selectează status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtre active:</span>
              {searchTerm && (
                <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  <Search className="h-3 w-3" />
                  <span>Căutare: "{searchTerm}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {statusFilter && statusFilter !== 'all' && (
                <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  <Filter className="h-3 w-3" />
                  <span>Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
                  {onStatusChange && (
                    <button
                      onClick={() => onStatusChange('all')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
