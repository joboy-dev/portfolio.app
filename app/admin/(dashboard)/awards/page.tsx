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
import { createAward, deleteAward, getAwards, setSelectedAward, updateAward } from '@/lib/redux/slices/award/award'
import { AwardBaseFormData, awardBaseSchema, UpdateAwardFormData } from '@/lib/validators/award'
import { updateAwardSchema } from '@/lib/validators/award'
import DateInput from '@/components/shared/form/DateInput'

export default function AwardsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, awards, isLoading, selectedAward } = useAppSelector((state: RootState) => state.award)    

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
    }>({})

    useEffect(() => {
        dispatch(getAwards({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [filtersState])

    const createMethods = useZodForm<AwardBaseFormData>(awardBaseSchema)
    const editMethods = useZodForm<UpdateAwardFormData>(updateAwardSchema)

    const onSubmit = (data: AwardBaseFormData) => {
        console.log(data)
        dispatch(createAward(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateAwardFormData) => {
        console.log(data)
        dispatch(updateAward({
            id: selectedAward?.id ?? "",
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
                title="Add Award"
                subtitle="Add a new award to your portfolio"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the award"
                />

                <FormInput
                    name="issuer"
                    label="Issuer"
                    placeholder="Enter the issuer of the award"
                />

                <DateInput
                    name="issue_date"
                    label="Issue Date"
                    placeholder="Select the issue date of the award"
                />  

                <FileSelectField
                    control={createMethods.control}
                    name="file_id"
                    label="Award image"
                    placeholder="Select award image"
                    model_name="others"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Award"
                subtitle="Edit the award"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the award"
                />

                <FormInput
                    name="issuer"
                    label="Issuer"
                    placeholder="Enter the issuer of the award"
                />

                <DateInput
                    name="issue_date"
                    label="Issue Date"
                    placeholder="Select the issue date of the award"
                />

                <FileSelectField
                    control={editMethods.control}
                    name="file_id"
                    label="Award image"
                    placeholder="Select award image"
                    model_name="others"
                />

            </FormModal>

            <ActionBreadcrumb
                title="Award Management"
                subtitle="Manage your awards"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Award"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search awards by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Award Management"
                subtitle={`${total} award(s) total`}
                icon={Wrench}
            >
                {awards.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No awards found</p>
                    </div>
                )}

                {awards.length > 0 && (
                    <div>
                        {awards.map((award) => (
                            <ListCard
                                key={award.id}
                                actions={[
                                    {
                                        text: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedAward(award))
                                            setIsEditOpen(true)
                                            editMethods.reset({
                                                name: award.name,
                                                issuer: award.issuer,
                                                issue_date: award.issue_date ? new Date(award.issue_date) : undefined,
                                                file_id: award.file_id,
                                            })
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        text: "Delete",
                                        onSelect: () => {
                                            dispatch(deleteAward({
                                                id: award?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4 text-red-500' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <Avatar
                                        src={award.issuer_image?.url}
                                        alt={award.name}
                                        size='lg'
                                        rounded='md'
                                    />
                                    <div>
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{award.name}</h3>
                                        <p className='text-lg text-muted-foreground'>Issued by: <span className='font-bold'>{award.issuer}</span></p>
                                        <p className='text-lg text-muted-foreground'>Issue Date: <span className='font-bold'>{award.issue_date ? formatDate(award.issue_date) : "N/A"}</span></p>
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
