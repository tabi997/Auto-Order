import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '../actions'
import { ListingsContent } from './ListingsContent'

export const metadata: Metadata = {
  title: 'Gestionare Anunțuri - Admin AutoOrder',
  description: 'Administrare anunțuri AutoOrder',
}

export default async function AdminListingsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <ListingsContent user={user} />
}
