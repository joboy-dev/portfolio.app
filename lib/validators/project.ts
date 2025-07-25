import { z } from "zod"

const urlSchema = z.string().optional().nullable().transform(e => e === '' ? null : e);

export const projectBaseSchema = z.object({
  name: z.string(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tools: z.array(z.string()).optional().nullable(),
  domain: z.string(),
  project_type: z.string(),
  role: z.string(),
  client: z.string().optional().nullable(),
  github_link: urlSchema,
  postman_link: urlSchema,
  live_link: urlSchema,
  google_drive_link: urlSchema,
  figma_link: urlSchema,
});

export const updateProjectSchema = projectBaseSchema.extend({
  name: z.string().optional(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tools: z.array(z.string()).optional().nullable(),
  domain: z.string().optional(),
  project_type: z.string().optional(),
  role: z.string().optional(),
  client: z.string().optional().nullable(),
  github_link: urlSchema,
  postman_link: urlSchema,
  live_link: urlSchema,
  google_drive_link: urlSchema,
  figma_link: urlSchema,
  position: z.number().int().optional(),
}).partial();

export type ProjectBaseFormData = z.infer<typeof projectBaseSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>
