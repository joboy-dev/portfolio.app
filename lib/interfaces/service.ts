import { FileInterface } from "./file";
import { BaseModelInterface } from "./general";

export interface ServiceInterface extends BaseModelInterface {
  name: string;
  description?: string;
  skills?: string[];
  file_id?: string;
  service_logo?: FileInterface;
}
