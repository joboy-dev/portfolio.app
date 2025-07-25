import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { MessageInterface } from "@/lib/interfaces/message"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { messagesService, type GetMessagesParams } from "../message/message.service"
import type { MessageBaseFormData } from "@/lib/validators/message"

interface MessageState {
    messages: MessageInterface[]
    selectedMessage?: MessageInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: MessageState = {
    messages: [],
    selectedMessage: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getMessages = createAsyncThunk(
    'messages/getMessages',
    async (params: GetMessagesParams): Promise<ApiResponse<MessageInterface[]> | undefined> => {
        try {
            const data = await messagesService.getMessages(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createMessage = createAsyncThunk(
    'messages/create',
    async (payload: MessageBaseFormData): Promise<MessageInterface | undefined> => {
        try {
            const data = await messagesService.createMessage(payload)
            const service = data?.data
            toaster.success("Message sent successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getMessageById = createAsyncThunk<MessageInterface | undefined, GetByIdParams>(
    "messages/getById",
    async ({id}): Promise<MessageInterface | undefined> => {
        try {
            const data = await messagesService.getMessageById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteMessage = createAsyncThunk<MessageInterface | undefined, GetByIdParams>(
    "messages/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await messagesService.deleteMessage(id)
            toaster.success("Message deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)



export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSelectedMessage: (state, action) => {
            state.selectedMessage = action.payload
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
        .addCase(getMessages.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getMessages.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.messages = payload?.data ?? [];
        })
        .addCase(getMessages.rejected, (state) => {
            state.isLoading = false;
            state.messages = [];
        })
        .addCase(getMessageById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getMessageById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedMessage = payload;
        })
        .addCase(getMessageById.rejected, (state) => {
            state.isLoading = false;
            state.selectedMessage = undefined;
        })
        .addCase(createMessage.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createMessage.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.messages = [payload, ...state.messages]
            }
        })
        .addCase(deleteMessage.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteMessage.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.messages = state.messages.filter(message => message.id !== deletedId);

            if (state.selectedMessage?.id === deletedId) {
                state.selectedMessage = undefined;
            }
        })
    }
})

export const { 
    setSelectedMessage, 
    setMessages,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = messageSlice.actions;
export default messageSlice.reducer;
