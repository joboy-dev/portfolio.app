import type { BaseModelInterface } from "@/lib/interfaces/general"
import type { TagInterface } from "@/lib/interfaces/tag"
import { FileInterface } from "./file"

export interface ProjectInterface extends BaseModelInterface {
  name: string
  tagline?: string
  slug: string
  description?: string
  tools?: string[]
  features?: string[]
  results?: string[]
  challenges_and_solutions?: Record<string, string>
  technical_details?: Record<string, string>
  domain: string
  project_type: string
  role: string
  client?: string
  sector?: string
  start_date?: string
  end_date?: string
  status?: string
  github_link?: string
  postman_link?: string
  live_link?: string
  google_drive_link?: string
  figma_link?: string
  files?: FileInterface[]
  tags?: TagInterface[]
}
