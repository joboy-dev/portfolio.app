import { BaseModelInterface } from "@/lib/interfaces/general";

export interface TestimonialInterface extends BaseModelInterface {
  name: string;
  title: string;
  rating: number;
  message: string;
  is_published: boolean;
}
