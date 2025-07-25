import { z } from "zod"

export const testimonialBaseSchema = z.object({
  name: z.string(),
  title: z.string(),
  rating: z.number().int().min(1).max(5).default(1),
  message: z.string(),
})

export const updateTestimonialSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().optional(),
  is_published: z.boolean().optional(),
  position: z.number().int().optional(),
})

export type TestimonialBaseFormData = z.infer<typeof testimonialBaseSchema>
export type UpdateTestimonialFormData = z.infer<typeof updateTestimonialSchema>
