import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { AwardInterface } from "@/lib/interfaces/award"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { awardsService, type GetAwardsParams } from "../award/award.service"
import type { AwardBaseFormData, UpdateAwardFormData } from "@/lib/validators/award"

interface AwardState {
    awards: AwardInterface[]
    selectedAward?: AwardInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: AwardState = {
    awards: [],
    selectedAward: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getAwards = createAsyncThunk(
    'awards/getAwards',
    async (params: GetAwardsParams): Promise<ApiResponse<AwardInterface[]> | undefined> => {
        try {
            const data = await awardsService.getAwards(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createAward = createAsyncThunk(
    'awards/create',
    async (payload: AwardBaseFormData): Promise<AwardInterface | undefined> => {
        try {
            const data = await awardsService.createAward(payload)
            const service = data?.data
            toaster.success("Award created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getAwardById = createAsyncThunk<AwardInterface | undefined, GetByIdParams>(
    "awards/getById",
    async ({id}): Promise<AwardInterface | undefined> => {
        try {
            const data = await awardsService.getAwardById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteAward = createAsyncThunk<AwardInterface | undefined, GetByIdParams>(
    "awards/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await awardsService.deleteAward(id)
            toaster.success("Award deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateAward = createAsyncThunk<AwardInterface | undefined, UpdateParams<UpdateAwardFormData> >(
    "awards/update",
    async ({id, payload}): Promise<AwardInterface | undefined> => {
        try {
            const data = await awardsService.updateAward({
                id: id, 
                payload: payload
            })
            toaster.success("Award updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const awardSlice = createSlice({
    name: "awards",
    initialState,
    reducers: {
        setAwards: (state, action) => {
            state.awards = action.payload;
        },
        setSelectedAward: (state, action) => {
            state.selectedAward = action.payload
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
        .addCase(getAwards.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAwards.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.awards = payload?.data ?? [];
        })
        .addCase(getAwards.rejected, (state) => {
            state.isLoading = false;
            state.awards = [];
        })
        .addCase(getAwardById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAwardById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedAward = payload;
        })
        .addCase(getAwardById.rejected, (state) => {
            state.isLoading = false;
            state.selectedAward = undefined;
        })
        .addCase(createAward.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createAward.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.awards = [payload, ...state.awards]
            }
        })
        .addCase(updateAward.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateAward.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.awards) {
                const index = state.awards.findIndex(award => award.id === payload.id);
                if (index !== -1) {
                    state.awards[index] = payload;
                }
            }

            if (payload) {
                state.selectedAward = payload;
            }
        })
        .addCase(deleteAward.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteAward.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.awards = state.awards.filter(award => award.id !== deletedId);

            if (state.selectedAward?.id === deletedId) {
                state.selectedAward = undefined;
            }
        })
    }
})

export const { 
    setSelectedAward, 
    setAwards,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = awardSlice.actions;
export default awardSlice.reducer;
