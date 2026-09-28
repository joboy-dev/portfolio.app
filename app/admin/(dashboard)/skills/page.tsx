"use client"

import ActionBreadcrumb from '@/components/shared/breadcrumb/ActionBreadcrumb'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { RootState } from '@/lib/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import FormModal from '@/components/shared/modal/FormModal'
import FormInput from '@/components/shared/form/FormInput'
import { SearchField } from '@/components/shared/form/SearchField'
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import FileSelectField from '@/components/shared/form/FileSelectField'
import FormToggle from '@/components/shared/form/FormToggle'
import { CheckCircle2, Pencil, Trash, Wrench, XCircle } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import Badge from '@/components/shared/Badge'
import type { SkillInterface } from '@/lib/interfaces/skill'
import { createSkill, deleteSkill, getSkills, setSelectedSkill, updateSkill } from '@/lib/redux/slices/skill/skill'
import { SkillBaseFormData, skillBaseSchema, UpdateSkillFormData, updateSkillSchema } from '@/lib/validators/skill'
import Pagination from '@/components/shared/Pagination'
import ProgressBar from '@/components/shared/ProgressBar'
import ListEmpty from '@/components/shared/ListEmpty'
import { AdminListSkeleton } from '@/components/shared/Skeleton'
import { useConfirm } from '@/lib/hooks/useConfirm'

export default function SkillsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, skills, isLoading, isSubmitting, selectedSkill } = useAppSelector((state: RootState) => state.skill)
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
        dispatch(getSkills({
            ...filtersState,
        })).finally(() => { hasLoadedOnce.current = true })

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [dispatch, filtersState])

    const createMethods = useZodForm<SkillBaseFormData>(skillBaseSchema)
    const editMethods = useZodForm<UpdateSkillFormData>(updateSkillSchema)

    const onSubmit = async (data: SkillBaseFormData) => {
        await dispatch(createSkill(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = async (data: UpdateSkillFormData) => {
        await dispatch(updateSkill({
            id: selectedSkill?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    const togglePublish = (skill: SkillInterface) => {
        dispatch(updateSkill({
            id: skill.id,
            payload: { is_published: !skill.is_published },
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
                title="Add Skill"
                subtitle="Add a new skill to your portfolio"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the skill"
                />

                <FormInput  
                    name="proficiency"
                    label="Proficiency"
                    placeholder="Enter the proficiency of the skill (0-100)"
                    type="number"
                />

                <FileSelectField
                    control={createMethods.control}
                    name="file_id"
                    label="Skill image"
                    placeholder="Select skill image"
                    model_name="others"
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this skill visible on the public site"
                />
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Skill"
                subtitle="Edit the skill"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the skill"
                />

                <FormInput
                    name="proficiency"
                    label="Proficiency"
                    placeholder="Enter the proficiency of the skill (0-100)"
                    type="number"
                />

                <FormInput
                    name="position"
                    label="Position"
                    placeholder="Enter the position of the skill"
                    type="number"
                />

                <FileSelectField
                    control={editMethods.control}
                    name="file_id"
                    label="Skill image"
                    placeholder="Select skill image"
                    model_name="others"
                />

                <FormToggle
                    name="is_published"
                    label="Published"
                    description="Make this skill visible on the public site"
                />
            </FormModal>

            <ActionBreadcrumb
                title="Skill Management"
                subtitle="Manage your skills"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Skill"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search skills by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            {isLoading && !hasLoadedOnce.current ? (
                <AdminListSkeleton grid rows={6} />
            ) : (
                <div className={clsx('transition-opacity duration-(--dur-base)', isLoading ? 'opacity-60' : 'opacity-100')} aria-busy={isLoading}>
                    <ListSection
                        subtitle={`${total} skill(s) total`}
                        icon={Wrench}
                    >
                        {skills.length === 0 && (
                            <ListEmpty title='skills' subtitle='Click "Add Skill" to create your first one.' />
                        )}

                        {skills.length > 0 && (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {skills.map((skill) => (
                                    <ListCard
                                        key={skill.id}
                                        primaryActions={[
                                            {
                                                label: "Edit",
                                                onSelect: () => {
                                                    dispatch(setSelectedSkill(skill))
                                                    setIsEditOpen(true)
                                                    editMethods.reset(skill)
                                                },
                                                icon: <Pencil className='w-4 h-4' />
                                            },
                                            {
                                                label: "Delete",
                                                variant: "ghostDanger",
                                                onSelect: () => confirm({
                                                    title: "Delete skill",
                                                    content: `Delete "${skill.name}"? This can't be undone.`,
                                                    confirmLabel: "Delete",
                                                    onConfirm: () => dispatch(deleteSkill({ id: skill?.id ?? "" })).unwrap(),
                                                }),
                                                icon: <Trash className='w-4 h-4' />
                                            }
                                        ]}
                                        actions={[
                                            {
                                                text: skill.is_published ? "Unpublish" : "Publish",
                                                onSelect: () => togglePublish(skill),
                                                icon: skill.is_published
                                                    ? <XCircle className='w-4 h-4' />
                                                    : <CheckCircle2 className='w-4 h-4' />
                                            }
                                        ]}
                                    >
                                        <div className='flex items-center gap-8 w-full max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                            <Avatar
                                                src={skill.skill_logo?.url}
                                                alt={skill.name}
                                                size='lg'
                                                rounded='md'
                                            />
                                            <div>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <h3 className='text-xl text-foreground font-bold'>{skill.name}</h3>
                                                    <Badge variant={skill.is_published ? 'primary' : 'outlineSecondary'}>
                                                        {skill.is_published ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <ProgressBar value={skill.proficiency ?? 0} />
                                                    <p className='text-sm text-muted-foreground'>{skill.proficiency}%</p>
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
