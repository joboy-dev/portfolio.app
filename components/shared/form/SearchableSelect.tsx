import React from "react"
import Select from "react-select"
import { Controller } from "react-hook-form"
import type { Option } from "@/lib/interfaces/general"
import { getSelectClassNames } from "./reactSelectClassNames"


interface SearchableSelectFieldProps {
  label?: string
  onChange?: (value: Option | null) => void
  options: Option[]
  className?: string
  placeholder?: string
  name: string
  control?: any
  disabled?: boolean
  defaultValue?: string
  isLoading?: boolean
  onMenuScrollToBottom?: () => void
}

const SearchableSelectField: React.FC<SearchableSelectFieldProps> = ({
  label,
  name,
  control,
  disabled=false,
  options,
  defaultValue,
  onChange,
  className = "",
  placeholder = "Select an option",
  isLoading = false,
  onMenuScrollToBottom,
}) => {
  return (
    <div className={`w-full space-y-1 mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <Controller
        name={name}
        control={control}
        disabled={disabled}
        render={({field, fieldState}) => (
            <div>
                <Select
                  value={options.find(option => option.value === field.value) || null}
                  onChange={(option) => {
                    field.onChange(option?.value)
                    if (onChange) {
                      onChange(option)
                    }
                  }}
                  // inputValue={defaultValue}
                  defaultInputValue={defaultValue}
                  options={options}
                  placeholder={placeholder}
                  isSearchable
                  isLoading={isLoading}
                  onMenuScrollToBottom={onMenuScrollToBottom}
                  unstyled
                  classNames={getSelectClassNames(!!fieldState.error)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error?.message}</p>}
            </div>
        )}
      />
    </div>
  )
}

export default SearchableSelectField
