import { z } from 'zod';

export const TestimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Author name is required'),
  role: z.string().optional(),
  avatar_url: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  content: z.string().min(1, 'Content is required'),
  is_featured: z.boolean().default(false),
  order_index: z.number().default(0),
  badge: z.string().optional(),
  created_at: z.string().optional(),
});

export const CreateTestimonialSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  role: z.string().optional(),
  avatar_url: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  content: z.string().min(1, 'Content is required'),
  is_featured: z.boolean(),
  order_index: z.number(),
});

export const UpdateTestimonialSchema = TestimonialSchema.partial().omit({
  id: true,
  created_at: true,
});

export type Testimonial = z.infer<typeof TestimonialSchema>;
export type CreateTestimonial = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof UpdateTestimonialSchema>;
