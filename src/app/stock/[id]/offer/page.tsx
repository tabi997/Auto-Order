import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OfferRequestForm from '@/components/stock/OfferRequestForm'

interface OfferRequestPageProps {
  params: {
    id: string
  }
}

export default async function OfferRequestPage({ params }: OfferRequestPageProps) {
  const supabase = createClient()
  
  // Fetch vehicle details
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !vehicle) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OfferRequestForm vehicle={vehicle} />
    </div>
  )
}
