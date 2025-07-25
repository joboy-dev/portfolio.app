import React, { useEffect } from 'react'    
import FormModal from '../shared/modal/FormModal'   
import { useZodForm } from '@/lib/hooks/useZodForm'
import { AttachOrDetatchTagSchema, type AttachOrDetatchTagFormData } from '@/lib/validators/tag'
import CreatableMultiSelectField from '../shared/form/CreatableMultiSelect'
import { capitalizeFirstLetter } from '@/lib/utils/string'
import FormInput from '../shared/form/FormInput'
import { getTags } from '@/lib/redux/slices/tag/tag'
import { tagService } from '@/lib/redux/slices/tag/tag.service'
import { refetchSingleEntity } from '@/lib/utils/refetch'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'

export default function TagAttachModal({
    isOpen, setIsOpen,
    model_type, entity_id,
    onClose
}: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    model_type: string
    entity_id: string
    onClose?: () => void
}) {
    const dispatch = useAppDispatch()
    const {tags, isSubmitting} = useAppSelector((state) => state.tag)
    const methods = useZodForm<AttachOrDetatchTagFormData>(AttachOrDetatchTagSchema, {
        entity_id,
        model_type,
    })

    useEffect(() => {
        dispatch(getTags({
            model_type: model_type,
        }))
    }, [])

    const submitForm = async (data: AttachOrDetatchTagFormData) => {
        console.log(data)
        await tagService.attachTagsToEntity({
            payload: data
        })
        refetchSingleEntity(dispatch, entity_id)[model_type]
        setIsOpen(false)
    }

    return (
        <FormModal
            methods={methods}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isSubmitting={isSubmitting}
            size='md'
            title='Attach Tag'
            onSubmit={methods.handleSubmit(submitForm)}
            onClose={onClose}
        >
            <CreatableMultiSelectField
                name='tag_ids'
                label='Tags'   
                methods={methods}
                onChange={(value) => {
                    console.log(value)
                }}
                options={tags.map((tag, index) => ({
                    label: capitalizeFirstLetter(tag.name),
                    value: tag.id,
                    key: index
                }))}
                placeholder='Select tag'
            />

            {/* <FormInput
                className='hidden'
                name='model_type'
                value={model_type}
            />

            <FormInput
                className='hidden'
                name='entity_id'
                value={entity_id}
            /> */}

        </FormModal>
    )
}
