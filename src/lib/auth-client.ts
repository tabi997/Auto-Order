import { createClient } from './supabase/client'

// Client-side signOut function
export async function signOutClient() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/admin/login'
}

// Client-side getCurrentUser function
export async function getCurrentUserClient() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}
