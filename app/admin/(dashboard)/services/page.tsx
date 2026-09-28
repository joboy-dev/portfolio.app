"use client"

import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { RootState } from '@/lib/redux/store'
import { ServiceBaseFormData, serviceBaseSchema, UpdateServiceFormData, updateServiceSchema } from '@/lib/validators/service'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { createService, deleteService, getServices, setSelectedService, updateService } from '@/lib/redux/slices/service/service'
import FormModal from '@/components/shared/modal/FormModal'
import FormInput from '@/components/shared/form/FormInput'
import CreatableMultiSelectField from '@/components/shared/form/CreatableMultiSelect'
import { SearchField } from '@/components/shared/form/SearchField'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import FileSelectField from '@/components/shared/form/FileSelectField'
import FormToggle from '@/components/shared/form/FormToggle'
import { CheckCircle2, Pencil, Trash, Wrench, XCircle } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import Badge from '@/components/shared/Badge'
import type { ServiceInterface } from '@/lib/interfaces/service'
import { formatDate } from '@/lib/utils/formatter'
import Pagination from '@/components/shared/Pagination'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import ListEmpty from '@/components/shared/ListEmpty'
import { AdminListSkeleton } from '@/components/shared/Skeleton'
import { useConfirm } from '@/lib/hooks/useConfirm'

export default function ServicesPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, services, isLoading, isSubmitting, selectedService } = useAppSelector((state: RootState) => state.service)
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
        dispatch(getServices({
            ...filtersState,
        })).finally(() => { hasLoadedOnce.current = true })

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [dispatch, filtersState])

    const createMethods = useZodForm<ServiceBaseFormData>(serviceBaseSchema)
    const editMethods = useZodForm<UpdateServiceFormData>(updateServiceSchema)

    const onSubmit = async (data: ServiceBaseFormData) => {
        await dispatch(createService(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = async (data: UpdateServiceFormData) => {
        await dispatch(updateService({
            id: selectedService?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    const togglePublish = (service: ServiceInterface) => {
        dispatch(updateService({
            id: service.id,
            payload: { is_published: !service.is_published },
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
                title="Add Service"
                subtitle="Add a new service to your portfolio"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the service"
                />

                <TextAreaInput  
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the service"
                />

                <CreatableMultiSelectField
                    methods={createMethods}
                    name="skills"
                    label="Skills"
                    placeholder="Enter skills"
                    options={[]}
                />

                <FileSelectField
                    control={createMethods.control}
                    name="file_id"
                    label="Service image"
                    placeholder="Select service image"
                    model_name="others"
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this service visible on the public site"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Service"
                subtitle="Edit the service"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the service"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the service"
                />

                <CreatableMultiSelectField
                    methods={editMethods}
                    name="skills"
                    label="Skills"
                    placeholder="Enter skills"
                    options={[]}
                    defaultValue={selectedService?.skills?.map(skill => ({
                        label: skill,
                        value: skill,
                        key: skill.length,
                    }))}
                />

                <FileSelectField
                    control={editMethods.control}
                    name="file_id"
                    label="Service image"
                    placeholder="Select service image"
                    model_name="others"
                />

                <FormInput
                    name="position"
                    label="Position"
                    placeholder="Enter the position of the service"
                    type="number"
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this service visible on the public site"
                />
            </FormModal>

            <ActionBreadcrumb
                title="Service Management"
                subtitle="Manage your services"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Service"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search services by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            {isLoading && !hasLoadedOnce.current ? (
                <AdminListSkeleton rows={5} />
            ) : (
                <div className={clsx('transition-opacity duration-(--dur-base)', isLoading ? 'opacity-60' : 'opacity-100')} aria-busy={isLoading}>
                <ListSection
                subtitle={`${total} service(s) total`}
                icon={Wrench}
            >
                {services.length === 0 && (
                    <ListEmpty title='services' subtitle='Click "Add Service" to create your first one.' />
                )}

                {services.length > 0 && (
                    <div>
                        {services.map((service) => (
                            <ListCard
                                key={service.id}
                                primaryActions={[
                                    {
                                        label: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedService(service))
                                            setIsEditOpen(true)
                                            editMethods.reset(service)
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        label: "Delete",
                                        variant: "ghostDanger",
                                        onSelect: () => confirm({
                                            title: "Delete service",
                                            content: `Delete "${service.name}"? This can't be undone.`,
                                            confirmLabel: "Delete",
                                            onConfirm: () => dispatch(deleteService({ id: service?.id ?? "" })).unwrap(),
                                        }),
                                        icon: <Trash className='w-4 h-4' />
                                    }
                                ]}
                                actions={[
                                    {
                                        text: service.is_published ? "Unpublish" : "Publish",
                                        onSelect: () => togglePublish(service),
                                        icon: service.is_published
                                            ? <XCircle className='w-4 h-4' />
                                            : <CheckCircle2 className='w-4 h-4' />
                                    }
                                ]}
                            >
                                <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                    <Avatar
                                        src={service.service_logo?.url}
                                        alt={service.name}
                                        size='lg'
                                        rounded='md'
                                    />
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <h3 className='text-xl text-foreground font-bold'>{service.name}</h3>
                                            <Badge variant={service.is_published ? 'primary' : 'outlineSecondary'}>
                                                {service.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                        <p className='text-lg text-muted-foreground'>{service.description}</p>
                                        {service.skills && service.skills.length > 0 && (
                                            <div className='flex items-center gap-2 mt-2 flex-wrap w-full'>
                                                {service.skills.map((skill) => (
                                                    <Badge 
                                                        key={skill} 
                                                        variant='primary' 
                                                        className='text-sm'
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <div className='flex items-center gap-2 mt-2'>
                                            <p className='text-sm text-muted-foreground'>Created {formatDate(service.created_at)}</p>
                                            <p className='text-sm text-muted-foreground'>Updated {formatDate(service.updated_at)}</p>
                                        </div>
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
