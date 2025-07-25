import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ProjectInterface } from "@/lib/interfaces/project"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { projectsService, type GetProjectsParams } from "../project/project.service"
import type { ProjectBaseFormData, UpdateProjectFormData } from "@/lib/validators/project"

interface UpdateProjectParams extends UpdateParams<UpdateProjectFormData> {}

interface ProjectState {
    projects: ProjectInterface[]
    selectedProject?: ProjectInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: ProjectState = {
    projects: [],
    selectedProject: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getProjects = createAsyncThunk(
    'projects/getProjects',
    async (params: GetProjectsParams): Promise<ApiResponse<ProjectInterface[]> | undefined> => {
        try {
            const data = await projectsService.getProjects(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createProject = createAsyncThunk(
    'projects/create',
    async (payload: ProjectBaseFormData): Promise<ProjectInterface | undefined> => {
        try {
            const data = await projectsService.createProject(payload)
            const service = data?.data
            toaster.success("Project created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getProjectById = createAsyncThunk<ProjectInterface | undefined, GetByIdParams>(
    "projects/getById",
    async ({id}): Promise<ProjectInterface | undefined> => {
        try {
            const data = await projectsService.getProjectById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteProject = createAsyncThunk<ProjectInterface | undefined, GetByIdParams>(
    "projects/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await projectsService.deleteProject(id)
            toaster.success("Project deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateProject = createAsyncThunk<ProjectInterface | undefined, UpdateProjectParams>(
    "projects/update",
    async ({id, payload}): Promise<ProjectInterface | undefined> => {
        try {
            const data = await projectsService.updateProject({
                id: id, 
                payload: payload
            })
            toaster.success("Project updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setSelectedProject: (state, action) => {
            state.selectedProject = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload
        },
        setTotal: (state, action) => {
            state.total = action.payload
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getProjects.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getProjects.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.projects = payload?.data ?? [];
        })
        .addCase(getProjects.rejected, (state) => {
            state.isLoading = false;
            state.projects = [];
        })
        .addCase(getProjectById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getProjectById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedProject = payload;
        })
        .addCase(getProjectById.rejected, (state) => {
            state.isLoading = false;
            state.selectedProject = undefined;
        })
        .addCase(createProject.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createProject.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.projects = [payload, ...state.projects]
            }
        })
        .addCase(updateProject.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateProject.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.projects) {
                const index = state.projects.findIndex(project => project.id === payload.id);
                if (index !== -1) {
                    state.projects[index] = payload;
                }
            }

            if (payload) {
                state.selectedProject = payload;
            }
        })
        .addCase(deleteProject.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteProject.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.projects = state.projects.filter(project => project.id !== deletedId);

            if (state.selectedProject?.id === deletedId) {
                state.selectedProject = undefined;
            }
        })
    }
})

export const { 
    setSelectedProject, 
    setProjects,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = projectSlice.actions;
export default projectSlice.reducer;
