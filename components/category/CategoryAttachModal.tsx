import React, { useEffect } from 'react'
import FormModal from '../shared/modal/FormModal'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/redux/store'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { AttachOrDetatchCategorySchema, type AttachOrDetatchCategoryFormData } from '@/lib/validators/category'
import CreatableMultiSelectField from '../shared/form/CreatableMultiSelect'
import { capitalizeFirstLetter } from '@/lib/utils/string'
import { getCategories } from '@/lib/redux/slices/category/category'
import { categoryService } from '@/lib/redux/slices/category/category.service'
import { useAppDispatch } from '@/lib/hooks/redux'
import { refetchSingleEntity } from '@/lib/utils/refetch'

export default function CategoryAttachModal({
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
    const {categories, isSubmitting} = useSelector((state: RootState) => state.category)
    const methods = useZodForm<AttachOrDetatchCategoryFormData>(AttachOrDetatchCategorySchema, {
        entity_id,
        model_type,
    })

    useEffect(() => {
        dispatch(getCategories({
            model_type: model_type,
        }))
    }, [dispatch, model_type])

    const submitForm = async(data: AttachOrDetatchCategoryFormData) => {
        console.log(data)
        await categoryService.attachCategoriesToEntity({
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
            title='Attach Category'
            onSubmit={methods.handleSubmit(submitForm)}
            onClose={() => {
                if (onClose) {
                    onClose()
                }
                setIsOpen(false)
            }}
        >
            <CreatableMultiSelectField
                name='category_ids'
                label='Categories'
                methods={methods}
                options={categories.map((category, index) => ({
                    label: capitalizeFirstLetter(category.name),
                    value: category.id,
                    key: index
                }))}
                placeholder='Select category'
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
