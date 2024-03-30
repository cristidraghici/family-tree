import React, { ComponentProps } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { PersonType, ValidPersonProps } from '@/types'

type FormTextareaProps = ComponentProps<'textarea'> & {
  id: ValidPersonProps
  label: string
  note?: string
  error?: string
  register: UseFormRegister<PersonType>
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  className,
  id,
  label,
  note,
  error,
  register,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <textarea
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
      {note && <small>{note}</small>}
    </div>
  )
}

export default FormTextarea
