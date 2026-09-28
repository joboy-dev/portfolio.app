'use client'

import { FileInterface } from '@/lib/interfaces/file'
import { formatFileSize, getFileIcon } from '@/lib/utils/file'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Badge from '../shared/Badge'
import { formatDate } from '@/lib/utils/formatter'
import { DropdownButton } from '../shared/button/DropdownButton'
import Button from '../shared/button/Button'
import { AlertTriangle, Check, Copy, Download, Eye, MoreVertical, Pencil, RefreshCw, Trash } from 'lucide-react'
import ImageComponent from '../shared/Image'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { deleteFile, updateFile } from '@/lib/redux/slices/file/file'
import FormModal from '../shared/modal/FormModal'
import Modal from '../shared/modal/Modal'
import FileDropzone from '../shared/form/FileDropzone'
import TextAreaInput from '../shared/form/TextAreaInput'
import FormInput from '../shared/form/FormInput'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { UpdateFileFormData, updateFileSchema } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import toaster from '@/lib/utils/toaster'
import { useConfirm } from '@/lib/hooks/useConfirm'

export default function FileCard({
  file,
  variant = 'row',
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  file: FileInterface
  variant?: 'row' | 'grid'
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}) {
  const dispatch = useAppDispatch()
  const {selectedFile, isLoading} = useAppSelector(state => state.file)

  const [isOpen, setIsOpen] = useState(false)
  const [isReplaceOpen, setIsReplaceOpen] = useState(false)
  const [isBroken, setIsBroken] = useState(false)
  const methods = useZodForm<UpdateFileFormData>(updateFileSchema)
  const { confirm, ConfirmDialog } = useConfirm()

  const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(file.file_name ?? '')

  const handleDelete = () => confirm({
    title: "Delete file",
    content: `Delete "${file.file_name ?? 'this file'}"? This can't be undone.`,
    confirmLabel: "Delete",
    onConfirm: () => dispatch(deleteFile({ id: file.id })).unwrap(),
  })

  const handleDownload = () => {
    // The `download` attribute on an <a> is silently ignored by browsers for
    // cross-origin links (this file lives on the B2/object-storage domain,
    // not ours) — it just opens the file again, same as "View". Forcing an
    // actual save requires the SERVER to send Content-Disposition:
    // attachment, which the S3-compatible GetObject API accepts as a plain
    // query override even on an unsigned, public-read request.
    const url = file.external_url ?? file.url ?? ''
    const separator = url.includes('?') ? '&' : '?'
    const disposition = `response-content-disposition=${encodeURIComponent(`attachment; filename="${file.file_name ?? 'download'}"`)}`
    window.open(`${url}${separator}${disposition}`, '_blank')
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

  const menuItems = [
    {
        text: 'View',
        onSelect: () => window.open(file.external_url ?? file.url ?? '', "_blank"),
        icon: <Eye className="h-4 w-4 text-muted-foreground" />
    },
    {
        text: 'Download',
        onSelect: handleDownload,
        icon: <Download className="h-4 w-4 text-muted-foreground" />
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
        text: "Replace",
        onSelect: () => setIsReplaceOpen(true),
        icon: <RefreshCw className="h-4 w-4 text-muted-foreground" />
    },
  ]

  const modals = (
    <>
        {ConfirmDialog}

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

        <Modal
            isOpen={isReplaceOpen}
            onClose={() => setIsReplaceOpen(false)}
            title="Replace file"
        >
            <p className="text-sm text-muted-foreground mb-4">
                Uploads a new file and points every place this file is used at it, so nothing referencing it needs to be re-linked.
            </p>
            <FileDropzone
                accept={isImage ? "image/*" : undefined}
                multiple={false}
                label="Drop a replacement here or click to browse"
                onUpload={async (newFile) => {
                    const formData = new FormData()
                    formData.append('file', newFile)
                    return await dispatch(updateFile({ id: file.id, payload: formData })).unwrap()
                }}
                onUploaded={() => {
                    setIsBroken(false)
                    setIsReplaceOpen(false)
                }}
            />
        </Modal>
    </>
  )

  const brokenProbe = isImage && (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={file.url} alt="" className="hidden" onError={() => setIsBroken(true)} />
  )

  if (variant === 'grid') {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {modals}
            {brokenProbe}

            {selectable && (
                <button
                    type="button"
                    aria-label={selected ? "Deselect file" : "Select file"}
                    onClick={onToggleSelect}
                    className={clsx(
                        "absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border transition-colors",
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/80 text-transparent hover:text-muted-foreground"
                    )}
                >
                    <Check className="h-3.5 w-3.5" />
                </button>
            )}

            {isBroken && (
                <Badge variant="danger" className="absolute right-2 top-2 z-10 text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" /> Broken
                </Badge>
            )}

            <div className="flex aspect-square items-center justify-center bg-muted">
                {isImage && !isBroken ? (
                    <ImageComponent src={file.url ?? ''} alt={file.file_name ?? ''} objectFit="cover" className="h-full w-full" />
                ) : (
                    <div className="text-muted-foreground">{getFileIcon(file?.file_name ?? '')}</div>
                )}
            </div>

            <div className="flex items-center justify-between gap-2 p-2">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{file?.file_name ?? 'No name'}</p>
                    <p className="text-[10px] text-muted-foreground">{formatFileSize(file?.file_size ?? 0)}</p>
                </div>
                <DropdownButton
                    variant='ghost'
                    size='sm'
                    items={[
                        { text: 'Edit', onSelect: () => setIsOpen(true), icon: <Pencil className="h-4 w-4 text-muted-foreground" /> },
                        ...menuItems,
                        { text: 'Delete', onSelect: handleDelete, icon: <Trash className="h-4 w-4 text-destructive" /> },
                    ]}
                    buttonIcon={<MoreVertical className="h-4 w-4 text-muted-foreground" />}
                />
            </div>
        </div>
    )
  }

  return (
    <div
        key={file.id}
        className={clsx(
          "flex items-center justify-between p-4 hover:bg-background/10 transition-colors border-b border-border",
        )}
    >
        {modals}
        {brokenProbe}

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
                    {isBroken && (
                        <Badge variant="danger" className="text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" /> Broken
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

        <div className="flex items-center gap-1 shrink-0">
            <Button
                variant="ghost"
                size="sm"
                aria-label="Edit"
                title="Edit"
                onClick={() => setIsOpen(true)}
            >
                <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
                variant="ghostDanger"
                size="sm"
                aria-label="Delete"
                title="Delete"
                onClick={handleDelete}
            >
                <Trash className="h-4 w-4" />
            </Button>

            <DropdownButton
                variant='ghost'
                size='sm'
                items={menuItems}
                buttonIcon={<MoreVertical className="h-4 w-4 text-muted-foreground" />}
            />
        </div>
    </div>
  )
}
