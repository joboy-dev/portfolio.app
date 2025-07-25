"use client"

import Loading from "@/app/loading";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getProfile, updateProfile } from "@/lib/redux/slices/profile/profile";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { useZodForm } from "@/lib/hooks/useZodForm";
import { ProfileFormData, profileSchema } from "@/lib/validators/profile";
import FormWrapper from "@/components/shared/form/Form";
import FormSection from "@/components/shared/form/FormSection";
import FormInput from "@/components/shared/form/FormInput";
import PhoneInput from "@/components/shared/form/PhoneInput";
import TextAreaInput from "@/components/shared/form/TextAreaInput";
import SelectLocationFields from "@/components/shared/form/SelectLocationFields";
import CreatableMultiSelectField from "@/components/shared/form/CreatableMultiSelect";
import { objectToFormData } from "@/lib/utils/objectToFormData";
import FormFileUpload from "@/components/shared/form/FormFileUpload";
import Avatar from "@/components/shared/Avatar";

export default function ProfilePage() {
    const dispatch = useAppDispatch()
    const { profile, isLoading } = useAppSelector((state: RootState) => state.profile)

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    const methods = useZodForm<ProfileFormData>(profileSchema)

    useEffect(() => {
        if (profile) {
            methods.reset(profile)
        }
    }, [profile])

    const onSave = (data: ProfileFormData) => {
        console.log(data)
        const formData = objectToFormData(data)
        dispatch(updateProfile(formData))
    }

    return isLoading ? <Loading /> : (
        <div>
            <Breadcrumb title="Profile Settings" subtitle="Manage your personal information and portfolio details" />

            <FormWrapper
                methods={methods}
                onSubmit={methods.handleSubmit(onSave)}
                submitLabel="Save Changes"
                isSubmitting={isLoading}
                submittingLabel="Saving"
                buttonVariant="primary"
                buttonWidth={45}
                className="shadow-none"
            >
                <FormSection
                    title="Profile Image" 
                    description="Upload a professional photo for your portfolio"
                >
                    <Avatar
                        src={profile?.image_url}
                        name={profile?.first_name}
                        size="xl"
                        className="mb-10"
                    />
                    <FormFileUpload
                        label="Profile Image"
                        name="file"
                        multiple={false}
                        accept="image/*"
                    />
                </FormSection>

                <FormSection 
                    title="Basic Information" 
                    description="Your personal details and contact information"
                >
                    <div className="grid max-md:grid-cols-1 grid-cols-2 gap-2">
                        <FormInput
                            label="First Name"
                            name="first_name"
                            placeholder="Enter your first name"
                        />
                        <FormInput
                            label="Last Name"
                            name="last_name"
                            placeholder="Enter your last name"
                        />
                    </div>
                    <FormInput
                        label="Email"
                        name="email"
                        placeholder="Enter your email"
                    />
                    <FormInput
                        label="Professional Ttile"
                        name="title"
                        placeholder="Enter professional title"
                    />
                    <PhoneInput
                        label="Phone number"
                        control={methods.control}
                        phoneName="phone_number"
                    />
                </FormSection>

                <FormSection
                    title="Location"
                    description="Your current location and address"
                >
                    <SelectLocationFields
                        control={methods.control}
                        showCountryField
                        showStateField
                        showCityField
                        defaultCountry={profile?.country}
                        defaultState={profile?.state}
                        defaultCity={profile?.city}
                    />
                    
                    <TextAreaInput
                        label="Full Address"
                        name="address"
                        placeholder="Enter your address"
                    />
                </FormSection>

                <FormSection
                    title="Bio & About"
                    description="Tell visitors about yourself and your expertise"
                >
                    <TextAreaInput
                        label="Short Bio"
                        name="short_bio"
                        placeholder="Enter your short bio"
                    />
                    <TextAreaInput
                        label="About"
                        name="about"
                        placeholder="Enter your about"
                    />
                </FormSection>

                <FormSection
                    title="Interests & Hobbies"
                    description="Share your professional interests and personal hobbies"
                >
                    <CreatableMultiSelectField
                        methods={methods}
                        name="interests"
                        label="Professional Interests"
                        placeholder="Enter your interests"
                        options={[]}
                        defaultValue={profile?.interests?.map((interest) => ({
                            label: interest,
                            value: interest,
                            key: interest.length,
                        }))}
                    />
                    <CreatableMultiSelectField
                        methods={methods}
                        name="hobbies"
                        label="Hobbies"
                        placeholder="Enter your hobbies"
                        options={[]}
                        defaultValue={profile?.hobbies?.map((hobby) => ({
                            label: hobby,
                            value: hobby,
                            key: hobby.length,
                        }))}
                    />
                </FormSection>

                <FormSection
                    title="Social Links & URLs"
                    description="Connect your social media profiles and important links"
                >
                    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        <FormInput
                            label="Resume URL"
                            name="resume_url"
                            placeholder="Enter your resume URL"
                        />
                        <FormInput
                            label="GitHub URL"
                            name="github_url"
                            placeholder="Enter your GitHub profile URL"
                        />
                        <FormInput
                            label="LinkedIn URL"
                            name="linkedin_url"
                            placeholder="Enter your LinkedIn profile URL"
                        />
                        <FormInput
                            label="Twitter URL"
                            name="twitter_url"
                            placeholder="Enter your Twitter profile URL"
                        />
                        <FormInput
                            label="Facebook URL"
                            name="facebook_url"
                            placeholder="Enter your Facebook profile URL"
                        />
                        <FormInput
                            label="Instagram URL"
                            name="instagram_url"
                            placeholder="Enter your Instagram profile URL"
                        />
                        <FormInput
                            label="YouTube URL"
                            name="youtube_url"
                            placeholder="Enter your YouTube channel URL"
                        />
                        <FormInput
                            label="TikTok URL"
                            name="tiktok_url"
                            placeholder="Enter your TikTok profile URL"
                        />
                        <FormInput
                            label="WhatsApp URL"
                            name="whatsapp_url"
                            placeholder="Enter your WhatsApp link"
                        />
                        <FormInput
                            label="Website URL"
                            name="website_url"
                            placeholder="Enter your website URL"
                        />
                    </div>
                </FormSection>
            </FormWrapper>
        </div>
    )
}
