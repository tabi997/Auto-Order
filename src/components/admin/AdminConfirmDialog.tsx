'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-react'

interface AdminConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  type?: 'delete' | 'warning' | 'info' | 'success'
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'delete',
  confirmLabel,
  cancelLabel = 'Anulează',
  isLoading = false
}: AdminConfirmDialogProps) {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getConfirmLabel = () => {
    if (confirmLabel) return confirmLabel
    
    switch (type) {
      case 'delete':
        return 'Șterge'
      case 'warning':
        return 'Continuă'
      case 'info':
        return 'OK'
      case 'success':
        return 'Confirmă'
      default:
        return 'Confirmă'
    }
  }

  const getConfirmVariant = () => {
    switch (type) {
      case 'delete':
        return 'destructive' as const
      case 'warning':
        return 'default' as const
      case 'info':
        return 'outline' as const
      case 'success':
        return 'default' as const
      default:
        return 'default' as const
    }
  }

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            {getIcon()}
            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={getConfirmVariant()}
              onClick={handleConfirm}
              disabled={isLoading}
              className="min-w-20"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>...</span>
                </div>
              ) : (
                getConfirmLabel()
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Specialized delete confirmation dialog
export function AdminDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}) {
  const defaultTitle = title || 'Confirmă ștergerea'
  const defaultDescription = description || 
    (itemName 
      ? `Ești sigur că vrei să ștergi "${itemName}"? Această acțiune nu poate fi anulată.`
      : 'Ești sigur că vrei să ștergi acest element? Această acțiune nu poate fi anulată.'
    )

  return (
    <AdminConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={defaultTitle}
      description={defaultDescription}
      type="delete"
      confirmLabel="Șterge"
      isLoading={isLoading}
    />
  )
}

// Specialized warning confirmation dialog
export function AdminWarningDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Continuă',
  isLoading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
}) {
  return (
    <AdminConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      type="warning"
      confirmLabel={confirmLabel}
      isLoading={isLoading}
    />
  )
}
