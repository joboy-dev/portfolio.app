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
import FileSelectField from '@/components/shared/form/FileSelectField'
import { Pencil, Trash, Wrench } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Pagination from '@/components/shared/Pagination'
import DateInput from '@/components/shared/form/DateInput'
import TiptapField from '@/components/shared/form/TiptapField'
import { createTestimonial, deleteTestimonial, getTestimonials } from '@/lib/redux/slices/testimonial/testimonial'
import { updateTestimonial } from '@/lib/redux/slices/testimonial/testimonial'
import { setSelectedTestimonial } from '@/lib/redux/slices/testimonial/testimonial'
import { TestimonialBaseFormData, testimonialBaseSchema, UpdateTestimonialFormData, updateTestimonialSchema } from '@/lib/validators/testimonial'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import FormCheckbox from '@/components/shared/form/FormCheckbox'

export default function TestimonialsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, testimonials, isLoading, selectedTestimonial } = useAppSelector((state: RootState) => state.testimonial)    

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
        is_published?: boolean
    }>({})

    useEffect(() => {
        dispatch(getTestimonials({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [filtersState])

    const createMethods = useZodForm<TestimonialBaseFormData>(testimonialBaseSchema)
    const editMethods = useZodForm<UpdateTestimonialFormData>(updateTestimonialSchema)

    const onSubmit = (data: TestimonialBaseFormData) => {
        console.log(data)
        dispatch(createTestimonial(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateTestimonialFormData) => {
        console.log(data)
        dispatch(updateTestimonial({
            id: selectedTestimonial?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Testimonial"
                subtitle="Add a new testimonial to your portfolio"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the person"
                />

                <FormInput
                    name="title"
                    label="Title"
                    placeholder="Enter the title of the person"
                />

                <FormInput
                    name="rating"
                    label="Rating"
                    placeholder="Enter the rating of the person"
                    type="number"
                    min={1}
                    max={5}
                />

                <TextAreaInput
                    name="message"
                    label="Message"
                    placeholder="Enter the message of the person"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Testimonial"
                subtitle="Edit the testimonial"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the person"
                />

                <FormInput
                    name="title"
                    label="Title"
                    placeholder="Enter the title of the person"
                />

                <FormInput
                    name="rating"
                    label="Rating"
                    placeholder="Enter the rating of the person"
                    type="number"
                    min={1}
                    max={5}
                />

                <TextAreaInput
                    name="message"
                    label="Message"
                    placeholder="Enter the message of the person"
                />

                <FormCheckbox
                    name="is_published"
                    label="Published"
                />
            </FormModal>

            <ActionBreadcrumb
                title="Testimonial Management"
                subtitle="Manage your testimonials"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Testimonial"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search testimonial by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Testimonial Management"
                subtitle={`${total} testimonial(s) total`}
                icon={Wrench}
            >
                {testimonials.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No testimonial found</p>
                    </div>
                )}

                {testimonials.length > 0 && (
                    <div>
                        {testimonials.map((testimonial) => (
                            <ListCard
                                key={testimonial.id}
                                actions={[
                                    {
                                        text: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedTestimonial(testimonial))
                                            setIsEditOpen(true)
                                            editMethods.reset({
                                                name: testimonial.name,
                                                title: testimonial.title,
                                                rating: testimonial.rating,
                                                message: testimonial.message,
                                                is_published: testimonial.is_published,
                                            })
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        text: "Delete",
                                        onSelect: () => {
                                            dispatch(deleteTestimonial({
                                                id: testimonial?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4 text-red-500' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <div>
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{testimonial.name}</h3>
                                        <p className='text-lg text-muted-foreground'>Title: <span className='font-bold'>{testimonial.title}</span></p>
                                        <p className='text-lg text-muted-foreground'>Rating: <span className='font-bold'>{testimonial.rating}</span></p>
                                        <p className='text-lg text-muted-foreground'>Message: <span className='font-bold'>{testimonial.message}</span></p>
                                        <p className='text-lg text-muted-foreground'>Published: <span className='font-bold'>{testimonial.is_published ? "Yes" : "No"}</span></p>
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
