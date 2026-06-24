import { z } from "zod"

export const blogBaseSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  is_published: z.boolean().optional(),
})

export const updateBlogSchema = blogBaseSchema.extend({
  title: z.string().optional(),
  content: z.string().optional(),
  position: z.number().int().optional(),
}).partial()

export const blogCoverImageSchema = z.object({
  file: z.instanceof(FileList),
})

export type BlogBaseFormData = z.infer<typeof blogBaseSchema>
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>
export type BlogCoverImageFormData = z.infer<typeof blogCoverImageSchema>
