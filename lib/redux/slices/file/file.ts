import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import type { FileInterface } from "@/lib/interfaces/file"
import { fileService, type GetFilesParams } from "./file.service"

interface FileState {
    files: FileInterface[]
    selectedFile?: FileInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    next?: string
    previous?: string
}

const initialState: FileState = {
    files: [],
    selectedFile: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 30,
    totalPages: 1,
    isLoading: false,
    next: undefined,
    previous: undefined,
}

export const getFiles = createAsyncThunk(
    'files/getFiles',
    async (params: GetFilesParams): Promise<ApiResponse<FileInterface[]> | undefined> => {
        try {
            const data = await fileService.getFiles(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createFile = createAsyncThunk(
    'files/create',
    async (payload: FormData): Promise<FileInterface | undefined> => {
        try {
            const data = await fileService.createFile(payload)
            toaster.success("File created successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createFileMinio = createAsyncThunk(
    'files/createMinio',
    async (payload: FormData): Promise<FileInterface | undefined> => {
        try {
            const data = await fileService.createFileMinio(payload)
            toaster.success("File created successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createFileFirebase = createAsyncThunk(
    'files/createFirebase',
    async (payload: FormData): Promise<FileInterface | undefined> => {
        try {
            const data = await fileService.createFileFirebase(payload)
            toaster.success("File created successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const bulkUploadFile = createAsyncThunk(
    'files/bulkUpload',
    async (payload: FormData): Promise<FileInterface[] | undefined> => {
        try {
            const data = await fileService.bulkUploadFile(payload)
            toaster.success("Files uploaded successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getFileById = createAsyncThunk<FileInterface | undefined, GetByIdParams>(
    "files/getById",
    async ({id}): Promise<FileInterface | undefined> => {
        try {
            const data = await fileService.getFileById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteFile = createAsyncThunk<FileInterface | undefined, GetByIdParams>(
    "files/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await fileService.deleteFile(id)
            toaster.success("File deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateFile = createAsyncThunk<FileInterface | undefined, UpdateParams<FormData>>(
    "files/update",
    async ({id, payload}): Promise<FileInterface | undefined> => {
        try {
            const data = await fileService.updateFile(id, payload)
            toaster.success("File updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload;
        },
        setSelectedFile: (state, action) => {
            state.selectedFile = action.payload
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
        .addCase(getFiles.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFiles.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.files = payload?.data ?? [];
        })
        .addCase(getFiles.rejected, (state) => {
            state.isLoading = false;
            state.files = [];
        })
        .addCase(getFileById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFileById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedFile = payload;
        })
        .addCase(getFileById.rejected, (state) => {
            state.isLoading = false;
            state.selectedFile = undefined;
        })
        .addCase(createFile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createFile.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.files = [...state.files, payload]
            }
        })
        .addCase(createFileMinio.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createFileMinio.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.files = [...state.files, payload]
            }
        })
        .addCase(createFileFirebase.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createFileFirebase.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.files = [...state.files, payload]
            }
        })
        .addCase(bulkUploadFile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(bulkUploadFile.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = (state.total ?? 0) + (payload?.length ?? 0)
            if (payload) {
                state.files = [...state.files, ...payload]
            }
        })
        .addCase(updateFile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateFile.fulfilled, (state, {payload}) => {
            state.isLoading = false;

            if (payload && state.files) {
                const index = state.files.findIndex(file => file.id === payload.id);
                if (index !== -1) {
                    state.files[index] = payload;
                }
            }

            if (payload) {
                state.selectedFile = payload; // Optionally update the selectedFile too
            }
        })
        .addCase(deleteFile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteFile.fulfilled, (state, {payload, meta}) => {
            state.isLoading = false;
            state.total = (state.total ?? 0) - 1

            const deletedId = meta.arg.id;

            if (payload && state.files) {
                state.files = state.files.filter(file => file.id !== deletedId);
            }

            if (state.selectedFile?.id === deletedId) {
                state.selectedFile = undefined; // Optionally clear selected file
            }
        })
    }
})

export const { 
    setSelectedFile, 
    setFiles,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = fileSlice.actions;
export default fileSlice.reducer;