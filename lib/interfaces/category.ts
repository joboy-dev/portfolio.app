import type { BaseModelInterface } from "@/lib/interfaces/general"

export interface CategoryInterface extends BaseModelInterface {
  name: string
  description?: string
  slug?: string
  model_type: string
}