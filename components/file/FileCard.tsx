'use client'

import { FileInterface } from '@/lib/interfaces/file'
import { formatFileSize, getFileIcon } from '@/lib/utils/file'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Badge from '../shared/Badge'
import { formatDate } from '@/lib/utils/formatter'
import { DropdownButton } from '../shared/button/DropdownButton'
import { Copy, Download, Eye, MoreVertical, Pencil, Trash } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { deleteFile, updateFile } from '@/lib/redux/slices/file/file'
import FormModal from '../shared/modal/FormModal'
import TextAreaInput from '../shared/form/TextAreaInput'
import FormInput from '../shared/form/FormInput'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { UpdateFileFormData, updateFileSchema } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import toaster from '@/lib/utils/toaster'

export default function FileCard({ file }: { file: FileInterface }) {
  const dispatch = useAppDispatch()
  const {selectedFile, isLoading} = useAppSelector(state => state.file)

  const [isOpen, setIsOpen] = useState(false)
  const methods = useZodForm<UpdateFileFormData>(updateFileSchema)

  const handleDelete = () => {
    dispatch(deleteFile({id: file.id}))
  }

  const onSubmit = (data: UpdateFileFormData) => {
    const formData = objectToFormData(data)
    dispatch(updateFile({id: file.id, payload: formData}))
    setIsOpen(false)
    methods.reset()
  }

  useEffect(() => {
    if (selectedFile) {
      methods.reset(selectedFile)
    }
  }, [selectedFile, methods])

  return (
    <div
        key={file.id}
        className={clsx(
          "flex items-center justify-between p-4 hover:bg-background/10 transition-colors border-b border-border",
        )}
    >
        <FormModal
            methods={methods}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={methods.handleSubmit(onSubmit)}
            title="Edit File"
            subtitle="Edit the file details"
            isSubmitting={isLoading}
        >
            <FormInput
                name="file_name"
                label="File name"
                placeholder="Enter a file name"
                defaultValue={file.file_name}
            />

            <FormInput
                name="label"
                label="Label"
                placeholder="Enter a label"
                defaultValue={file.label}
            />

            <FormInput
                name="position"
                label="Position"
                placeholder="Enter a position"
                type="number"
                defaultValue={file.position}
            />

            <TextAreaInput
                name="description"
                label="Description"
                placeholder="Enter a description"
                defaultValue={file.description}
            />
        </FormModal>

        <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-primary">
                {getFileIcon(file?.file_name ?? '')}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                        {file?.file_name ?? 'No name'}
                    </p>
                    {file.label && (
                        <Badge variant="outline" className="text-xs">
                            {file?.label ?? 'No label'}
                        </Badge>
                    )}
                </div>
                {file.description && (
                <p className="text-sm text-muted-foreground truncate">
                    {file?.description ?? 'No description'}
                </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Position: {file?.position}</span>
                    <span>{formatFileSize(file?.file_size ?? 0)}</span>
                    <span>{formatDate(file?.created_at ?? '')}</span>
                    {file?.unique_id && <span>ID: {file?.unique_id}</span>}
                </div>
            </div>
        </div>

        <DropdownButton 
            variant='ghost'
            size='sm'
            items={[
                {
                    text: 'View',
                    onSelect: () => window.open(file.external_url ?? file.url ?? '', "_blank"),
                    icon: <Eye className="h-4 w-4 text-muted-foreground" />
                },
                {
                    text: 'Download',
                    onSelect: () => window.open(file.external_url ?? file.url ?? '', "_blank"),
                    icon: <Download className="h-4 w-4 text-muted-foreground" />
                },
                {
                    text: 'Edit',
                    onSelect: () => setIsOpen(true),
                    icon: <Pencil className="h-4 w-4 text-muted-foreground" />
                },
                {
                    text: "Copy URL",
                    onSelect: () => {
                        navigator.clipboard.writeText(file.external_url ?? file.url ?? '')
                        toaster.success("URL copied to clipboard")
                    },
                    icon: <Copy className="h-4 w-4 text-muted-foreground" />
                },
                {
                    text: 'Delete',
                    onSelect: handleDelete,
                    icon: <Trash className="h-4 w-4 text-red-500" />
                }
            ]}
            buttonIcon={<MoreVertical className="h-4 w-4 text-muted-foreground" />}
        />
    </div>
  )
}
