import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ServiceInterface } from "@/lib/interfaces/service"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { servicesService, type GetServicesParams } from "../service/service.service"
import type { ServiceBaseFormData, UpdateServiceFormData } from "@/lib/validators/service"


interface ServiceState {
    services: ServiceInterface[]
    selectedService?: ServiceInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: ServiceState = {
    services: [],
    selectedService: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getServices = createAsyncThunk(
    'services/getServices',
    async (params: GetServicesParams): Promise<ApiResponse<ServiceInterface[]> | undefined> => {
        try {
            const data = await servicesService.getServices(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createService = createAsyncThunk(
    'services/create',
    async (payload: ServiceBaseFormData): Promise<ServiceInterface | undefined> => {
        try {
            const data = await servicesService.createService(payload)
            const service = data?.data
            toaster.success("Service created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getServiceById = createAsyncThunk<ServiceInterface | undefined, GetByIdParams>(
    "services/getById",
    async ({id}): Promise<ServiceInterface | undefined> => {
        try {
            const data = await servicesService.getServiceById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteService = createAsyncThunk<ServiceInterface | undefined, GetByIdParams>(
    "services/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await servicesService.deleteService(id)
            toaster.success("Service deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateService = createAsyncThunk<ServiceInterface | undefined, UpdateParams<UpdateServiceFormData>>(
    "services/update",
    async ({id, payload}): Promise<ServiceInterface | undefined> => {
        try {
            const data = await servicesService.updateService({
                id: id, 
                payload: payload
            })
            toaster.success("Service updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload;
        },
        setSelectedService: (state, action) => {
            state.selectedService = action.payload
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
        .addCase(getServices.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getServices.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.services = payload?.data ?? [];
        })
        .addCase(getServices.rejected, (state) => {
            state.isLoading = false;
            state.services = [];
        })
        .addCase(getServiceById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getServiceById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedService = payload;
        })
        .addCase(getServiceById.rejected, (state) => {
            state.isLoading = false;
            state.selectedService = undefined;
        })
        .addCase(createService.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createService.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.services = [payload, ...state.services]
            }
        })
        .addCase(updateService.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateService.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.services) {
                const index = state.services.findIndex(service => service.id === payload.id);
                if (index !== -1) {
                    state.services[index] = payload;
                }
            }

            if (payload) {
                state.selectedService = payload; // Optionally update the selectedService too
            }
        })
        .addCase(deleteService.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteService.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.services = state.services.filter(service => service.id !== deletedId);

            if (state.selectedService?.id === deletedId) {
                state.selectedService = undefined; // Optionally clear selected service
            }
        })
    }
})

export const { 
    setSelectedService, 
    setServices,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = serviceSlice.actions;
export default serviceSlice.reducer;