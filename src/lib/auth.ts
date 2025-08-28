import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  console.log('🔐 requireAdmin called')
  
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  console.log('👤 Auth result:', { 
    hasUser: !!user, 
    userId: user?.id,
    hasError: !!error,
    error: error?.message 
  })
  
  if (error || !user) {
    console.log('❌ No user found, redirecting to login')
    redirect('/admin/login')
  }
  
  const userMetadata = user.user_metadata
  console.log('📋 User metadata:', userMetadata)
  
  if (userMetadata?.role !== 'admin') {
    console.log('❌ User is not admin, redirecting to login')
    redirect('/admin/login')
  }
  
  console.log('✅ Admin user verified:', user.id)
  return user
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

// Server-side signOut function
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
