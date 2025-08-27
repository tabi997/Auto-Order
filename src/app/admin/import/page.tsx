import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '../actions'
import { ImportContent } from './ImportContent'

export const metadata: Metadata = {
  title: 'Import Openlane - Admin AutoOrder',
  description: 'Import anunțuri din linkuri Openlane',
}

export default async function AdminImportPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  return <ImportContent user={user} />
}
