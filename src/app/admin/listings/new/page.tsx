import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../actions'
import { ListingForm } from './ListingForm'

export default async function NewListingPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Adaugă anunț nou</h1>
        <p className="text-muted-foreground">Completează informațiile despre vehicul</p>
      </div>
      
      <ListingForm />
    </div>
  )
}
