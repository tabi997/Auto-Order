import { z } from 'zod'
// Using string literals instead of enums for SQLite compatibility

export const listingSchema = z.object({
  title: z.string().min(3, 'Titlul trebuie să aibă cel puțin 3 caractere'),
  brand: z.string().min(2, 'Marca trebuie să aibă cel puțin 2 caractere'),
  model: z.string().min(1, 'Modelul este obligatoriu'),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  priceEur: z.number().int().min(0, 'Prețul trebuie să fie pozitiv'),
  km: z.number().int().min(0, 'Kilometrajul trebuie să aibă cel puțin 2 caractere'),
  fuel: z.enum(['Benzina', 'Diesel', 'Hybrid', 'Electric']),
  gearbox: z.enum(['Automata', 'Manuala']),
  body: z.enum(['SUV', 'Sedan', 'Hatchback', 'Break', 'Coupe', 'MPV', 'Pickup', 'Alt']),
  country: z.string().min(2, 'Țara trebuie să aibă cel puțin 2 caractere'),
  type: z.enum(['BUY_NOW', 'AUCTION']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD']),
  shortDesc: z.string().max(300, 'Descrierea nu poate depăși 300 de caractere').optional(),
  sourceUrl: z.string().url('URL invalid').optional().or(z.literal('')),
  sourceName: z.string().optional(),
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
  priceEur: number
  km: number
  fuel: string
  gearbox: string
  body: string
  country: string
  type: string
  status: string
  shortDesc?: string | null
  coverUrl?: string | null
  sourceUrl?: string | null
  sourceName?: string | null
  createdAt: Date
  updatedAt: Date
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
