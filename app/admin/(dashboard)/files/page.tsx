"use client"

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { FolderClosed, FolderOpen, Trash, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { bulkUploadFile, deleteFile, getFiles } from '@/lib/redux/slices/file/file'
import { RootState } from '@/lib/redux/store'
import { fileService } from '@/lib/redux/slices/file/file.service'
import { SearchField } from '@/components/shared/form/SearchField'
import { useRouter, useSearchParams } from 'next/navigation'
import { capitalizeFirstLetter } from '@/lib/utils/string'
import FileCard from '@/components/file/FileCard'
import FileDropzone from '@/components/shared/form/FileDropzone'
import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import Button from '@/components/shared/button/Button'
import Modal from '@/components/shared/modal/Modal'
import ListSection from '@/components/shared/ListSection'
import Pagination from '@/components/shared/Pagination'
import ListEmpty from '@/components/shared/ListEmpty'
import { AdminListSkeleton } from '@/components/shared/Skeleton'
import { useConfirm } from '@/lib/hooks/useConfirm'
import type { FileInterface } from '@/lib/interfaces/file'

interface CategoryCount {
    model_name: string
    count: number
}

export default function FilesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const model = searchParams.get("model")

    const dispatch = useAppDispatch()
    const { files, total, totalPages, isLoading } = useAppSelector((state: RootState) => state.file)
    const { confirm, ConfirmDialog } = useConfirm()

    const [categories, setCategories] = useState<CategoryCount[]>([])
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        file_name?: string
        label?: string
    }>({})

    // Every model_name actually present in the data, not a hardcoded
    // "Profile"/"Others" pair — so files belonging to any feature (projects,
    // certifications, blog, ...) are reachable from here too. Fetched
    // outside Redux so it doesn't fight the paginated per-category list
    // below over the same `files` slice.
    useEffect(() => {
        let cancelled = false
        setIsCategoriesLoading(true)
        fileService.getFiles({ per_page: 500 }).then((response) => {
            if (cancelled) return
            const counts = new Map<string, number>()
            for (const file of response?.data ?? []) {
                const key = file.model_name ?? 'others'
                counts.set(key, (counts.get(key) ?? 0) + 1)
            }
            setCategories(
                Array.from(counts.entries())
                    .map(([model_name, count]) => ({ model_name, count }))
                    .sort((a, b) => a.model_name.localeCompare(b.model_name))
            )
            setIsCategoriesLoading(false)
        })
        return () => { cancelled = true }
    }, [model, total])

    useEffect(() => {
        if (model) {
            dispatch(getFiles({
                model_name: model,
                ...filtersState
            }))
        }
        setSelectedIds([])
    }, [dispatch, model, filtersState])

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const handleBulkDelete = () => confirm({
        title: `Delete ${selectedIds.length} file(s)`,
        content: `This can't be undone.`,
        confirmLabel: "Delete",
        onConfirm: async () => {
            await Promise.all(selectedIds.map((id) => dispatch(deleteFile({ id })).unwrap()))
            setSelectedIds([])
        },
    })

    return (
        <div>
            {ConfirmDialog}

            <Modal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                title="Add File"
            >
                <FileDropzone
                    multiple
                    label="Drop files here or click to browse"
                    onUpload={async (file) => {
                        const formData = new FormData()
                        formData.append('files', file)
                        formData.append('model_name', model ?? 'others')
                        const results = await dispatch(bulkUploadFile(formData)).unwrap()
                        return results?.[0]
                    }}
                    onUploaded={() => {
                        if (model) dispatch(getFiles({ model_name: model, ...filtersState }))
                    }}
                />
            </Modal>

            <div>
                {model !== null ? (
                    <div>
                        <BackButton href="/admin/files" />

                        <ActionBreadcrumb
                            title={capitalizeFirstLetter(model)}
                            subtitle={`${total} file(s) total`}
                            action={() => setIsUploadOpen(true)}
                            actionLabel="Add File"
                        />

                        <SearchField
                            searchQuery={search}
                            setSearchQuery={setSearch}
                            placeholder='Search files by name or label'
                            onSearch={() => setFiltersState({...filtersState, file_name: search})}
                            onSearchClear={() => setFiltersState({})}
                        />

                        {selectedIds.length > 0 && (
                            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2 mb-4">
                                <p className="text-sm text-foreground">{selectedIds.length} selected</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                                        <X className="h-4 w-4 mr-1" /> Clear
                                    </Button>
                                    <Button variant="ghostDanger" size="sm" onClick={handleBulkDelete}>
                                        <Trash className="h-4 w-4 mr-1" /> Delete selected
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <AdminListSkeleton rows={5} />
                        ) : (
                            <>
                                <ListSection
                                    subtitle={`${total} file(s) total`}
                                    icon={FolderOpen}
                                >
                                    {files.length === 0 && (
                                        <ListEmpty title='files' subtitle='Click "Add File" to upload your first one.' />
                                    )}

                                    {files.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                            {files.map((file: FileInterface) => (
                                                <FileCard
                                                    key={file.id}
                                                    file={file}
                                                    variant="grid"
                                                    selectable
                                                    selected={selectedIds.includes(file.id)}
                                                    onToggleSelect={() => toggleSelect(file.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </ListSection>

                                <Pagination
                                    currentPage={filtersState.page ?? 1}
                                    totalPages={totalPages ?? 1}
                                    onPageChange={(page) => setFiltersState({...filtersState, page})}
                                />
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        <Breadcrumb title="File Management" subtitle="Organize and manage your portfolio files" />

                        {isCategoriesLoading ? (
                            <AdminListSkeleton rows={4} />
                        ) : (
                            <ListSection
                                title="File Browser"
                                subtitle={`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} • ${categories.reduce((sum, c) => sum + c.count, 0)} file(s) total`}
                                icon={FolderOpen}
                            >
                                {categories.length === 0 && (
                                    <ListEmpty title='files' subtitle='No files have been uploaded yet.' />
                                )}

                                {categories.map((category) => (
                                    <div
                                        className='flex items-center justify-between p-4 hover:bg-background/10 transition-colors border-b border-border cursor-pointer'
                                        key={category.model_name}
                                        onClick={() => router.push(`/admin/files?model=${category.model_name}`)}
                                    >
                                        <div className='flex items-center gap-4'>
                                            <FolderClosed className='h-6 w-6 text-primary'/>
                                            <div>
                                                <p className='font-medium text-foreground'>{capitalizeFirstLetter(category.model_name)}</p>
                                                <p className='text-sm text-muted-foreground'>{category.count} file(s)</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ListSection>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
