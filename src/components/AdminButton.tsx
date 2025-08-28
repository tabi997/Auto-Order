'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import { useUserRole } from '@/lib/hooks/useUserRole'

interface AdminButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
  className?: string
  showText?: boolean
  mobile?: boolean
}

export function AdminButton({ 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  showText = true,
  mobile = false
}: AdminButtonProps) {
  const { isAdmin, isLoading } = useUserRole()
  
  if (isLoading || !isAdmin) {
    return null
  }
  
  const buttonContent = (
    <>
      <Shield className="h-4 w-4 mr-2" />
      {showText && 'Admin'}
    </>
  )
  
  if (mobile) {
    return (
      <Link 
        href="/admin"
        className="block w-full"
      >
        <Button 
          variant={variant}
          size={size}
          className={`w-full justify-center border-purple-500/30 text-purple-600 hover:bg-purple-500/5 hover:border-purple-500/50 transition-all duration-200 py-3 ${className}`}
        >
          {buttonContent}
        </Button>
      </Link>
    )
  }
  
  return (
    <Link href="/admin">
      <Button 
        variant={variant}
        size={size}
        className={`border-purple-500/30 text-purple-600 hover:bg-purple-500/5 hover:border-purple-500/50 transition-all duration-200 whitespace-nowrap text-xs lg:text-sm px-2 lg:px-3 ${className}`}
      >
        {buttonContent}
      </Button>
    </Link>
  )
}
