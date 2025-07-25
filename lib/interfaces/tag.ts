import type { BaseModelInterface } from "@/lib/interfaces/general"

export interface TagInterface extends BaseModelInterface {
  name: string
  model_type: string
}
