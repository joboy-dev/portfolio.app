import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { ProjectInterface } from "@/lib/interfaces/project";
import API from "@/lib/utils/API";
import { ProjectBaseFormData, UpdateProjectFormData } from "@/lib/validators/project";

export interface GetProjectsParams extends BaseGetParams {
  // Add filter params here
};

const getProjects = async (params: GetProjectsParams): Promise<ApiResponse<ProjectInterface[]>> => {
  const { data } = await API.get("/projects", { params });
  return data;
};

const getProjectById = async (id: string): Promise<ApiResponse<ProjectInterface>> => {
    const { data } = await API.get(`/projects/${id}`)
    return data
}

const deleteProject = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/projects/${id}`)
    return data
}

const createProject = async (payload: ProjectBaseFormData): Promise<ApiResponse<ProjectInterface>> => {
    const { data } = await API.post(`/projects`, payload)
    return data
}

const updateProject = async ({
    id,
    payload,
}: {id: string, payload: UpdateProjectFormData}
): Promise<ApiResponse<ProjectInterface>> => {
    const { data } = await API.patch(`/projects/${id}`, payload)
    return data
}

export const projectsService = {
    getProjects,
    getProjectById,
    deleteProject,
    createProject,
    updateProject
}
