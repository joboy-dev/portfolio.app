import { BaseModelInterface } from "@/lib/interfaces/general";
import { FileInterface } from "./file";

export interface SkillInterface extends BaseModelInterface {
  name: string;
  proficiency?: number;
  file_id?: string;
  skill_logo?: FileInterface;
}
