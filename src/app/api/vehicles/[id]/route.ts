import { NextRequest, NextResponse } from 'next/server';
import vehicles from '@/data/vehicles.json';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find vehicle by ID
    const vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return NextResponse.json(
        { 
          ok: false, 
          message: 'Vehiculul nu a fost găsit' 
        },
        { status: 404 }
      );
    }
    
    // Get related vehicles (same brand or similar price range)
    const relatedVehicles = vehicles
      .filter(v => v.id !== id && (v.brand === vehicle.brand || Math.abs(v.price - vehicle.price) < 5000))
      .slice(0, 4);
    
    return NextResponse.json({
      ok: true,
      vehicle,
      relatedVehicles,
    });
    
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { 
        ok: false, 
        message: 'A apărut o eroare la încărcarea vehiculului' 
      },
      { status: 500 }
    );
  }
}
