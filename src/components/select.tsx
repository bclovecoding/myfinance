'use client'
import { useMemo } from 'react'
import { SingleValue } from 'react-select'
import CreateableSelect from 'react-select/creatable'

export type SelectOption = {
  label: string
  value: string
}

type Props = {
  value?: string | null | undefined
  onChange: (value?: string) => void
  onCreate?: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

export const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  placeholder = '',
  disabled,
}: Props) => {
  const onSelect = (option: SingleValue<SelectOption>) => {
    onChange(option?.value)
  }
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ':hover': {
            borderColor: '#e2e8f0',
          },
        }),
      }}
      value={formattedValue}
      options={options}
      onChange={onSelect}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}
