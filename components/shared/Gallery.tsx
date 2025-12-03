"use client"

import { useEffect, useState } from 'react'
import ImageComponent from './Image'
import FormModal from './modal/FormModal'
import type { RootState } from '@/lib/redux/store'
import { getFiles } from '@/lib/redux/slices/file/file'
import Button from './button/Button'
import FormFileUpload from './form/FormFileUpload'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { fileBaseSchema, type FileBaseFormData } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import { createFile } from '@/lib/redux/slices/file/file'
import Loading from '@/app/loading'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'

export default function Gallery({   
    model_name,
    model_id
}: {
    model_name: string
    model_id?: string
}) {
    const dispatch = useAppDispatch()
    const { files, isLoading } = useAppSelector((state: RootState) => state.file)

    const [ openFileUploadModal, setOpenFileUploadModal ] = useState<boolean>(false)
    const methods = useZodForm(fileBaseSchema)

    useEffect(() => {
        dispatch(getFiles({
            model_id: model_id,
            model_name: model_name,
        }))
    }, [dispatch, model_id, model_name])

    // Change signature to accept any to fix the type error for react-hook-form's SubmitHandler<FieldValues>
    const submitCreateForm = (data: any) => {
        // Optionally: Validate shape if needed
        // console.log(data)
        const formData = objectToFormData(data)
        dispatch(createFile(formData))
    }

    return isLoading ? <Loading/> : (
        <div>
            <FormModal
                title='Upload File'
                subtitle='Upload a file'
                isOpen={openFileUploadModal}
                setIsOpen={setOpenFileUploadModal}
                // Fix: Type is now compatible with SubmitHandler<FieldValues>
                onSubmit={methods.handleSubmit(submitCreateForm)}
                isSubmitting={isLoading}
                methods={methods}
            >
                <FormFileUpload
                    name='file'
                    accept='image/*'
                />

            </FormModal>

            {files.length === 0
                ? <div className='h-[15vh] flex items-center justify-center flex-col'>
                    <p>No images available</p>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setOpenFileUploadModal(true)}
                    >
                        Add
                    </Button>
                </div>
                // :  <div className=' p-6 grid items-center justify-center grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4'>
                : <div className='p-6'>
                    <div className="flex items-center justify-between">
                        <p className='p mb-4'>Number of images: <span className='text-lg text-foreground font-bold'>{files.length}</span> </p>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setOpenFileUploadModal(true)}
                        >
                            Add
                        </Button>
                    </div>
                    <div className='flex items-center justify-start flex-wrap gap-4'>
                        {files.map((file, index) => (
                            <div key={index} className='relative'>
                                <ImageComponent
                                    src={file.url ?? ""}
                                    alt='image'
                                    width={100}
                                    height={100}
                                    objectFit='cover'
                                    lazy
                                    rounded
                                />
                            </div>
                        ))}
                    </div>
                </div>  
            }
        </div>
    )
}
