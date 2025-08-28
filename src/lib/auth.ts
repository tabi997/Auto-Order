import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = createClient()
  
  try {
    console.log('🔐 requireAdmin - Start authentication check');
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log('👤 User data:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      hasError: !!error
    });
    
    if (error) {
      console.log('❌ Auth error:', error.message);
      redirect('/admin/login')
    }
    
    if (!user) {
      console.log('❌ No user found');
      redirect('/admin/login')
    }
    
    const userMetadata = user.user_metadata
    console.log('🏷️ User metadata:', {
      hasMetadata: !!userMetadata,
      role: userMetadata?.role,
      allMetadata: userMetadata
    });
    
    if (userMetadata?.role !== 'admin') {
      console.log('❌ User is not admin. Role:', userMetadata?.role);
      redirect('/admin/login')
    }
    
    console.log('✅ Admin check passed successfully');
    return user
  } catch (error) {
    console.error('❌ Auth error in requireAdmin:', error)
    redirect('/admin/login')
  }
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Server-side signOut function
export async function signOut() {
  const supabase = createClient()
  
  try {
    await supabase.auth.signOut()
    redirect('/admin/login')
  } catch (error) {
    console.error('Error during sign out:', error)
    redirect('/admin/login')
  }
}

// Utility function to check if user has admin role
export function hasAdminRole(user: any): boolean {
  return user?.user_metadata?.role === 'admin'
}

// Utility function to check if user has any role
export function hasRole(user: any, role: string): boolean {
  return user?.user_metadata?.role === role
}
