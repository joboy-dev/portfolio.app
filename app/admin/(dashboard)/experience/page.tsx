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
import Avatar from '@/components/shared/Avatar'
import { formatDate } from '@/lib/utils/formatter'
import Pagination from '@/components/shared/Pagination'
import DateInput from '@/components/shared/form/DateInput'
import { createExperience, deleteExperience, getExperiences, setSelectedExperience, updateExperience } from '@/lib/redux/slices/experience/experience'
import { ExperienceBaseFormData, experienceBaseSchema, UpdateExperienceFormData, updateExperienceSchema } from '@/lib/validators/experience'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import TiptapField from '@/components/shared/form/TiptapField'

export default function ExperiencePage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, experiences, isLoading, selectedExperience } = useAppSelector((state: RootState) => state.experience)    

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        company?: string
    }>({})

    useEffect(() => {
        dispatch(getExperiences({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [filtersState])

    const createMethods = useZodForm<ExperienceBaseFormData>(experienceBaseSchema)
    const editMethods = useZodForm<UpdateExperienceFormData>(updateExperienceSchema)

    const onSubmit = (data: ExperienceBaseFormData) => {
        console.log(data)
        dispatch(createExperience(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateExperienceFormData) => {
        console.log(data)
        dispatch(updateExperience({
            id: selectedExperience?.id ?? "",
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
                title="Add Experience"
                subtitle="Add a new experience to your portfolio"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="company"
                    label="Company"
                    placeholder="Enter the name of the company"
                />

                <FormInput
                    name="location"
                    label="Location"
                    placeholder="Enter the location of the company"
                />

                <FormInput
                    name="role"
                    label="Role"
                    placeholder="Enter the role of the experience"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the experience"
                />

                <DateInput
                    name="start_date"
                    label="Start Date"
                    placeholder="Select the start date of the experience"
                />  

                <DateInput
                    name="end_date"
                    label="End Date"
                    placeholder="Select the end date of the experience"
                />

                <FileSelectField
                    control={createMethods.control}
                    name="file_id"
                    label="Company logo"
                    placeholder="Select company logo"
                    model_name="others"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Experience"
                subtitle="Edit the experience"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="company"
                    label="Company"
                    placeholder="Enter the name of the company"
                />

                <FormInput
                    name="location"
                    label="Location"
                    placeholder="Enter the location of the company"
                />

                <FormInput
                    name="role"
                    label="Role"
                    placeholder="Enter the role of the experience"
                />  

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the experience"
                />

                <DateInput
                    name="start_date"
                    label="Start Date"
                    placeholder="Select the start date of the experience"
                />

                <DateInput
                    name="end_date"
                    label="End Date"
                    placeholder="Select the end date of the experience"
                />

                <FileSelectField
                    control={editMethods.control}
                    name="file_id"
                    label="Company logo"
                    placeholder="Select company logo"
                    model_name="others"
                />

            </FormModal>

            <ActionBreadcrumb
                title="Experience Management"
                subtitle="Manage your experience"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Experience"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search experience by company'
                onSearch={() => setFiltersState({...filtersState, company: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Experience Management"
                subtitle={`${total} experience(s) total`}
                icon={Wrench}
            >
                {experiences.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No experience found</p>
                    </div>
                )}

                {experiences.length > 0 && (
                    <div>
                        {experiences.map((experience) => (
                            <ListCard
                                key={experience.id}
                                actions={[
                                    {
                                        text: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedExperience(experience))
                                            setIsEditOpen(true)
                                            editMethods.reset({
                                                company: experience.company,
                                                location: experience.location,      
                                                role: experience.role,
                                                description: experience.description,
                                                start_date: experience.start_date ? new Date(experience.start_date) : undefined,
                                                end_date: experience.end_date ? new Date(experience.end_date) : undefined,
                                                file_id: experience.file_id,
                                            })
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        text: "Delete",
                                        onSelect: () => {
                                            dispatch(deleteExperience({
                                                id: experience?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4 text-red-500' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <Avatar
                                        src={experience.company_logo?.url}
                                        alt={experience.company}
                                        size='lg'
                                        rounded='md'
                                    />
                                    <div>
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{experience.company}</h3>
                                        <p className='text-lg text-muted-foreground'>Location: <span className='font-bold'>{experience.location}</span></p>
                                        <p className='text-lg text-muted-foreground'>Role: <span className='font-bold'>{experience.role}</span></p>
                                        <p className='text-lg text-muted-foreground'>Start Date: <span className='font-bold'>{experience.start_date ? formatDate(experience.start_date) : "N/A"}</span></p>
                                        <p className='text-lg text-muted-foreground'>End Date: <span className='font-bold'>{experience.end_date ? formatDate(experience.end_date) : "N/A"}</span></p>
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
