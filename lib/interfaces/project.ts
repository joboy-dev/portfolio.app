import type { BaseModelInterface } from "@/lib/interfaces/general"
import type { TagInterface } from "@/lib/interfaces/tag"
import { FileInterface } from "./file"

export interface ProjectInterface extends BaseModelInterface {
  name: string
  tagline?: string
  slug: string
  description?: string
  tools?: string[]
  domain: string
  project_type: string
  role: string
  client?: string
  github_link?: string
  postman_link?: string
  live_link?: string
  google_drive_link?: string
  figma_link?: string
  files?: FileInterface[]
  tags?: TagInterface[]
}
