import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VehicleDetails from '@/components/stock/VehicleDetails'

interface VehicleDetailsPageProps {
  params: {
    id: string
  }
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
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
      <VehicleDetails vehicle={vehicle} />
    </div>
  )
}
