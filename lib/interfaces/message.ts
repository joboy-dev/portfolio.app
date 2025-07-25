import { BaseModelInterface } from "@/lib/interfaces/general";

export interface MessageInterface extends BaseModelInterface {
  name: string;
  email: string;
  phone_country_code?: string;
  phone_number?: string;
  location?: string;
  message: string;
}
