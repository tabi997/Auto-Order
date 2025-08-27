import { NextRequest, NextResponse } from 'next/server';
import vehiclesData from '@/data/vehicles.json';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicles = vehiclesData.vehicles;
    
    // Get filter parameters
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const body = searchParams.get('body');
    const fuel = searchParams.get('fuel');
    const yearMin = searchParams.get('yearMin');
    const yearMax = searchParams.get('yearMax');
    const kmMax = searchParams.get('kmMax');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const country = searchParams.get('country');
    const gearbox = searchParams.get('gearbox');
    const sortBy = searchParams.get('sortBy') || 'priceEur';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Apply filters
    let filteredVehicles = vehicles.filter(vehicle => {
      if (brand && brand !== 'all' && vehicle.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (model && !vehicle.model.toLowerCase().includes(model.toLowerCase())) return false;
      if (body && body !== 'all' && vehicle.body !== body) return false;
      if (fuel && fuel !== 'all' && vehicle.fuel !== fuel) return false;
      if (yearMin && vehicle.year < parseInt(yearMin)) return false;
      if (yearMax && vehicle.year > parseInt(yearMax)) return false;
      if (kmMax && vehicle.km > parseInt(kmMax)) return false;
      if (priceMin && vehicle.priceEur < parseInt(priceMin)) return false;
      if (priceMax && vehicle.priceEur > parseInt(priceMax)) return false;
      if (country && country !== 'all' && vehicle.country !== country) return false;
      if (gearbox && gearbox !== 'all' && vehicle.gearbox !== gearbox) return false;
      
      return true;
    });
    
    // Apply sorting
    filteredVehicles.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
        case 'priceEur':
          aValue = a.priceEur;
          bValue = b.priceEur;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'km':
          aValue = a.km;
          bValue = b.km;
          break;
        default:
          aValue = a.priceEur;
          bValue = b.priceEur;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    // Calculate pagination
    const total = filteredVehicles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    // Transform vehicles to match expected format
    const transformedVehicles = paginatedVehicles.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      km: vehicle.km,
      price: vehicle.priceEur,
      body: vehicle.body,
      fuel: vehicle.fuel,
      gearbox: vehicle.gearbox,
      country: vehicle.country,
      image: vehicle.images?.[0] || '/api/placeholder/400/300',
      type: (vehicle as any).type || 'BUY_NOW',
      description: vehicle.shortDesc || vehicle.description,
      sourceUrl: vehicle.sourceUrl,
      sourceName: vehicle.sourceName,
    }));
    
    return NextResponse.json({
      ok: true,
      vehicles: transformedVehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: vehiclesData.filters,
    });
    
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { 
        ok: false, 
        message: 'A apărut o eroare la încărcarea vehiculelor' 
      },
      { status: 500 }
    );
  }
}
