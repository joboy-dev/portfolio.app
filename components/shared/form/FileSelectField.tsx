"use client"

import React, { useEffect, useRef, useState } from 'react'
import SearchableSelectField from './SearchableSelect'
import { filterDocumentFiles, filterImageFiles } from '@/lib/utils/file'
import ImageComponent from '../Image'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { RootState } from '@/lib/redux/store'
import type { FileInterface } from '@/lib/interfaces/file'

const PAGE_SIZE = 20

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
            <SearchableSelectField
                label={label}
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
                control={control}
                onChange={(value) => {
                    dispatch(setSelectedFile(files.find(file => file.id === value?.value) ?? undefined))
                }}
            />

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
