import { MessageBaseFormData, messageBaseSchema } from '@/lib/validators/message'
import { useZodForm } from '@/lib/hooks/useZodForm'
import React, { SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { createMessage } from '@/lib/redux/slices/message/message'
import FormModal from '../shared/modal/FormModal'
import FormInput from '../shared/form/FormInput'
import PhoneInput from '../shared/form/PhoneInput'
import TextAreaInput from '../shared/form/TextAreaInput'
import { Dispatch } from 'react'

export default function ContactForm({
    isOpen, setIsOpen,
    title, subtitle,
}: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    title: string
    subtitle: string
}) {
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector(state => state.message)
    const createMethods = useZodForm<MessageBaseFormData>(messageBaseSchema)

    const onSubmit = (data: MessageBaseFormData) => {
        console.log(data)
        dispatch(createMessage(data))
        createMethods.reset()
        setIsOpen(false)
    }
    return (
        <FormModal
            methods={createMethods}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={createMethods.handleSubmit(onSubmit)}
            title={title}
            subtitle={subtitle}
            isSubmitting={isLoading}
        >
            <FormInput
                name="name"
                label="Name"
                placeholder="Enter the name of the person"
            />

            <FormInput
                name="email"
                label="Email"
                placeholder="Enter the email of the person"
            />

            <PhoneInput
                control={createMethods.control}
                phoneName="phone_number"
                label="Phone Number"
            />

            <FormInput
                name="location"
                label="Location"
                placeholder="Enter the location of the person"
            />

            <TextAreaInput
                name="message"
                label="Message"
                placeholder="Enter the message of the person"
            />
        </FormModal>
    )
}
