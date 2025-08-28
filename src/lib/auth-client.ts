import { createClient } from './supabase/client'

// Client-side signOut function
export async function signOutClient() {
  const supabase = createClient()
  
  try {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  } catch (error) {
    console.error('Error during client sign out:', error)
    window.location.href = '/admin/login'
  }
}

// Client-side getCurrentUser function
export async function getCurrentUserClient() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user on client:', error)
    return null
  }
}

// Client-side check if user has admin role
export function hasAdminRoleClient(user: any): boolean {
  return user?.user_metadata?.role === 'admin'
}

// Client-side check if user has any role
export function hasRoleClient(user: any, role: string): boolean {
  return user?.user_metadata?.role === role
}
