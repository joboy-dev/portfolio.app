import { z } from "zod"
import { additionalInfoSchema } from "./general";

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
  sector: z.string().optional().nullable(),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  status: z.string().optional().nullable(),
  github_link: urlSchema,
  postman_link: urlSchema,
  live_link: urlSchema,
  google_drive_link: urlSchema,
  figma_link: urlSchema,
  features: z.array(z.string()).optional().nullable(),
  results: z.array(z.string()).optional().nullable(),
  challenges_and_solutions: z.array(z.string()).optional().nullable(),
  technical_details: additionalInfoSchema.optional().nullable(),
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
  sector: z.string().optional().nullable(),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  status: z.string().optional().nullable(),
  github_link: urlSchema,
  postman_link: urlSchema,
  live_link: urlSchema,
  google_drive_link: urlSchema,
  figma_link: urlSchema,
  features: z.array(z.string()).optional().nullable(),
  results: z.array(z.string()).optional().nullable(),
  challenges_and_solutions: additionalInfoSchema.optional().nullable(),
  challenges_and_solutions_keys_to_remove: z.array(z.string()).optional().nullable(),
  technical_details: additionalInfoSchema.optional().nullable(),
  technical_details_keys_to_remove: z.array(z.string()).optional().nullable(),
  position: z.number().int().optional(),
}).partial();

export type ProjectBaseFormData = z.infer<typeof projectBaseSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>
