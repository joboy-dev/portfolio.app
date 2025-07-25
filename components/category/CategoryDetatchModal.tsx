import React from 'react'
import ConfirmationModal from '../shared/modal/ConfirmationModal'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/redux/store'
import { refetchSingleEntity } from '@/lib/utils/refetch'
import { categoryService } from '@/lib/redux/slices/category/category.service'
import { useAppDispatch } from '@/lib/hooks/redux'

export default function CategoryDetatchModal({
    isOpen, setIsOpen,
    model_type, entity_id
}: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    model_type: string
    entity_id: string
}) {
    const dispatch = useAppDispatch()
    const {selectedCategory, isSubmitting} = useSelector((state: RootState) => state.category)

    const submitForm = async () => {
        if (selectedCategory) {
            await categoryService.detatchCategoriesFromEntity({
                payload: {
                    category_ids: [selectedCategory?.id],
                    entity_id: entity_id,
                    model_type: model_type
                }
            })
        }
        refetchSingleEntity(dispatch, entity_id)[model_type]
        setIsOpen(false)
    }

    return (
        <ConfirmationModal
            isOpen={isOpen}
            isLoading={isSubmitting}
            title='Detatch Category'
            content='Are you sure you want to detatch this category from this entity? Once this is done, it cannot be reversed'
            onConfirm={submitForm}
            onClose={() => setIsOpen(false)}
        />
  )
}
