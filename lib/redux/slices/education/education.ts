import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { EducationInterface } from "@/lib/interfaces/education"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { educationsService, type GetEducationsParams } from "../education/education.service"
import type { EducationBaseFormData, UpdateEducationFormData } from "@/lib/validators/education"

interface UpdateEducationParams extends UpdateParams<UpdateEducationFormData> {}

interface EducationState {
    educations: EducationInterface[]
    selectedEducation?: EducationInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: EducationState = {
    educations: [],
    selectedEducation: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getEducations = createAsyncThunk(
    'educations/getEducations',
    async (params: GetEducationsParams): Promise<ApiResponse<EducationInterface[]> | undefined> => {
        try {
            const data = await educationsService.getEducations(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createEducation = createAsyncThunk(
    'educations/create',
    async (payload: EducationBaseFormData): Promise<EducationInterface | undefined> => {
        try {
            const data = await educationsService.createEducation(payload)
            const service = data?.data
            toaster.success("Education created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getEducationById = createAsyncThunk<EducationInterface | undefined, GetByIdParams>(
    "educations/getById",
    async ({id}): Promise<EducationInterface | undefined> => {
        try {
            const data = await educationsService.getEducationById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteEducation = createAsyncThunk<EducationInterface | undefined, GetByIdParams>(
    "educations/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await educationsService.deleteEducation(id)
            toaster.success("Education deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateEducation = createAsyncThunk<EducationInterface | undefined, UpdateEducationParams>(
    "educations/update",
    async ({id, payload}): Promise<EducationInterface | undefined> => {
        try {
            const data = await educationsService.updateEducation({
                id: id, 
                payload: payload
            })
            toaster.success("Education updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const educationSlice = createSlice({
    name: "educations",
    initialState,
    reducers: {
        setEducations: (state, action) => {
            state.educations = action.payload;
        },
        setSelectedEducation: (state, action) => {
            state.selectedEducation = action.payload
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
        .addCase(getEducations.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getEducations.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.educations = payload?.data ?? [];
        })
        .addCase(getEducations.rejected, (state) => {
            state.isLoading = false;
            state.educations = [];
        })
        .addCase(getEducationById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getEducationById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedEducation = payload;
        })
        .addCase(getEducationById.rejected, (state) => {
            state.isLoading = false;
            state.selectedEducation = undefined;
        })
        .addCase(createEducation.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createEducation.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.educations = [payload, ...state.educations]
            }
        })
        .addCase(updateEducation.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateEducation.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.educations) {
                const index = state.educations.findIndex(education => education.id === payload.id);
                if (index !== -1) {
                    state.educations[index] = payload;
                }
            }

            if (payload) {
                state.selectedEducation = payload;
            }
        })
        .addCase(deleteEducation.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteEducation.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.educations = state.educations.filter(education => education.id !== deletedId);

            if (state.selectedEducation?.id === deletedId) {
                state.selectedEducation = undefined;
            }
        })
    }
})

export const { 
    setSelectedEducation, 
    setEducations,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = educationSlice.actions;
export default educationSlice.reducer;
