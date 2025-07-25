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
import { getFiles, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import FileSelectField from '@/components/shared/form/FileSelectField'
import { Pencil, Trash, Wrench } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import { createSkill, deleteSkill, getSkills, setSelectedSkill, updateSkill } from '@/lib/redux/slices/skill/skill'
import { SkillBaseFormData, skillBaseSchema, UpdateSkillFormData, updateSkillSchema } from '@/lib/validators/skill'
import Pagination from '@/components/shared/Pagination'
import ProgressBar from '@/components/shared/ProgressBar'

export default function SkillsPage() {
    const dispatch = useAppDispatch()
    const { total, totalPages, skills, isLoading, selectedSkill } = useAppSelector((state: RootState) => state.skill)    

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string
    }>({})

    useEffect(() => {
        dispatch(getSkills({
            ...filtersState,
        }))

        dispatch(getFiles({
            model_name: "others",
        }))

    }, [filtersState])

    const createMethods = useZodForm<SkillBaseFormData>(skillBaseSchema)
    const editMethods = useZodForm<UpdateSkillFormData>(updateSkillSchema)

    const onSubmit = (data: SkillBaseFormData) => {
        console.log(data)
        dispatch(createSkill(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateSkillFormData) => {
        console.log(data)
        dispatch(updateSkill({
            id: selectedSkill?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Skill"
                subtitle="Add a new skill to your portfolio"
                isSubmitting={isLoading}
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
            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Skill"
                subtitle="Edit the skill"
                isSubmitting={isLoading}
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

            <ListSection
                title="Skill Management"
                subtitle={`${total} skill(s) total`}
                icon={Wrench}
            >
                {skills.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No skills found</p>
                    </div>
                )}

                {skills.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {skills.map((skill) => (
                            <ListCard
                                key={skill.id}
                                actions={[
                                    {
                                        text: "Edit",
                                        onSelect: () => {
                                            dispatch(setSelectedSkill(skill))
                                            setIsEditOpen(true)
                                            editMethods.reset(skill)    
                                        },
                                        icon: <Pencil className='w-4 h-4' />
                                    },
                                    {
                                        text: "Delete",
                                        onSelect: () => {
                                            dispatch(deleteSkill({
                                                id: skill?.id ?? "",
                                            }))
                                        },
                                        icon: <Trash className='w-4 h-4 text-red-500' />
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
                                        <h3 className='text-xl text-foreground font-bold mb-2'>{skill.name}</h3>
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
    )
}
