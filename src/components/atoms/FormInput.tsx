import React, { ComponentProps } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { PersonType, ValidPersonProps } from '@/types'

type FormInputProps = ComponentProps<'input'> & {
  id: ValidPersonProps
  label: string
  error?: string
  register: UseFormRegister<PersonType>
}

const FormInput: React.FC<FormInputProps> = ({ className, id, label, type, error, register }) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type || 'text'}
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
      />
      {error && <small>{error}</small>}
    </div>
  )
}

export default FormInput
