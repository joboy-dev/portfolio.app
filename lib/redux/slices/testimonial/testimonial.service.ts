import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { TestimonialInterface } from "@/lib/interfaces/testimonial";
import API from "@/lib/utils/API";
import { TestimonialBaseFormData, UpdateTestimonialFormData } from "@/lib/validators/testimonial";

export interface GetTestimonialsParams extends BaseGetParams {
  name?: string;
  is_published?: boolean;
};

const getTestimonials = async (params: GetTestimonialsParams): Promise<ApiResponse<TestimonialInterface[]>> => {
  const { data } = await API.get("/testimonials", { params });
  return data;
};

const getTestimonialById = async (id: string): Promise<ApiResponse<TestimonialInterface>> => {
    const { data } = await API.get(`/testimonials/${id}`)
    return data
}

const deleteTestimonial = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/testimonials/${id}`)
    return data
}

const createTestimonial = async (payload: TestimonialBaseFormData): Promise<ApiResponse<TestimonialInterface>> => {
    const { data } = await API.post(`/testimonials`, payload)
    return data
}

const updateTestimonial = async ({
    id,
    payload,
}: {id: string, payload: UpdateTestimonialFormData}
): Promise<ApiResponse<TestimonialInterface>> => {
    const { data } = await API.patch(`/testimonials/${id}`, payload)
    return data
}

export const testimonialsService = {
    getTestimonials,
    getTestimonialById,
    deleteTestimonial,
    createTestimonial,
    updateTestimonial
}
