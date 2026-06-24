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
import { createEducation, deleteEducation, getEducations, setSelectedEducation, updateEducation } from '@/lib/redux/slices/education/education'
import DateInput from '@/components/shared/form/DateInput'
import { EducationBaseFormData, educationBaseSchema, UpdateEducationFormData } from '@/lib/validators/education'
import { updateEducationSchema } from '@/lib/validators/education'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import ListEmpty from '@/components/shared/ListEmpty'

export default function EducationPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, educations, isLoading, isSubmitting, selectedEducation } = useAppSelector((state: RootState) => state.education)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        school?: string
    }>({})

    useEffect(() => {
        dispatch(getEducations({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [dispatch, filtersState])

    const createMethods = useZodForm<EducationBaseFormData>(educationBaseSchema)
    const editMethods = useZodForm<UpdateEducationFormData>(updateEducationSchema)

    const onSubmit = async (data: EducationBaseFormData) => {
        await dispatch(createEducation(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = async (data: UpdateEducationFormData) => {
        await dispatch(updateEducation({
            id: selectedEducation?.id ?? "",
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
                title="Add Education"
                subtitle="Add a new education to your portfolio"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="school"
                    label="School"
                    placeholder="Enter the name of the school"
                />

                <FormInput
                    name="location"
                    label="Location"
                    placeholder="Enter the location of the school"
                />

                <FormInput
                    name="degree"
                    label="Degree"
                    placeholder="Enter the degree of the education"
                />

                <FormInput
                    name="grade"
                    label="Grade"
                    placeholder="Enter the grade of the education"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the education"
                />

                <DateInput
                    name="start_date"
                    label="Start Date"
                    placeholder="Select the start date of the education"
                />  

                <DateInput
                    name="end_date"
                    label="End Date"
                    placeholder="Select the end date of the education"
                />

                <FileSelectField
                    control={createMethods.control}
                    name="file_id"
                    label="School logo"
                    placeholder="Select school logo"
                    model_name="others"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Education"
                subtitle="Edit the education"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="school"
                    label="School"
                    placeholder="Enter the name of the school"
                />

                <FormInput
                    name="location"
                    label="Location"
                    placeholder="Enter the location of the school"
                />

                <FormInput
                    name="degree"
                    label="Degree"
                    placeholder="Enter the degree of the education"
                />

                <FormInput
                    name="grade"
                    label="Grade"
                    placeholder="Enter the grade of the education"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the education"
                />

                <DateInput
                    name="start_date"
                    label="Start Date"
                    placeholder="Select the start date of the education"
                />

                <DateInput
                    name="end_date"
                    label="End Date"
                    placeholder="Select the end date of the education"
                />

                <FileSelectField
                    control={editMethods.control}
                    name="file_id"
                    label="School logo"
                    placeholder="Select school logo"
                    model_name="others"
                />

            </FormModal>

            <ActionBreadcrumb
                title="Education Management"
                subtitle="Manage your education"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Education"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search education by school'
                onSearch={() => setFiltersState({...filtersState, school: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Education Management"
                subtitle={`${total} education(s) total`}
                icon={Wrench}
            >
                {educations.length === 0 && (
                    <ListEmpty title='education' subtitle='Click "Add Education" to create your first one.' />
                )}

                {educations.length > 0 && (
                    <div>
                        {educations.map((education) => (
                            <ListCard
                                key={education.id}
                                primaryActions={[
                                    {
                                        label: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedEducation(education))
                                            setIsEditOpen(true)
                                            editMethods.reset({
                                                school: education.school,
                                                location: education.location,
                                                degree: education.degree,
                                                grade: education.grade,
                                                description: education.description,
                                                start_date: education.start_date ? new Date(education.start_date) : undefined,
                                                end_date: education.end_date ? new Date(education.end_date) : undefined,
                                                file_id: education.file_id,
                                            })
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        label: "Delete",
                                        variant: "ghostDanger",
                                        onSelect: () => {
                                            dispatch(deleteEducation({
                                                id: education?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <Avatar
                                        src={education.school_logo?.url}
                                        alt={education.school}
                                        size='lg'
                                        rounded='md'
                                        objectFit='contain'
                                    />
                                    <div>
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{education.school}</h3>
                                        <p className='text-lg text-muted-foreground'>Location: <span className='font-bold'>{education.location}</span></p>
                                        <p className='text-lg text-muted-foreground'>Degree: <span className='font-bold'>{education.degree}</span></p>
                                        <p className='text-lg text-muted-foreground'>Grade: <span className='font-bold'>{education.grade}</span></p>
                                        <p className='text-lg text-muted-foreground'>Start Date: <span className='font-bold'>{education.start_date ? formatDate(education.start_date) : "N/A"}</span></p>
                                        <p className='text-lg text-muted-foreground'>End Date: <span className='font-bold'>{education.end_date ? formatDate(education.end_date) : "N/A"}</span></p>
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
