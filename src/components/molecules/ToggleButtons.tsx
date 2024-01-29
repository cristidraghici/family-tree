import { FunctionComponent, ComponentProps } from 'react'

export type ToggleOption = {
  id: string
  label: string
}

export type ToggleFunction = (view: string) => void

const ToggleButtons: FunctionComponent<
  ComponentProps<'fieldset'> & {
    options: ToggleOption[]
    value: string
    setValue: ToggleFunction
  }
> = ({ options, value, setValue, ...rest }) => {
  return (
    <fieldset {...rest}>
      {options.map((option) => (
        <button
          key={option.id}
          className={value === option.id ? 'outline' : ''}
          onClick={() => {
            setValue(option.id)
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
export default ToggleButtons
