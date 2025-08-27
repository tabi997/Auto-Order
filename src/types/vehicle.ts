export interface VehicleSpecs {
  engine: string;
  power: string;
  color: string;
  doors: number;
  seats: number;
}

export interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  km: number;
  fuel: string;
  gearbox: string;
  body: string;
  country: string;
  badges: string[];
  shortDesc: string;
  description: string;
  images: string[];
  sourceUrl?: string;
  sourceName?: string;
  specs: VehicleSpecs;
}

// Tip pentru vehiculele din API (transformate)
export interface ApiVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  body: string;
  fuel: string;
  gearbox: string;
  country: string;
  image: string;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
  type?: string;
  status?: string;
}

export interface FilterOptions {
  brands: string[];
  models: string[];
  bodies: string[];
  fuels: string[];
  countries: string[];
  gearboxes: string[];
  yearRange: { min: number; max: number };
  kmRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse {
  ok: boolean;
  vehicles: ApiVehicle[];
  pagination: Pagination;
  filters: FilterOptions;
}
