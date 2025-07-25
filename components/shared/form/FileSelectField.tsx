"use client"

import React, { useEffect } from 'react'
import SearchableSelectField from './SearchableSelect'
import { filterDocumentFiles, filterImageFiles } from '@/lib/utils/file'
import ImageComponent from '../Image'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { RootState } from '@/lib/redux/store'

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
    const { files, selectedFile, isLoading:fileLoading } = useAppSelector((state: RootState) => state.file) 

    useEffect(() => {
        dispatch(getFiles({
            model_name: model_name,
        }))
    }, [])

    return (
        <div>
            <SearchableSelectField
                label={label}
                name={name}
                placeholder={placeholder}
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
