import { redirect } from 'next/navigation'
import { getCurrentUser, getListingAction } from '../../../actions'
import { EditListingForm } from './EditListingForm'

interface EditListingPageProps {
  params: {
    id: string
  }
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  const result = await getListingAction(params.id)
  
  if (!result || result.error || !result.listing) {
    redirect('/admin/listings')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editează anunț</h1>
        <p className="text-muted-foreground">Modifică informațiile despre vehicul</p>
      </div>
      
      <EditListingForm listing={result.listing} />
    </div>
  )
}
