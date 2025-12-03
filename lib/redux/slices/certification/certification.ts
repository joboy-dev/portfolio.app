import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { CertificationInterface } from "@/lib/interfaces/certification"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { certificationsService, type GetCertificationsParams } from "../certification/certification.service"
import type { CertificationBaseFormData, UpdateCertificationFormData } from "@/lib/validators/certification"


interface CertificationState {
    certifications: CertificationInterface[]
    selectedCertification?: CertificationInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: CertificationState = {
    certifications: [],
    selectedCertification: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getCertifications = createAsyncThunk(
    'certifications/getCertifications',
    async (params: GetCertificationsParams): Promise<ApiResponse<CertificationInterface[]> | undefined> => {
        try {
            const data = await certificationsService.getCertifications(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createCertification = createAsyncThunk(
    'certifications/create',
    async (payload: CertificationBaseFormData): Promise<CertificationInterface | undefined> => {
        try {
            const data = await certificationsService.createCertification(payload)
            const service = data?.data
            toaster.success("Certification created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getCertificationById = createAsyncThunk<CertificationInterface | undefined, GetByIdParams>(
    "certifications/getById",
    async ({id}): Promise<CertificationInterface | undefined> => {
        try {
            const data = await certificationsService.getCertificationById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteCertification = createAsyncThunk<CertificationInterface | undefined, GetByIdParams>(
    "certifications/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await certificationsService.deleteCertification(id)
            toaster.success("Certification deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateCertification = createAsyncThunk<CertificationInterface | undefined, UpdateParams<UpdateCertificationFormData> >(
    "certifications/update",
    async ({id, payload}): Promise<CertificationInterface | undefined> => {
        try {
            const data = await certificationsService.updateCertification({
                id: id, 
                payload: payload
            })
            toaster.success("Certification updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const certificationSlice = createSlice({
    name: "certifications",
    initialState,
    reducers: {
        setCertifications: (state, action) => {
            state.certifications = action.payload;
        },
        setSelectedCertification: (state, action) => {
            state.selectedCertification = action.payload
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
        .addCase(getCertifications.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCertifications.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.certifications = payload?.data ?? [];
        })
        .addCase(getCertifications.rejected, (state) => {
            state.isLoading = false;
            state.certifications = [];
        })
        .addCase(getCertificationById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCertificationById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedCertification = payload;
        })
        .addCase(getCertificationById.rejected, (state) => {
            state.isLoading = false;
            state.selectedCertification = undefined;
        })
        .addCase(createCertification.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createCertification.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.certifications = [payload, ...state.certifications]
            }
        })
        .addCase(updateCertification.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateCertification.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.certifications) {
                const index = state.certifications.findIndex(certification => certification.id === payload.id);
                if (index !== -1) {
                    state.certifications[index] = payload;
                }
            }

            if (payload) {
                state.selectedCertification = payload;
            }
        })
        .addCase(deleteCertification.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteCertification.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.certifications = state.certifications.filter(certification => certification.id !== deletedId);

            if (state.selectedCertification?.id === deletedId) {
                state.selectedCertification = undefined;
            }
        })
    }
})

export const { 
    setSelectedCertification, 
    setCertifications,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = certificationSlice.actions;
export default certificationSlice.reducer;
