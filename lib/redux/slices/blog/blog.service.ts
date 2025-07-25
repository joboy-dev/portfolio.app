import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { BlogInterface } from "@/lib/interfaces/blog";
import API from "@/lib/utils/API";
import { BlogBaseFormData, UpdateBlogFormData } from "@/lib/validators/blog";

export interface GetBlogsParams extends BaseGetParams {
  // Add filter params here
};

const getBlogs = async (params: GetBlogsParams): Promise<ApiResponse<BlogInterface[]>> => {
  const { data } = await API.get("/blogs", { params });
  return data;
};

const getBlogById = async (id: string): Promise<ApiResponse<BlogInterface>> => {
    const { data } = await API.get(`/blogs/${id}`)
    return data
}

const deleteBlog = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/blogs/${id}`)
    return data
}

const createBlog = async (payload: BlogBaseFormData): Promise<ApiResponse<BlogInterface>> => {
    const { data } = await API.post(`/blogs`, payload)
    return data
}

const updateBlog = async ({
    id,
    payload,
}: {id: string, payload: UpdateBlogFormData}
): Promise<ApiResponse<BlogInterface>> => {
    const { data } = await API.patch(`/blogs/${id}`, payload)
    return data
}

export const blogsService = {
    getBlogs,
    getBlogById,
    deleteBlog,
    createBlog,
    updateBlog
}
