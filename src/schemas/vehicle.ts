import { z } from "zod";

export const VehicleZ = z.object({
  make: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().gte(1990),
  km: z.number().int().gte(0),
  fuel: z.enum(["benzina","diesel","hibrid","electric"]),
  transmission: z.enum(["manuala","automata"]),
  price_est: z.number().gte(0),
  badges: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).optional().default([]),
  source: z.string().url().optional().or(z.literal("")).default(""),
  featured: z.boolean().optional().default(false),
  featured_position: z.number().int().optional().default(0),
});

export type VehicleInput = z.infer<typeof VehicleZ>;

export const LeadZ = z.object({
  marca_model: z.string().min(2),
  buget: z.string().min(1),
  contact: z.string().min(1),
  extra: z.record(z.string(), z.any()).default({}),
});

export type LeadInput = z.infer<typeof LeadZ>;
