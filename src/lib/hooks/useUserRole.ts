'use client'

import { useAuth } from '@/lib/auth-context'

export function useUserRole() {
  const { user, isAdmin, isLoading } = useAuth()
  
  const hasRole = (role: string): boolean => {
    if (!user || isLoading) return false
    return user.user_metadata?.role === role
  }
  
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || isLoading) return false
    return roles.includes(user.user_metadata?.role)
  }
  
  const isStaff = hasRole('staff')
  const isUser = hasRole('user')
  
  return {
    user,
    isAdmin,
    isStaff,
    isUser,
    hasRole,
    hasAnyRole,
    isLoading,
    isAuthenticated: !!user && !isLoading
  }
}
