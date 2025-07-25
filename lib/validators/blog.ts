import { z } from "zod"

export const blogBaseSchema = z.object({

})

export const updateBlogSchema = blogBaseSchema.partial()

export type BlogBaseFormData = z.infer<typeof blogBaseSchema>
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>
