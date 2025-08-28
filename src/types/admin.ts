import { z } from 'zod'
// Using string literals instead of enums for SQLite compatibility

export const listingSchema = z.object({
  title: z.string().min(3, 'Titlul trebuie să aibă cel puțin 3 caractere'),
  brand: z.string().min(2, 'Marca trebuie să aibă cel puțin 2 caractere'),
  model: z.string().min(1, 'Modelul este obligatoriu'),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  price_eur: z.number().int().min(0, 'Prețul trebuie să fie pozitiv'),
  km: z.number().int().min(0, 'Kilometrajul trebuie să aibă cel puțin 2 caractere'),
  fuel: z.enum(['Benzina', 'Diesel', 'Hybrid', 'Electric']),
  gearbox: z.enum(['Automata', 'Manuala']),
  body: z.enum(['SUV', 'Sedan', 'Hatchback', 'Break', 'Coupe', 'MPV', 'Pickup', 'Alt']),
  country: z.string().min(2, 'Țara trebuie să aibă cel puțin 2 caractere'),
  type: z.enum(['BUY_NOW', 'AUCTION']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD']),
  short_desc: z.string().max(300, 'Descrierea nu poate depăși 300 de caractere').optional(),
  source_url: z.string().url('URL invalid').optional().or(z.literal('')),
  source_name: z.string().optional(),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string().url('URL invalid'),
    alt: z.string().optional()
  })).max(8, 'Nu pot fi adăugate mai mult de 8 imagini').optional(),
})

export const importSchema = z.object({
  urls: z.string().min(1, 'Introduceți cel puțin un URL'),
})

export type ListingFormData = z.infer<typeof listingSchema>
export type ImportFormData = z.infer<typeof importSchema>

export interface AdminUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export interface ListingWithImages {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price_eur: number
  km: number
  fuel: string
  gearbox: string
  body: string
  country: string
  type: string
  status: string
  short_desc?: string | null
  cover_url?: string | null
  source_url?: string | null
  source_name?: string | null
  created_at: string
  updated_at: string
  images: Array<{
    id: string
    url: string
    alt?: string | null
  }>
}

export interface ImportResult {
  success: boolean
  message: string
  listings?: Array<{
    id: string
    title: string
    status: string
  }>
  errors?: string[]
  error?: string
}

export interface UploadResult {
  url: string
  public_id: string
}
