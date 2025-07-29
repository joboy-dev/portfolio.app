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
import { bulkUploadFile, setSelectedFile } from '@/lib/redux/slices/file/file'
import ListCard from '@/components/shared/card/ListCard'
import { File, Pencil, Tag, Trash, Upload, Wrench } from 'lucide-react'
import ListSection from '@/components/shared/ListSection'
import Avatar from '@/components/shared/Avatar'
import Pagination from '@/components/shared/Pagination'
import TextAreaInput from '@/components/shared/form/TextAreaInput'
import { deleteProject, getProjects, setSelectedProject, updateProject } from '@/lib/redux/slices/project/project'
import { ProjectBaseFormData, projectBaseSchema } from '@/lib/validators/project'
import { updateProjectSchema } from '@/lib/validators/project'
import { createProject } from '@/lib/redux/slices/project/project'
import { UpdateProjectFormData } from '@/lib/validators/project'
import CreatableMultiSelectField from '@/components/shared/form/CreatableMultiSelect'
import SearchableSelectField from '@/components/shared/form/SearchableSelect'
import { Option } from '@/lib/interfaces/general'
import { BulkUploadFileFormData, bulkUploadFileSchema, FileBaseFormData, fileBaseSchema } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import FormFileUpload from '@/components/shared/form/FormFileUpload'
import toaster from '@/lib/utils/toaster'
import FileCard from '@/components/file/FileCard'
import TagAttachModal from '@/components/tag/TagAttachModal'
import TagDetatchModal from '@/components/tag/TagDetatchModal'
import TiptapField from '@/components/shared/form/TiptapField'
import Badge from '@/components/shared/Badge'
import { setSelectedTag } from '@/lib/redux/slices/tag/tag'
import AdditionalInfoField from '@/components/shared/form/AdditionalInfoField'
import DateInput from '@/components/shared/form/DateInput'

