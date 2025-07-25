import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ExperienceInterface } from "@/lib/interfaces/experience"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { experiencesService, type GetExperiencesParams } from "../experience/experience.service"
import type { ExperienceBaseFormData, UpdateExperienceFormData } from "@/lib/validators/experience"

interface UpdateExperienceParams extends UpdateParams<UpdateExperienceFormData> {}

interface ExperienceState {
    experiences: ExperienceInterface[]
    selectedExperience?: ExperienceInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: ExperienceState = {
    experiences: [],
    selectedExperience: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getExperiences = createAsyncThunk(
    'experiences/getExperiences',
    async (params: GetExperiencesParams): Promise<ApiResponse<ExperienceInterface[]> | undefined> => {
        try {
            const data = await experiencesService.getExperiences(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createExperience = createAsyncThunk(
    'experiences/create',
    async (payload: ExperienceBaseFormData): Promise<ExperienceInterface | undefined> => {
        try {
            const data = await experiencesService.createExperience(payload)
            const service = data?.data
            toaster.success("Experience created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getExperienceById = createAsyncThunk<ExperienceInterface | undefined, GetByIdParams>(
    "experiences/getById",
    async ({id}): Promise<ExperienceInterface | undefined> => {
        try {
            const data = await experiencesService.getExperienceById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteExperience = createAsyncThunk<ExperienceInterface | undefined, GetByIdParams>(
    "experiences/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await experiencesService.deleteExperience(id)
            toaster.success("Experience deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateExperience = createAsyncThunk<ExperienceInterface | undefined, UpdateExperienceParams>(
    "experiences/update",
    async ({id, payload}): Promise<ExperienceInterface | undefined> => {
        try {
            const data = await experiencesService.updateExperience({
                id: id, 
                payload: payload
            })
            toaster.success("Experience updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const experienceSlice = createSlice({
    name: "experiences",
    initialState,
    reducers: {
        setExperiences: (state, action) => {
            state.experiences = action.payload;
        },
        setSelectedExperience: (state, action) => {
            state.selectedExperience = action.payload
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
        .addCase(getExperiences.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getExperiences.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.experiences = payload?.data ?? [];
        })
        .addCase(getExperiences.rejected, (state) => {
            state.isLoading = false;
            state.experiences = [];
        })
        .addCase(getExperienceById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getExperienceById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedExperience = payload;
        })
        .addCase(getExperienceById.rejected, (state) => {
            state.isLoading = false;
            state.selectedExperience = undefined;
        })
        .addCase(createExperience.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createExperience.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.experiences = [payload, ...state.experiences]
            }
        })
        .addCase(updateExperience.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateExperience.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.experiences) {
                const index = state.experiences.findIndex(experience => experience.id === payload.id);
                if (index !== -1) {
                    state.experiences[index] = payload;
                }
            }

            if (payload) {
                state.selectedExperience = payload;
            }
        })
        .addCase(deleteExperience.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteExperience.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.experiences = state.experiences.filter(experience => experience.id !== deletedId);

            if (state.selectedExperience?.id === deletedId) {
                state.selectedExperience = undefined;
            }
        })
    }
})

export const { 
    setSelectedExperience, 
    setExperiences,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = experienceSlice.actions;
export default experienceSlice.reducer;
