import type { BaseGetParams } from "@/lib/interfaces/general";
import API from "@/lib/utils/API";
import type { ApiResponse } from "@/lib/interfaces/response";
import type { AttachOrDetatchTagFormData, CreateTagFormData, UpdateTagFormData } from "@/lib/validators/tag";
import { ProcessError } from "@/lib/utils/Error";
import toaster from "@/lib/utils/toaster";
import { TagInterface } from "@/lib/interfaces/tag";

export interface GetTagsParams extends BaseGetParams {
  model_type?: string;
  name?: string;
  group?: string;
  parent_id?: string;
};

const getTags = async (params: GetTagsParams): Promise<ApiResponse<TagInterface[]>> => {
  const { data } = await API.get("/tags", { params });
  return data;
};

const getTagById = async (id: string): Promise<ApiResponse<TagInterface>> => {
    const { data } = await API.get(`/tags/${id}`)
    return data
}

const deleteTag = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/tags/${id}`)
    return data
}

const createTag = async (
    payload: CreateTagFormData
): Promise<ApiResponse<TagInterface>> => {
    const { data } = await API.post("/tags", payload)
    return data
}

const updateTag = async ({
    id,
    payload
}: {id: string, payload: UpdateTagFormData}
): Promise<ApiResponse<TagInterface>> => {
    const { data } = await API.patch(`/tags/${id}`, payload)
    return data
}

const attachTagsToEntity = async ({
    payload
}: {payload: AttachOrDetatchTagFormData}
): Promise<ApiResponse<any> | undefined> => {
    try {
        const { data } = await API.post(`/tags/attach`, payload)
        toaster.success("Tags attached successfullyy")
        return data
    } catch (error) {
        ProcessError(error)
        return
    }
}

const detatchTagsFromEntity = async ({
    payload
}: {payload: AttachOrDetatchTagFormData}
): Promise<ApiResponse<any> | undefined> => {
    try {
        const { data } = await API.post(`/tags/detatch`, payload)
        toaster.success("Tags detatched successfullyy")
        return data
    } catch (error) {
        ProcessError(error)
        return
    }
}

export const tagService = {
    getTags,
    getTagById,
    deleteTag,
    createTag,
    updateTag,
    attachTagsToEntity,
    detatchTagsFromEntity
}