export default function ProjectsPage() {
    const projectDomain: Option[] = [
        {
            label: "Web Development",
            value: "Web Development",
            key: 0,
        },
        {
            label: "Mobile Development",
            value: "Mobile Development",
            key: 1,
        },
        {
            label: "Backend Development",
            value: "Backend Development",
            key: 2,
        },
        {
            label: "Frontend Development",
            value: "Frontend Development",
            key: 3,
        },
        {
            label: "Full Stack Development",
            value: "Full Stack Development",
            key: 4,
        },
        {
            label: "Data Science",
            value: "Data Science",
            key: 5,
        },
        {
            label: "AI & ML",
            value: "AI & ML",
            key: 6,
        },
        {
            label: "Blockchain",
            value: "Blockchain",
            key: 7,
        },
        {
            label: "DevOps",
            value: "DevOps",
            key: 8,
        },
        {
            label: "Cybersecurity",
            value: "Cybersecurity",
            key: 9,
        },
        {
            label: "Other",
            value: "Other",
            key: 10,
        }
    ]

    const projectType: Option[] = [
        {
            label: "Personal",
            value: "Personal",
            key: 0,
        },
        {
            label: "Professional",
            value: "Professional",
            key: 1,
        },
        {
            label: "Team",
            value: "Team",
            key: 2,
        },
        {
            label: "Academic",
            value: "Academic",
            key: 2,
        },
        {
            label: "Other",
            value: "Other",
            key: 3,
        }
    ]

    const projectStatus: Option[] = [
        {
            label: "Active",
            value: "Active",
            key: 0,
        },
        {
            label: "Inactive",
            value: "Inactive",
            key: 1,
        },
        {
            label: "Completed",
            value: "Completed",
            key: 2,
        },
        {
            label: "Ongoing",
            value: "Ongoing",
            key: 3,
        },
        {
            label: "On Hold",
            value: "On Hold",
            key: 4,
        },
        {
            label: "Cancelled",
            value: "Cancelled",
            key: 5,
        },
        {
            label: "Other",
            value: "Other",
            key: 6,
        },
    ]

    const dispatch = useAppDispatch()
    const { total, totalPages, projects, isLoading, selectedProject } = useAppSelector((state: RootState) => state.project)    
    const { isLoading: fileLoading } = useAppSelector((state: RootState) => state.file)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [openProjectFilesId, setOpenProjectFilesId] = useState<string | null>(null);
    const [isAttachTagOpen, setIsAttachTagOpen] = useState(false)
    const [isDetatchTagOpen, setIsDetatchTagOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [filtersState, setFiltersState] = useState<{
        page?: number
        per_page?: number
        name?: string,
        domain?: string,
        project_type?: string,
    }>({})

    useEffect(() => {
        dispatch(getProjects({
            ...filtersState,
        }))

        if (selectedProject) {
            uploadMethods.reset({
                model_id: selectedProject.id,
                model_name: "projects",
            })
        }

    }, [filtersState, selectedProject])

    const createMethods = useZodForm<ProjectBaseFormData>(projectBaseSchema)
    const editMethods = useZodForm<UpdateProjectFormData>(updateProjectSchema)
    const uploadMethods = useZodForm<BulkUploadFileFormData>(bulkUploadFileSchema, {
        model_id: selectedProject?.id ?? "",
        model_name: "projects",
    })

    const onSubmit = (data: ProjectBaseFormData) => {
        console.log(data)
        dispatch(createProject(data))
        createMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsCreateOpen(false)
    }

    const onEditSubmit = (data: UpdateProjectFormData) => {
        console.log(data)
        dispatch(updateProject({
            id: selectedProject?.id ?? "",
            payload: data,
        }))
        editMethods.reset()
        dispatch(setSelectedFile(undefined))
        setIsEditOpen(false)
    }

    const onUploadSubmit = (data: BulkUploadFileFormData) => {
        console.log(data)
        const formData = objectToFormData(data)
        dispatch(bulkUploadFile(formData)).then(() => {
            // Refetch certifications after upload completes
            dispatch(getProjects({ ...filtersState }))
        })
        uploadMethods.reset()
        setIsUploadOpen(false)
    }

    return isLoading ? <Loading /> : (
        <div>
            <FormModal
                methods={createMethods}
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                onSubmit={createMethods.handleSubmit(onSubmit)}
                title="Add Project"
                subtitle="Add a new project to your portfolio"
                isSubmitting={isLoading}
                size='lg'
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the project"
                />

                <FormInput
                    name="tagline"
                    label="Tagline"
                    placeholder="Enter the tagline of the project"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the project"
                />

                <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                    <SearchableSelectField
                        control={createMethods.control}
                        name="domain"
                        label="Domain"
                        placeholder="Select the domain of the project"
                        options={projectDomain}
                    />

                    <SearchableSelectField
                        control={createMethods.control}
                        name="project_type"
                        label="Project Type"
                        placeholder="Select the project type of the project" 
                        options={projectType}
                    />

                    <FormInput
                        name="role"
                        label="Role"
                        placeholder="Enter the role of the project"
                    />  

                    <FormInput
                        name="client"
                        label="Client"
                        placeholder="Enter the client of the project"
                    />

                    <FormInput
                        name="sector"
                        label="Sector"
                        placeholder="Enter the sector of the project"
                    />

                    <DateInput
                        name="start_date"
                        label="Start Date"
                        placeholder="Enter the start date of the project"
                    />

                    <DateInput
                        name="end_date"
                        label="End Date"
                        placeholder="Enter the end date of the project"
                    />

                    <SearchableSelectField
                        control={createMethods.control}
                        name="status"
                        label="Status"
                        placeholder="Select the status of the project"
                        options={projectStatus}
                    />

                    <FormInput
                        name="github_link"
                        label="Github Link"
                        placeholder="Enter the github link of the project"
                    />

                    <FormInput
                        name="postman_link"
                        label="Postman Link"
                        placeholder="Enter the postman link of the project"
                    />

                    <FormInput
                        name="live_link"
                        label="Live Link"
                        placeholder="Enter the live link of the project"
                    />

                    <FormInput
                        name="google_drive_link"
                        label="Google Drive Link"
                        placeholder="Enter the google drive link of the project"
                    />

                    <FormInput
                        name="figma_link"
                        label="Figma Link"
                        placeholder="Enter the figma link of the project"
                    />
                </div>


                <CreatableMultiSelectField
                    methods={createMethods}
                    name="tools"
                    label="Tools"
                    placeholder="Enter the tools of the project"
                    options={[]}
                />

                <CreatableMultiSelectField
                    methods={createMethods}
                    name="features"
                    label="Features"
                    placeholder="Enter the features of the project"
                    options={[]}
                />

                <CreatableMultiSelectField
                    methods={createMethods}
                    name="results"
                    label="Results"
                    placeholder="Enter the results of the project"
                    options={[]}
                />

                <AdditionalInfoField
                    header='Challenges and Solutions'
                    methods={createMethods}
                    name='challenges_and_solutions'
                />

                <AdditionalInfoField
                    header='Technical Details'
                    methods={createMethods}
                    name='technical_details'
                />

            </FormModal>

            <FormModal
                methods={editMethods}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                onSubmit={editMethods.handleSubmit(onEditSubmit)}
                title="Edit Project"
                subtitle="Edit the project"
                isSubmitting={isLoading}
                size='lg'
            >
                <FormInput
                    name="name"
                    label="Name"
                    placeholder="Enter the name of the project"
                />

                <FormInput
                    name="tagline"
                    label="Tagline"
                    placeholder="Enter the tagline of the project"
                />

                <TextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Enter the description of the project"
                />

                <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                    <SearchableSelectField
                        control={editMethods.control}
                        name="domain"
                        label="Domain"
                        placeholder="Select the domain of the project"
                        options={projectDomain}
                    />

                    <SearchableSelectField
                        control={editMethods.control}
                        name="project_type"
                        label="Project Type"
                        placeholder="Select the project type of the project" 
                        options={projectType}
                    />

                    <FormInput
                        name="role"
                        label="Role"
                        placeholder="Enter the role of the project"
                    />

                    <FormInput
                        name="client"
                        label="Client"
                        placeholder="Enter the client of the project"
                    />

                    <FormInput
                        name="sector"
                        label="Sector"
                        placeholder="Enter the sector of the project"
                    />

                    <DateInput
                        name="start_date"
                        label="Start Date"
                        placeholder="Enter the start date of the project"
                    />

                    <DateInput
                        name="end_date"
                        label="End Date"
                        placeholder="Enter the end date of the project"
                    />

                    <SearchableSelectField
                        control={editMethods.control}
                        name="status"
                        label="Status"
                        placeholder="Select the status of the project"
                        options={projectStatus}
                    />

                    <FormInput
                        name="position"
                        label="Position"
                        placeholder="Enter the position of the project"
                        type="number"
                    />

                    <FormInput
                        name="github_link"
                        label="Github Link"
                        placeholder="Enter the github link of the project"
                    />

                    <FormInput
                        name="postman_link"
                        label="Postman Link"
                        placeholder="Enter the postman link of the project"
                    />

                    <FormInput
                        name="live_link"
                        label="Live Link"
                        placeholder="Enter the live link of the project"
                    />

                    <FormInput
                        name="google_drive_link"
                        label="Google Drive Link"
                        placeholder="Enter the google drive link of the project"
                    />

                    <FormInput
                        name="figma_link"
                        label="Figma Link"
                        placeholder="Enter the figma link of the project"
                    />
                </div>

                <CreatableMultiSelectField
                    methods={editMethods}
                    name="tools"
                    label="Tools"
                    placeholder="Enter the tools of the project"
                    options={[]}
                    defaultValue={selectedProject?.tools?.map((tool) => ({
                        label: tool,
                        value: tool,
                        key: tool.length,
                    }))}
                />

                <CreatableMultiSelectField
                    methods={editMethods}
                    name="features"
                    label="Features"
                    placeholder="Enter the features of the project"
                    options={[]}
                    defaultValue={selectedProject?.features?.map((feature) => ({
                        label: feature,
                        value: feature,
                        key: feature.length,
                    }))}
                />

                <CreatableMultiSelectField
                    methods={editMethods}
                    name="results"
                    label="Results"
                    placeholder="Enter the results of the project"
                    options={[]}
                    defaultValue={selectedProject?.results?.map((result) => ({
                        label: result,
                        value: result,
                        key: result.length,
                    }))}
                />

                <AdditionalInfoField
                    header='Challenges and Solutions'
                    methods={editMethods}
                    name='challenges_and_solutions'
                    keyToRemoveName='challenges_and_solutions_keys_to_remove'
                    defaultFields={selectedProject?.challenges_and_solutions ? Object.entries(selectedProject.challenges_and_solutions).map(([key, value]) => ({
                        key,
                        value,
                        id: key,
                        first: key,
                        second: value,
                    })) : []}
                />

                <AdditionalInfoField
                    header='Technical Details'
                    methods={editMethods}
                    name='technical_details'
                    keyToRemoveName='technical_details_keys_to_remove'
                    defaultFields={selectedProject?.technical_details ? Object.entries(selectedProject.technical_details).map(([key, value]) => ({
                        key,
                        value,
                        id: key,
                        first: key,
                        second: value,
                    })) : []}
                />
            </FormModal>

            <FormModal
                methods={uploadMethods}
                isOpen={isUploadOpen}
                setIsOpen={setIsUploadOpen}
                onSubmit={uploadMethods.handleSubmit(onUploadSubmit)}
                title="Upload Project Files"
                subtitle="Upload project files to your project"
                isSubmitting={fileLoading}
            >
                <FormFileUpload
                    name="files"
                    label="Upload Project Files"
                    required
                    multiple
                />
            </FormModal>

            <TagAttachModal
                isOpen={isAttachTagOpen}
                setIsOpen={setIsAttachTagOpen}
                model_type="projects"
                entity_id={selectedProject?.id ?? ""}
            />

            <TagDetatchModal
                isOpen={isDetatchTagOpen}
                setIsOpen={setIsDetatchTagOpen}
                model_type="projects"
                entity_id={selectedProject?.id ?? ""}
            />

            <ActionBreadcrumb
                title="Project Management"
                subtitle="Manage your projects"
                action={() => setIsCreateOpen(true)}
                actionLabel="Add Project"
            />

            <SearchField
                searchQuery={search}
                setSearchQuery={setSearch}
                placeholder='Search project by name'
                onSearch={() => setFiltersState({...filtersState, name: search})}
                onSearchClear={() => setFiltersState({})}
            />

            <ListSection
                title="Project Management"
                subtitle={`${total} project(s) total`}
                icon={Wrench}
            >
                {projects.length === 0 && (
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-gray-500'>No project found</p>
                    </div>
                )}

                {projects.length > 0 && (
                    <div>
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className='mb-2 flex flex-col gap-2'
                            >
                                <ListCard
                                    actions={[
                                        {
                                            text: "Edit",
                                            onSelect: () => {
                                                dispatch(setSelectedProject(project));
                                                setIsEditOpen(true);
                                                editMethods.reset({
                                                    name: project.name,
                                                    tagline: project.tagline,
                                                    description: project.description,
                                                    domain: project.domain,
                                                    project_type: project.project_type,
                                                    role: project.role,
                                                    client: project.client,
                                                    github_link: project.github_link,
                                                    postman_link: project.postman_link,
                                                    live_link: project.live_link,
                                                    google_drive_link: project.google_drive_link,
                                                    figma_link: project.figma_link,
                                                    position: project.position ?? 0,
                                                    sector: project.sector,
                                                    start_date: project.start_date ? new Date(project.start_date) : null,
                                                    end_date: project.end_date ? new Date(project.end_date) : null,
                                                    status: project.status,
                                                });
                                            },
                                            icon: <Pencil className='w-4 h-4' />
                                        },
                                        {
                                            text: "Upload Project Files",
                                            onSelect: () => {
                                                dispatch(setSelectedProject(project));
                                                setIsUploadOpen(true);
                                            },
                                            icon: <Upload className='w-4 h-4' />
                                        },
                                        {
                                            text: openProjectFilesId === project.id ? "Hide Project Files" : "View Project Files",
                                            onSelect: () => {
                                                if (project.files && project.files.length > 0) {
                                                    setOpenProjectFilesId(
                                                        openProjectFilesId === project.id ? null : project.id
                                                    );
                                                } else {
                                                    toaster.error("No project file found");
                                                }
                                            },
                                            icon: <File className='w-4 h-4' />,
                                        },
                                        {
                                            text: "Attach Tag",
                                            onSelect: () => {
                                                dispatch(setSelectedProject(project));
                                                setIsAttachTagOpen(true);
                                            },
                                            icon: <Tag className='w-4 h-4' />
                                        },
                                        {
                                            text: "Delete",
                                            onSelect: () => {
                                                dispatch(deleteProject({
                                                    id: project?.id ?? "",
                                                }));
                                            },
                                            icon: <Trash className='w-4 h-4 text-red-500' />
                                        }
                                    ]}
                                >
                                    <div className='flex items-start gap-8 max-md:flex-col max-md:items-start max-md:gap-4 max-md:justify-between'>
                                        <Avatar
                                            src={project.files && project.files.length > 0 
                                                ? project.files.find((file) => file.position === 1)?.url 
                                                : undefined
                                            }
                                            alt={project.name}
                                            size='lg'
                                            rounded='md'
                                        />
                                        <div>
                                            <h3 className='text-xl text-foreground font-bold mb-2'>{project.name}</h3>
                                            <p className='text-lg text-muted-foreground'>Domain: <span className='font-bold'>{project.domain}</span></p>
                                            <p className='text-lg text-muted-foreground'>Project Type: <span className='font-bold'>{project.project_type}</span></p>
                                            <p className='text-lg text-muted-foreground'>Role: <span className='font-bold'>{project.role}</span></p>
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {project.tags.map((tag) => (
                                                        <Badge 
                                                            key={tag.id} 
                                                            variant="primary" 
                                                            className="bg-primary/10 text-primary"
                                                            onClick={() => {
                                                                dispatch(setSelectedProject(project));
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
                                {(openProjectFilesId === project.id && project.files && project.files.length > 0) && (
                                    <div className='mt-2 ml-5'>
                                        {project.files.map((file) => (
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
