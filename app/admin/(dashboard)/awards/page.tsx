"use client"

import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { RootState } from '@/lib/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import FormModal from '@/components/shared/modal/FormModal'
import FormInput from '@/components/shared/form/FormInput'
import { SearchField } from '@/components/shared/form/SearchField'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import FileSelectField from '@/components/shared/form/FileSelectField'
import FormToggle from '@/components/shared/form/FormToggle'
import { CheckCircle2, Pencil, Trash, Wrench, XCircle } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import Badge from '@/components/shared/Badge'
import { formatDate } from '@/lib/utils/formatter'
import Pagination from '@/components/shared/Pagination'
import { createAward, deleteAward, getAwards, setSelectedAward, updateAward } from '@/lib/redux/slices/award/award'
import { AwardBaseFormData, awardBaseSchema, UpdateAwardFormData } from '@/lib/validators/award'
import { updateAwardSchema } from '@/lib/validators/award'
import type { AwardInterface } from '@/lib/interfaces/award'
import DateInput from '@/components/shared/form/DateInput'
import ListEmpty from '@/components/shared/ListEmpty'
import { AdminListSkeleton } from '@/components/shared/Skeleton'
import { useConfirm } from '@/lib/hooks/useConfirm'

export default function AwardsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, awards, isLoading, isSubmitting, selectedAward } = useAppSelector((state: RootState) => state.award)
    const { confirm, ConfirmDialog } = useConfirm()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const hasLoadedOnce = useRef(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
    }>({})

    useEffect(() => {
        dispatch(getAwards({
            ...filtersState,
        })).finally(() => { hasLoadedOnce.current = true })

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [dispatch, filtersState])

    const createMethods = useZodForm<AwardBaseFormData>(awardBaseSchema)
    const editMethods = useZodForm<UpdateAwardFormData>(updateAwardSchema)

    const onSubmit = async (data: AwardBaseFormData) => {
        await dispatch(createAward(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = async (data: UpdateAwardFormData) => {
        await dispatch(updateAward({
            id: selectedAward?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    const togglePublish = (award: AwardInterface) => {
        dispatch(updateAward({
            id: award.id,
            payload: { is_published: !award.is_published },
        }))
    }

    return (
        <div>
            {ConfirmDialog}

            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Award"
                subtitle="Add a new award to your portfolio"
                isSubmitting={isSubmitting}
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

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this award visible on the public site"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Award"
                subtitle="Edit the award"
                isSubmitting={isSubmitting}
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

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this award visible on the public site"
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

            {isLoading && !hasLoadedOnce.current ? (
                <AdminListSkeleton rows={5} />
            ) : (
                <div className={clsx('transition-opacity duration-(--dur-base)', isLoading ? 'opacity-60' : 'opacity-100')} aria-busy={isLoading}>
                <ListSection
                subtitle={`${total} award(s) total`}
                icon={Wrench}
            >
                {awards.length === 0 && (
                    <ListEmpty title='awards' subtitle='Click "Add Award" to create your first one.' />
                )}

                {awards.length > 0 && (
                    <div>
                        {awards.map((award) => (
                            <ListCard
                                key={award.id}
                                primaryActions={[
                                    {
                                        label: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedAward(award))
                                            setIsEditOpen(true)
                                            editMethods.reset({
                                                name: award.name,
                                                issuer: award.issuer,
                                                issue_date: award.issue_date ? new Date(award.issue_date) : undefined,
                                                file_id: award.file_id,
                                                is_published: award.is_published,
                                            })
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        label: "Delete",
                                        variant: "ghostDanger",
                                        onSelect: () => confirm({
                                            title: "Delete award",
                                            content: `Delete "${award.name}"? This can't be undone.`,
                                            confirmLabel: "Delete",
                                            onConfirm: () => dispatch(deleteAward({ id: award?.id ?? "" })).unwrap(),
                                        }),
                                        icon: <Trash className='w-4 h-4' />
                                    }
                                ]}
                                actions={[
                                    {
                                        text: award.is_published ? "Unpublish" : "Publish",
                                        onSelect: () => togglePublish(award),
                                        icon: award.is_published
                                            ? <XCircle className='w-4 h-4' />
                                            : <CheckCircle2 className='w-4 h-4' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <Avatar
                                        src={award.issuer_image?.url}
                                        alt={award.name}
                                        size='lg'
                                        rounded='md'
                                        objectFit='contain'
                                    />
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <h3 className='text-xl text-foreground font-bold'>{award.name}</h3>
                                            <Badge variant={award.is_published ? 'primary' : 'outlineSecondary'}>
                                                {award.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
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
            )}
        </div>
    )
}
