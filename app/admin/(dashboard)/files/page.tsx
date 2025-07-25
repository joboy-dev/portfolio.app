"use client"

import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb'
import Button from '@/components/shared/button/Button'
import FormModal from '@/components/shared/modal/FormModal'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { BulkUploadFileFormData, bulkUploadFileSchema } from '@/lib/validators/file'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { ArrowLeftCircle, FolderClosed, FolderOpen, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { bulkUploadFile, getFiles } from '@/lib/redux/slices/file/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import { RootState } from '@/lib/redux/store'
import SearchableSelectField from '@/components/shared/form/SearchableSelect'
import { Option } from '@/lib/interfaces/general'
// import FormInput from '@/components/shared/form/FormInput'
// import TextAreaInput from '@/components/shared/form/TextAreaInput'
import FormFileUpload from '@/components/shared/form/FormFileUpload'
import { SearchField } from '@/components/shared/form/SearchField'
import { FaGreaterThan } from 'react-icons/fa6'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/app/loading'
import { capitalizeFirstLetter } from '@/lib/utils/string'
import FileCard from '@/components/file/FileCard'
import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import ListSection from '@/components/shared/ListSection'

export default function FilesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const model = searchParams.get("model")

    const dispatch = useAppDispatch()
    const { files, total, isLoading } = useAppSelector((state: RootState) => state.file)

    const methods = useZodForm<BulkUploadFileFormData>(bulkUploadFileSchema)
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        file_name?: string
        label?: string
    }>({})

    useEffect(() => {
        if (model) {
            dispatch(getFiles({
                model_name: model,
                ...filtersState
            }))
        } else {
            dispatch(getFiles({}))
        }
    }, [model, filtersState])

    const onSubmit = (data: BulkUploadFileFormData) => {
        console.log(data)
        const formData = objectToFormData(data)
        dispatch(bulkUploadFile(formData))
        setIsOpen(false)
        methods.reset()
    }

    const modelOptions: Option[] = [
        {
            label: "Profile",
            value: "profile",
            key: 1
        },
        {
            label: "Others",
            value: "others",
            key: 2
        },
    ]

    if (isLoading) return <Loading />

    return (
        <div>
            <FormModal
                methods={methods}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSubmit={methods.handleSubmit(onSubmit)}
                title="Add File"
                subtitle="Add a new file to your portfolio"
                isSubmitting={isLoading}
                // resetAfterSubmit
            >
                {/* <FormInput
                    name="file_name"
                    label="File name"
                    placeholder="Enter a file name"
                /> */}

                <SearchableSelectField
                    name="model_name"
                    options={modelOptions}
                    label="File Category"
                    placeholder="Select a file category"
                />

                {/* <FormInput
                    name="label"
                    label="Label"
                    placeholder="Enter a label"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter a description"
                /> */}

                <FormFileUpload
                    name="files"
                    label="Select Files"
                    required
                    multiple
                />
            </FormModal>

            <ActionBreadcrumb
                title="File Management"
                subtitle="Organize and manage your portfolio files"
                action={() => setIsOpen(true)}
                actionLabel="Add File"
            />

            <div>
                {model !== null 
                    ? <div>
                        <BackButton href="/admin/files" />

                        <SearchField
                            searchQuery={search}
                            setSearchQuery={setSearch}
                            placeholder='Search files by name or label'
                            onSearch={() => setFiltersState({...filtersState, file_name: search})}
                            onSearchClear={() => setFiltersState({})}
                        />

                        <ListSection
                            title={capitalizeFirstLetter(model)}
                            subtitle={`${total} file(s) total`}
                            icon={FolderOpen}
                        >
                            {files.map((file) => (
                                <FileCard key={file.id} file={file} />
                            ))}
                        </ListSection>
                    </div>

                    : <ListSection
                        title="File Browser"
                        subtitle={`${modelOptions.length} categories • ${total} file(s) total`}
                        icon={FolderOpen}
                    >
                        {modelOptions.map((option) => (
                            <div 
                                className='flex items-center justify-between'
                                key={option.key}
                                onClick={() => router.push(`/admin/files?model=${option.value}`)}
                            >
                                <div className='flex items-center gap-4 h-16'>
                                    <FolderClosed className='h-8- w-8 text-primary'/>
                                    <p className='text-lg font-medium'>{option.label}</p>
                                </div>
                                <FaGreaterThan className='text-muted-foreground'/>
                            </div>
                        ))}
                    </ListSection>
                } 
            </div>
        </div>
    )
}
