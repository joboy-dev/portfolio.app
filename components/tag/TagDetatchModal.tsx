import React from 'react'
import ConfirmationModal from '../shared/modal/ConfirmationModal'
import { refetchSingleEntity } from '@/lib/utils/refetch'
import { tagService } from '@/lib/redux/slices/tag/tag.service'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'

export default function TagDetatchModal({
    isOpen, setIsOpen,
    model_type, entity_id
}: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    model_type: string
    entity_id: string
}) {
    const dispatch = useAppDispatch()
    const {selectedTag, isSubmitting} = useAppSelector((state) => state.tag)

    const submitForm = async () => {
        if (selectedTag) {
            await tagService.detatchTagsFromEntity({
                payload: {
                    tag_ids: [selectedTag?.id],
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
            title='Detatch Tag'
            content='Are you sure you want to detatch this tag from this entity? Once this is done, it cannot be reversed'
            onConfirm={submitForm}
            onClose={() => setIsOpen(false)}
        />
  )
}
