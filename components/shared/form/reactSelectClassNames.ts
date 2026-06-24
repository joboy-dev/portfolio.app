export function getSelectClassNames(hasError?: boolean) {
  return {
    control: () =>
      `min-h-[40px] !bg-background !rounded-lg px-2 ${hasError ? '!border-red-500' : '!border-border'} border`,
    valueContainer: () => 'gap-1',
    input: () => 'text-foreground',
    placeholder: () => 'text-muted-foreground',
    singleValue: () => 'text-foreground',
    multiValue: () => 'bg-secondary rounded-md pl-2 pr-1 gap-1 my-0.5',
    multiValueLabel: () => 'text-foreground text-sm',
    multiValueRemove: () => 'text-muted-foreground hover:text-destructive hover:bg-transparent rounded',
    indicatorSeparator: () => 'bg-border',
    dropdownIndicator: () => 'text-muted-foreground px-2',
    clearIndicator: () => 'text-muted-foreground px-2',
    loadingIndicator: () => 'text-muted-foreground',
    menu: () => '!bg-background !border !border-border rounded-lg shadow-lg mt-1 overflow-hidden z-50',
    menuList: () => 'py-1',
    noOptionsMessage: () => 'text-muted-foreground text-sm p-3',
    option: ({ isSelected, isFocused }: { isSelected: boolean, isFocused: boolean }) =>
      `px-3 py-2 text-sm cursor-pointer ${
        isSelected
          ? '!bg-primary !text-primary-foreground'
          : isFocused
            ? '!bg-secondary !text-foreground'
            : '!bg-background !text-foreground'
      }`,
  }
}
