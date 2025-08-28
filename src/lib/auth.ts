import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/admin/login')
  }
  
  const userMetadata = user.user_metadata
  if (userMetadata?.role !== 'admin') {
    redirect('/admin/login')
  }
  
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
