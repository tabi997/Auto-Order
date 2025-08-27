import { NextRequest, NextResponse } from 'next/server';
import vehicles from '@/data/vehicles.json';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
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
    const transmission = searchParams.get('transmission');
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
      if (priceMin && vehicle.price < parseInt(priceMin)) return false;
      if (priceMax && vehicle.price > parseInt(priceMax)) return false;
      if (country && country !== 'all' && vehicle.country !== country) return false;
      if (transmission && transmission !== 'all' && vehicle.transmission !== transmission) return false;
      
      return true;
    });
    
    // Get unique values for filter options
    const brands = Array.from(new Set(vehicles.map(v => v.brand))).sort();
    const models = Array.from(new Set(vehicles.map(v => v.model))).sort();
    const bodies = Array.from(new Set(vehicles.map(v => v.body))).sort();
    const fuels = Array.from(new Set(vehicles.map(v => v.fuel))).sort();
    const countries = Array.from(new Set(vehicles.map(v => v.country))).sort();
    const transmissions = Array.from(new Set(vehicles.map(v => v.transmission))).sort();
    
    // Calculate pagination
    const total = filteredVehicles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    // Get min/max values for range filters
    const years = vehicles.map(v => v.year);
    const kms = vehicles.map(v => v.km);
    const prices = vehicles.map(v => v.price);
    
    const filterOptions = {
      brands,
      models,
      bodies,
      fuels,
      countries,
      transmissions,
      yearRange: { min: Math.min(...years), max: Math.max(...years) },
      kmRange: { min: Math.min(...kms), max: Math.max(...kms) },
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    };
    
    return NextResponse.json({
      ok: true,
      vehicles: paginatedVehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: filterOptions,
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
