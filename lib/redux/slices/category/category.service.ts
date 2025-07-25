import type { CategoryInterface } from "@/lib/interfaces/category";
import type { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import API from "@/lib/utils/API";
import { ProcessError } from "@/lib/utils/Error";
import toaster from "@/lib/utils/toaster";
import type { AttachOrDetatchCategoryFormData, CreateCategoryFormData, UpdateCategoryFormData } from "@/lib/validators/category";

export interface GetCategoriesParams extends BaseGetParams {
  model_type?: string;
  name?: string;
  slug?: string;
};

const getCategories = async (params: GetCategoriesParams): Promise<ApiResponse<CategoryInterface[]>> => {
  const { data } = await API.get("/categories", { params });
  return data;
};

const getCategoryById = async (id: string): Promise<ApiResponse<CategoryInterface>> => {
    const { data } = await API.get(`/categories/${id}`)
    return data
}

const deleteCategory = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/categories/${id}`)
    return data
}

const createCategory = async (
    payload: CreateCategoryFormData
): Promise<ApiResponse<CategoryInterface>> => {
    const { data } = await API.post("/categories", payload)
    return data
}

const updateCategory = async ({
    id,
    payload
}: {id: string, payload: UpdateCategoryFormData}
): Promise<ApiResponse<CategoryInterface>> => {
    const { data } = await API.patch(`/categories/${id}`, payload)
    return data
}

const attachCategoriesToEntity = async ({
    payload
}: {payload: AttachOrDetatchCategoryFormData}
): Promise<ApiResponse<any> | undefined> => {
    try {
        const { data } = await API.post(`/categories/attach`, payload)
        toaster.success("Categories attached successfullyy")
        return data
    } catch (error) {
        ProcessError(error)
        return
    }
}

const detatchCategoriesFromEntity = async ({
    payload
}: {payload: AttachOrDetatchCategoryFormData}
): Promise<ApiResponse<any> | undefined> => {
    try {
        const { data } = await API.post(`/categories/detatch`, payload)
        toaster.success("Categories detatched successfullyy")
        return data
    } catch (error) {
        ProcessError(error)
        return
    }
}

export const categoryService = {
    getCategories,
    getCategoryById,
    deleteCategory,
    createCategory,
    updateCategory,
    attachCategoriesToEntity,
    detatchCategoriesFromEntity
}