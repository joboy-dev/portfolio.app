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
import { bulkUploadFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import ConfirmationModal from '@/components/shared/modal/ConfirmationModal'
import { BookOpen, CheckCircle2, File, Pencil, Tag, Trash, Upload, XCircle } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import Pagination from '@/components/shared/Pagination'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import FormToggle from '@/components/shared/form/FormToggle'
import MarkdownEditorField from '@/components/shared/form/MarkdownEditorField'
import {
    deleteBlog,
    getBlogs,
    setSelectedBlog,
    updateBlog,
    createBlog,
    uploadBlogCoverImage,
} from '@/lib/redux/slices/blog/blog'
import { BlogBaseFormData, blogBaseSchema, blogCoverImageSchema, BlogCoverImageFormData, updateBlogSchema, UpdateBlogFormData } from '@/lib/validators/blog'
import { BulkUploadFileFormData, bulkUploadFileSchema } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import FormFileUpload from '@/components/shared/form/FormFileUpload'
import toaster from '@/lib/utils/toaster'
import FileCard from '@/components/file/FileCard'
import TagAttachModal from '@/components/tag/TagAttachModal'
import TagDetatchModal from '@/components/tag/TagDetatchModal'
import Badge from '@/components/shared/Badge'
import { setSelectedTag } from '@/lib/redux/slices/tag/tag'
import type { BlogInterface } from '@/lib/interfaces/blog'

export default function BlogPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, blogs, isLoading, isSubmitting, selectedBlog } = useAppSelector((state: RootState) => state.blog)
    const { isLoading: fileLoading } = useAppSelector((state: RootState) => state.file)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isCoverImageOpen, setIsCoverImageOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [openBlogFilesId, setOpenBlogFilesId] = useState<string | null>(null);
    const [isAttachTagOpen, setIsAttachTagOpen] = useState(false)
    const [isDetatchTagOpen, setIsDetatchTagOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [blogToDelete, setBlogToDelete] = useState<BlogInterface | undefined>(undefined)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        search?: string,
    }>({})

    useEffect(() => {
        dispatch(getBlogs({
            ...filtersState,
        }))

        if (selectedBlog) {
            uploadMethods.reset({
                model_id: selectedBlog.id,
                model_name: "blogs",
            })
        }

    }, [dispatch, filtersState, selectedBlog])

    const createMethods = useZodForm<BlogBaseFormData>(blogBaseSchema)
    const editMethods = useZodForm<UpdateBlogFormData>(updateBlogSchema)
    const coverImageMethods = useZodForm<BlogCoverImageFormData>(blogCoverImageSchema)
    const uploadMethods = useZodForm<BulkUploadFileFormData>(bulkUploadFileSchema, {
        model_id: selectedBlog?.id ?? "",
        model_name: "blogs",
    })

    const onSubmit = async (data: BlogBaseFormData) => {
        await dispatch(createBlog(data))
        createMethods.reset()
        setIsCreateOpen(false)
    }

    const onEditSubmit = async (data: UpdateBlogFormData) => {
        await dispatch(updateBlog({
            id: selectedBlog?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        setIsEditOpen(false)
    }

    const onCoverImageSubmit = async (data: BlogCoverImageFormData) => {
        const formData = objectToFormData(data)
        await dispatch(uploadBlogCoverImage({
            id: selectedBlog?.id ?? "",
            payload: formData,
        }))
        coverImageMethods.reset()
        setIsCoverImageOpen(false)
    }

    const onUploadSubmit = async (data: BulkUploadFileFormData) => {
        const formData = objectToFormData(data)
        await dispatch(bulkUploadFile(formData))
        dispatch(getBlogs({ ...filtersState }))
        uploadMethods.reset()
        setIsUploadOpen(false)
    }

    const togglePublish = (blog: BlogInterface) => {
        dispatch(updateBlog({
            id: blog.id,
            payload: { is_published: !blog.is_published },
        }))
    }

    const onDeleteConfirm = async () => {
        if (blogToDelete) {
            await dispatch(deleteBlog({ id: blogToDelete.id }))
        }
        setIsDeleteOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Blog Post"
                subtitle="Write a new blog post"
                isSubmitting={isSubmitting}
                size='lg'
            >
                <FormInput
                    name="title"
                    label="Title"
                    placeholder="Enter the title of the post"
                />

                <TextAreaInput
                    name="excerpt"
                    label="Excerpt"
                    placeholder="A short summary shown on the blog list and previews"
                />

                <MarkdownEditorField
                    control={createMethods.control}
                    name="content"
                    label="Content"
                    placeholder="Write your post in markdown..."
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this post visible on the public site"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Blog Post"
                subtitle="Edit the blog post"
                isSubmitting={isSubmitting}
                size='lg'
            >
                <FormInput
                    name="title"
                    label="Title"
                    placeholder="Enter the title of the post"
                />

                <TextAreaInput
                    name="excerpt"
                    label="Excerpt"
                    placeholder="A short summary shown on the blog list and previews"
                />

                <MarkdownEditorField
                    control={editMethods.control}
                    name="content"
                    label="Content"
                    placeholder="Write your post in markdown..."
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this post visible on the public site"
                />

                <FormInput
                    name="position"
                    label="Position"
                    placeholder="Enter the position of the post"
                    type="number"
                />
            </FormModal>

            <FormModal
                methods={coverImageMethods}
                isOpen={isCoverImageOpen}
                setIsOpen={setIsCoverImageOpen}
                onSubmit={coverImageMethods.handleSubmit(onCoverImageSubmit)}
                title="Upload Cover Image"
                subtitle="Upload or replace this post's cover image"
                isSubmitting={fileLoading}
            >
                <FormFileUpload
                    name="file"
                    label="Cover Image"
                    accept="image/*"
                    required
                />
            </FormModal>

            <FormModal
                methods={uploadMethods}
                isOpen={isUploadOpen}
                setIsOpen={setIsUploadOpen}
                onSubmit={uploadMethods.handleSubmit(onUploadSubmit)}
                title="Upload Blog Files"
                subtitle="Upload images to reference inside this post's markdown content"
                isSubmitting={fileLoading}
            >
                <FormFileUpload
                    name="files"
                    label="Upload Blog Files"
                    required
                    multiple
                />
            </FormModal>

            <TagAttachModal
                isOpen={isAttachTagOpen}
                setIsOpen={setIsAttachTagOpen}
                model_type="blogs"
                entity_id={selectedBlog?.id ?? ""}
            />

            <TagDetatchModal
                isOpen={isDetatchTagOpen}
                setIsOpen={setIsDetatchTagOpen}
                model_type="blogs"
                entity_id={selectedBlog?.id ?? ""}
            />

            <ConfirmationModal
                isOpen={isDeleteOpen}
                isLoading={isSubmitting}
                title="Delete Blog Post"
                content={`Are you sure you want to delete "${blogToDelete?.title}"? Once this is done, it cannot be reversed`}
                onConfirm={onDeleteConfirm}
                onClose={() => setIsDeleteOpen(false)}
            />

            <ActionBreadcrumb
                title="Blog Management"
                subtitle="Write and manage your blog posts"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Blog Post"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search blog posts by title'
                onSearch={() => setFiltersState({...filtersState, search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Blog Management"
                subtitle={`${total} post(s) total`}
                icon={BookOpen}
            >
                {blogs.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No blog post found</p>
                    </div>
                )}

                {blogs.length > 0 && (
                    <div>
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className='mb-2 flex flex-col gap-2'
                            >
                                <ListCard
                                    actions={[
                                        {
                                            text: "Edit",
                                            onSelect: () => {
                                                dispatch(setSelectedBlog(blog));
                                                setIsEditOpen(true);
                                                editMethods.reset({
                                                    title: blog.title,
                                                    excerpt: blog.excerpt,
                                                    content: blog.content,
                                                    is_published: blog.is_published,
                                                    position: blog.position ?? 0,
                                                });
                                            },
                                            icon: <Pencil className='w-4 h-4' />
                                        },
                                        {
                                            text: blog.is_published ? "Unpublish" : "Publish",
                                            onSelect: () => togglePublish(blog),
                                            icon: blog.is_published
                                                ? <XCircle className='w-4 h-4' />
                                                : <CheckCircle2 className='w-4 h-4' />
                                        },
                                        {
                                            text: "Upload Cover Image",
                                            onSelect: () => {
                                                dispatch(setSelectedBlog(blog));
                                                setIsCoverImageOpen(true);
                                            },
                                            icon: <Upload className='w-4 h-4' />
                                        },
                                        {
                                            text: "Upload Blog Files",
                                            onSelect: () => {
                                                dispatch(setSelectedBlog(blog));
                                                setIsUploadOpen(true);
                                            },
                                            icon: <Upload className='w-4 h-4' />
                                        },
                                        {
                                            text: openBlogFilesId === blog.id ? "Hide Blog Files" : "View Blog Files",
                                            onSelect: () => {
                                                if (blog.files && blog.files.length > 0) {
                                                    setOpenBlogFilesId(
                                                        openBlogFilesId === blog.id ? null : blog.id
                                                    );
                                                } else {
                                                    toaster.error("No blog file found");
                                                }
                                            },
                                            icon: <File className='w-4 h-4' />,
                                        },
                                        {
                                            text: "Attach Tag",
                                            onSelect: () => {
                                                dispatch(setSelectedBlog(blog));
                                                setIsAttachTagOpen(true);
                                            },
                                            icon: <Tag className='w-4 h-4' />
                                        },
                                        {
                                            text: "Delete",
                                            onSelect: () => {
                                                setBlogToDelete(blog);
                                                setIsDeleteOpen(true);
                                            },
                                            icon: <Trash className='w-4 h-4 text-red-500' />
                                        }
                                    ]}
                                >
                                    <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                        <Avatar
                                            src={blog.cover_image_url}
                                            alt={blog.title}
                                            size='lg'
                                            rounded='md'
                                            objectFit='contain'
                                        />
                                        <div>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <h3 className='text-xl text-foreground font-bold'>{blog.title}</h3>
                                                <Badge variant={blog.is_published ? 'primary' : 'outlineSecondary'}>
                                                    {blog.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                            <p className='text-lg text-muted-foreground'>{blog.excerpt ?? 'No excerpt'}</p>
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {blog.tags.map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant="primary"
                                                            className="bg-primary/10 text-primary"
                                                            onClick={() => {
                                                                dispatch(setSelectedBlog(blog));
                                                                dispatch(setSelectedTag(tag));
                                                                setIsDetatchTagOpen(true);
                                                            }}
                                                        >
                                                            <Tag className='w-4 h-4 mr-2' />
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ListCard>
                                {(openBlogFilesId === blog.id && blog.files && blog.files.length > 0) && (
                                    <div className='mt-2 ml-5'>
                                        {blog.files.map((file) => (
                                            <FileCard key={file.id} file={file} />
                                        ))}
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
