"use client"

import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { RootState } from '@/lib/redux/store'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/loading'
import FormModal from '@/components/shared/modal/FormModal'
import FormInput from '@/components/shared/form/FormInput'
import { SearchField } from '@/components/shared/form/SearchField'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import { Pencil, Trash, Wrench } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Pagination from '@/components/shared/Pagination'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import { deleteMessage, getMessages, setSelectedMessage } from '@/lib/redux/slices/message/message'
import { MessageBaseFormData, messageBaseSchema } from '@/lib/validators/message'
import { createMessage } from '@/lib/redux/slices/message/message'
import PhoneInput from '@/components/shared/form/PhoneInput'
import ContactForm from '@/components/messages/ContactForm'

export default function MessagesPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, messages, isLoading, selectedMessage } = useAppSelector((state: RootState) => state.message)    

    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
        email?: string
    }>({})

    useEffect(() => {
        dispatch(getMessages({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [filtersState])

    const createMethods = useZodForm<MessageBaseFormData>(messageBaseSchema)

    const onSubmit = (data: MessageBaseFormData) => {
        console.log(data)
        dispatch(createMessage(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <ContactForm
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                title="Add Message"
                subtitle="Add a new message"
            />

            <ActionBreadcrumb
                title="Message Management"
                subtitle="Manage your messages"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Message"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search message by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Message Management"
                subtitle={`${total} message(s) total`}
                icon={Wrench}
            >
                {messages.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No message found</p>
                    </div>
                )}

                {messages.length > 0 && (
                    <div>
                        {messages.map((message) => (
                            <ListCard
                                key={message.id}
                                actions={[  
                                    {
                                        text: "Delete",
                                        onSelect: () => {
                                            dispatch(deleteMessage({
                                                id: message?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4 text-red-500' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <div>
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{message.name}</h3>
                                        <p className='text-lg text-muted-foreground'>Email: <span className='font-bold'>{message.email}</span></p>
                                        <p className='text-lg text-muted-foreground'>Phone Number: <span className='font-bold'>{message.phone_number}</span></p>
                                        <p className='text-lg text-muted-foreground'>Location: <span className='font-bold'>{message.location}</span></p>
                                        <p className='text-lg text-muted-foreground'>Message: <span className='font-bold'>{message.message}</span></p>
                                    </div>
                                </div>
                            </ListCard>
                        ))}
                    </div>
                )}
            </ListSection>
            <Pagination
                currentPage={filtersState.page ?? 1}
                totalPages={totalPages ?? 1}
                onPageChange={(page) => setFiltersState({...filtersState, page})}
            />
        </div>
    )
}
