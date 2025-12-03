import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { TestimonialInterface } from "@/lib/interfaces/testimonial"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { testimonialsService, type GetTestimonialsParams } from "../testimonial/testimonial.service"
import type { TestimonialBaseFormData, UpdateTestimonialFormData } from "@/lib/validators/testimonial"


interface TestimonialState {
    testimonials: TestimonialInterface[]
    selectedTestimonial?: TestimonialInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: TestimonialState = {
    testimonials: [],
    selectedTestimonial: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getTestimonials = createAsyncThunk(
    'testimonials/getTestimonials',
    async (params: GetTestimonialsParams): Promise<ApiResponse<TestimonialInterface[]> | undefined> => {
        try {
            const data = await testimonialsService.getTestimonials(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createTestimonial = createAsyncThunk(
    'testimonials/create',
    async (payload: TestimonialBaseFormData): Promise<TestimonialInterface | undefined> => {
        try {
            const data = await testimonialsService.createTestimonial(payload)
            const service = data?.data
            toaster.success("Testimonial created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getTestimonialById = createAsyncThunk<TestimonialInterface | undefined, GetByIdParams>(
    "testimonials/getById",
    async ({id}): Promise<TestimonialInterface | undefined> => {
        try {
            const data = await testimonialsService.getTestimonialById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteTestimonial = createAsyncThunk<TestimonialInterface | undefined, GetByIdParams>(
    "testimonials/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await testimonialsService.deleteTestimonial(id)
            toaster.success("Testimonial deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateTestimonial = createAsyncThunk<TestimonialInterface | undefined, UpdateParams<UpdateTestimonialFormData>>(
    "testimonials/update",
    async ({id, payload}): Promise<TestimonialInterface | undefined> => {
        try {
            const data = await testimonialsService.updateTestimonial({
                id: id, 
                payload: payload
            })
            toaster.success("Testimonial updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const testimonialSlice = createSlice({
    name: "testimonials",
    initialState,
    reducers: {
        setTestimonials: (state, action) => {
            state.testimonials = action.payload;
        },
        setSelectedTestimonial: (state, action) => {
            state.selectedTestimonial = action.payload
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
        .addCase(getTestimonials.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getTestimonials.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.testimonials = payload?.data ?? [];
        })
        .addCase(getTestimonials.rejected, (state) => {
            state.isLoading = false;
            state.testimonials = [];
        })
        .addCase(getTestimonialById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getTestimonialById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedTestimonial = payload;
        })
        .addCase(getTestimonialById.rejected, (state) => {
            state.isLoading = false;
            state.selectedTestimonial = undefined;
        })
        .addCase(createTestimonial.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createTestimonial.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.testimonials = [payload, ...state.testimonials]
            }
        })
        .addCase(updateTestimonial.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateTestimonial.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.testimonials) {
                const index = state.testimonials.findIndex(testimonial => testimonial.id === payload.id);
                if (index !== -1) {
                    state.testimonials[index] = payload;
                }
            }

            if (payload) {
                state.selectedTestimonial = payload;
            }
        })
        .addCase(deleteTestimonial.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteTestimonial.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.testimonials = state.testimonials.filter(testimonial => testimonial.id !== deletedId);

            if (state.selectedTestimonial?.id === deletedId) {
                state.selectedTestimonial = undefined;
            }
        })
    }
})

export const { 
    setSelectedTestimonial, 
    setTestimonials,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = testimonialSlice.actions;
export default testimonialSlice.reducer;
