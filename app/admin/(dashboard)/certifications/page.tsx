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
import { createFile, getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import FileSelectField from '@/components/shared/form/FileSelectField'
import { Eye, File, Pencil, Trash, Upload, Wrench } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import { formatDate } from '@/lib/utils/formatter'
import Pagination from '@/components/shared/Pagination'
import { createCertification, deleteCertification, getCertifications, setSelectedCertification, updateCertification } from '@/lib/redux/slices/certification/certification'
import { CertificationBaseFormData, certificationBaseSchema, UpdateCertificationFormData, updateCertificationSchema } from '@/lib/validators/certification'
import DateInput from '@/components/shared/form/DateInput'
import toaster from '@/lib/utils/toaster'
import FormFileUpload from '@/components/shared/form/FormFileUpload'
import { FileBaseFormData, fileBaseSchema } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import FileCard from '@/components/file/FileCard'

export default function CertificationsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, certifications, isLoading, selectedCertification } = useAppSelector((state: RootState) => state.certification)    
    const { isLoading: fileLoading } = useAppSelector((state: RootState) => state.file)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [openCertificationFilesId, setOpenCertificationFilesId] = useState<string | null>(null);

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
    }>({})

    
    const createMethods = useZodForm<CertificationBaseFormData>(certificationBaseSchema)
    const editMethods = useZodForm<UpdateCertificationFormData>(updateCertificationSchema)
    const uploadMethods = useZodForm<FileBaseFormData>(fileBaseSchema, {
        model_id: selectedCertification?.id ?? "",
        model_name: "certifications",
        file_name: `${selectedCertification?.name} Certification File`
    })
    
    useEffect(() => {
        dispatch(getCertifications({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

        if (selectedCertification) {
            uploadMethods.reset({
                model_id: selectedCertification.id,
                model_name: "certifications",
                file_name: `${selectedCertification.name} Certification File`
            })
        }

    }, [filtersState, selectedCertification])

    const onSubmit = (data: CertificationBaseFormData) => {
        console.log(data)
        dispatch(createCertification(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateCertificationFormData) => {
        console.log(data)
        dispatch(updateCertification({
            id: selectedCertification?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    const onUploadSubmit = (data: FileBaseFormData) => {
        console.log(data)
        const formData = objectToFormData(data)
        dispatch(createFile(formData)).then(() => {
            // Refetch certifications after upload completes
            dispatch(getCertifications({ ...filtersState }))
        })
        uploadMethods.reset()
        setIsUploadOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Certification"
                subtitle="Add a new certification to your portfolio"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the certification"
                />

                <FormInput  
                    name="issuer"
                    label="Issuer"
                    placeholder="Enter the issuer of the certification"
                />

                <DateInput
                    name='issue_date'
                    label='Issue Date'
                    placeholder='Select issue date'
                />

                <FormInput
                    name='credential_id'
                    label='Credential ID'
                    placeholder='Enter credential ID'
                />

                <FormInput
                    name='credential_url'
                    label='Credential URL'
                    placeholder='Enter credential url'
                />

                <FileSelectField
                    control={createMethods.control}
                    name="issuer_file_id"
                    label="Issuer image"
                    placeholder="Select issuer image"
                    model_name="others"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Certification"
                subtitle="Edit the certification"
                isSubmitting={isLoading}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the certification"
                />

                <FormInput
                    name="issuer"
                    label="Issuer"
                    placeholder="Enter the issuer of the certification"
                />

                <DateInput
                    name='issue_date'
                    label='Issue Date'
                    placeholder='Select issue date'
                />

                <FormInput
                    name='credential_id'
                    label='Credential ID'
                    placeholder='Enter credential ID'
                />

                <FormInput
                    name='credential_url'
                    label='Credential URL'
                    placeholder='Enter credential url'
                />

                <FormInput
                    name="position"
                    label="Position"
                    placeholder="Enter the position of the certification"
                    type="number"
                />

                <FileSelectField
                    control={editMethods.control}
                    name="issuer_file_id"
                    label="Issuer image"
                    placeholder="Select issuer image"
                    model_name="others"
                />
            </FormModal>

            <FormModal
                methods={uploadMethods}
                isOpen={isUploadOpen}
                setIsOpen={setIsUploadOpen}
                onSubmit={uploadMethods.handleSubmit(onUploadSubmit)}
                title="Upload Certification File"
                subtitle="Upload a new certification file"
                isSubmitting={fileLoading}
            >
                <FormFileUpload
                    name="file"
                    label="Upload Certification File"
                    required
                />
            </FormModal>

            <ActionBreadcrumb
                title="Certification Management"
                subtitle="Manage your certifications"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Certification"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search certifications by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Certification Management"
                subtitle={`${total} certification(s) total`}
                icon={Wrench}
            >
                {certifications.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No certifications found</p>
                    </div>
                )}

                {certifications.length > 0 && (
                    <div className=''>
                        {certifications.map((certification) => (
                            <div 
                                key={certification.id}
                                className='mb-2 flex flex-col gap-2'
                            >
                                <ListCard
                                    actions={[
                                        {
                                            text: "Edit",
                                            onSelect: () => {
                                                dispatch(setSelectedCertification(certification))
                                                setIsEditOpen(true)
                                                editMethods.reset({
                                                    name: certification.name,
                                                    issuer: certification.issuer,
                                                    issue_date: certification.issue_date ? new Date(certification.issue_date) : null,
                                                    credential_id: certification.credential_id,
                                                    credential_url: certification.credential_url,
                                                    issuer_file_id: certification.issuer_file_id,
                                                    position: certification.position,
                                                })    
                                            },
                                            icon: <Pencil className='w-4 h-4' />
                                        },
                                        {
                                            text: "View Credential",
                                            onSelect: () => {
                                                if (certification.credential_url) {
                                                    window.open(certification.credential_url, "_blank")
                                                } else {
                                                    toaster.error("No credential URL found")
                                                }
                                            },
                                            icon: <Eye className='w-4 h-4' />
                                        },
                                        {
                                            text: "Upload Certification File",
                                            onSelect: () => {
                                                if (certification.certification_file) {
                                                    toaster.error("Certification file already uploaded")
                                                } else {
                                                    dispatch(setSelectedCertification(certification))
                                                    console.log(selectedCertification)
                                                    setIsUploadOpen(true)
                                                }
                                            },
                                            icon: <Upload className='w-4 h-4' />
                                        },
                                        {
                                            text: openCertificationFilesId === certification.id ? "Hide Certification Files" : "View Certification Files",
                                            onSelect: () => {
                                                if (certification.certification_file) {
                                                    setOpenCertificationFilesId(
                                                        openCertificationFilesId === certification.id ? null : certification.id
                                                    );
                                                } else {
                                                    toaster.error("No certification file found");
                                                }
                                            },
                                            icon: <File className='w-4 h-4' />
                                        },
                                        {
                                            text: "Delete",
                                            onSelect: () => dispatch(deleteCertification({id: certification.id})),
                                            icon: <Trash className='w-4 h-4 text-red-500' />
                                        }
                                    ]}
                                >
                                    <div className='flex items-center gap-8 w-full max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                        <Avatar
                                            src={certification.issuer_image?.url}
                                            alt={certification.name}
                                            size='lg'
                                            rounded='md'
                                        />
                                        <div>
                                            <h3 className='text-xl text-foreground font-bold'>{certification.name}</h3>
                                            <div className='flex flex-col items-start gap-2'>
                                                <p className='text-sm text-muted-foreground'>Issued by: <span className='font-bold'>{certification.issuer}</span></p>
                                                <p className='text-sm text-muted-foreground'>Credential ID: <span className='font-bold'>{certification.credential_id}</span></p>
                                                <p className='text-sm text-muted-foreground'>Credential URL: <span className='font-bold'>{certification.credential_url}</span></p>
                                                <p className='text-sm text-muted-foreground'>Issue Date: <span className='font-bold'>{certification.issue_date ? formatDate(certification.issue_date) : "N/A"}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </ListCard>

                                {(openCertificationFilesId === certification.id && certification.certification_file) && (
                                    <div className='mt-2 ml-5'>
                                            <FileCard
                                                file={certification.certification_file}
                                            />
                                    </div>
                                )}
                            </div>
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
