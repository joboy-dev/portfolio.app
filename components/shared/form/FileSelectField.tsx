"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useController } from 'react-hook-form'
import clsx from 'clsx'
import SearchableSelectField from './SearchableSelect'
import FileDropzone from './FileDropzone'
import { filterDocumentFiles, filterImageFiles, getFileIcon } from '@/lib/utils/file'
import ImageComponent from '../Image'
import { createFile, getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { RootState } from '@/lib/redux/store'
import type { FileInterface } from '@/lib/interfaces/file'
import type { Option } from '@/lib/interfaces/general'

const PAGE_SIZE = 20

/** Thumbnail + filename row for the "choose existing" dropdown — falls back
 *  to a file-type icon on a broken/missing image instead of a blank box. */
function FileOptionRow({ file }: { file?: FileInterface }) {
    const [broken, setBroken] = useState(false)
    const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(file?.file_name ?? '')

    return (
        <div className='flex items-center gap-2 min-w-0'>
            {isImage && !broken ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={file?.url}
                    alt=""
                    onError={() => setBroken(true)}
                    className='h-7 w-7 shrink-0 rounded object-cover bg-muted'
                />
            ) : (
                <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground'>
                    {getFileIcon(file?.file_name ?? '')}
                </div>
            )}
            <span className='truncate text-sm'>{file?.file_name ?? 'Untitled file'}</span>
        </div>
    )
}

export default function FileSelectField({
    control,
    name="file_id",
    label="Select file",
    placeholder="Select file",
    model_name="others",
    file_type="image",
}: {
    control: any
    name?: string
    label?: string
    placeholder?: string
    model_name?: string
    file_type?: "image" | "document"
}) {
    const dispatch = useAppDispatch()
    const { selectedFile } = useAppSelector((state: RootState) => state.file)
    const { field } = useController({ control, name })

    const [mode, setMode] = useState<'pick' | 'upload'>('pick')
    const [files, setLoadedFiles] = useState<FileInterface[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const pageRef = useRef(1)
    const hasMoreRef = useRef(true)

    const loadPage = async (page: number) => {
        setIsLoadingMore(true)
        const response = await dispatch(getFiles({ model_name, page, per_page: PAGE_SIZE })).unwrap()
        setLoadedFiles((prev) => page === 1 ? (response?.data ?? []) : [...prev, ...(response?.data ?? [])])
        const pages = response?.pagination_data?.pages ?? 1
        pageRef.current = page
        hasMoreRef.current = page < pages
        setIsLoadingMore(false)
    }

    useEffect(() => {
        pageRef.current = 1
        hasMoreRef.current = true
        loadPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, model_name])

    const handleMenuScrollToBottom = () => {
        if (hasMoreRef.current && !isLoadingMore) {
            loadPage(pageRef.current + 1)
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-1'>
                {label && <label className='block text-sm font-medium text-foreground'>{label}</label>}
                <div className='flex items-center rounded-md border border-border p-0.5 text-xs'>
                    <button
                        type='button'
                        onClick={() => setMode('pick')}
                        className={clsx(
                            'rounded px-2 py-1 transition-colors',
                            mode === 'pick' ? 'bg-primary-soft text-primary-strong' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Choose existing
                    </button>
                    <button
                        type='button'
                        onClick={() => setMode('upload')}
                        className={clsx(
                            'rounded px-2 py-1 transition-colors',
                            mode === 'upload' ? 'bg-primary-soft text-primary-strong' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Upload new
                    </button>
                </div>
            </div>

            {mode === 'pick' ? (
                <SearchableSelectField
                    name={name}
                    placeholder={placeholder}
                    isLoading={isLoadingMore}
                    onMenuScrollToBottom={handleMenuScrollToBottom}
                    options={
                        file_type === "image" ? filterImageFiles(files).map(file => ({
                            label: file.file_name,
                            value: file.id,
                            key: file.file_name.length,
                        })) : filterDocumentFiles(files).map(file => ({
                            label: file.file_name,
                            value: file.id,
                            key: file.file_name.length,
                        }))
                    }
                    formatOptionLabel={(option: Option) => (
                        <FileOptionRow file={files.find((file) => file.id === option.value)} />
                    )}
                    control={control}
                    onChange={(value) => {
                        dispatch(setSelectedFile(files.find(file => file.id === value?.value) ?? undefined))
                    }}
                />
            ) : (
                <FileDropzone
                    accept={file_type === "image" ? "image/*" : undefined}
                    multiple={false}
                    label={file_type === "image" ? "Drop an image here or click to browse" : "Drop a file here or click to browse"}
                    onUpload={async (file) => {
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('model_name', model_name)
                        return await dispatch(createFile(formData)).unwrap()
                    }}
                    onUploaded={(results) => {
                        const uploaded = results[0]
                        if (!uploaded) return
                        setLoadedFiles((prev) => [uploaded, ...prev])
                        dispatch(setSelectedFile(uploaded))
                        field.onChange(uploaded.id)
                        setMode('pick')
                    }}
                />
            )}

            {selectedFile && (
            <div className='flex items-center gap-2 mt-4'>
                <ImageComponent
                    src={selectedFile?.url ?? ""}
                    alt={selectedFile?.file_name ?? ""}
                    width={100}
                    lazy={false}
                    />
            </div>
            )}
        </div>
    )
}
