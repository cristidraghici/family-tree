import React, { ComponentProps } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { PersonType, ValidPersonProps } from '@/types'

type FormSelectProps = ComponentProps<'select'> & {
  id: ValidPersonProps
  label: string
  error?: string
  options: {
    value: string
    label: string
  }[]
  register: UseFormRegister<PersonType>
}

const FormSelect: React.FC<FormSelectProps> = ({
  className,
  id,
  label,
  error,
  options,
  register,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...register(id, {
          setValueAs: (value) => {
            if (value === '') {
              return undefined
            }

            return value
          },
        })}
        aria-invalid={error ? 'true' : undefined}
      >
        <option></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <small>{error}</small>}
    </div>
  )
}

export default FormSelect
