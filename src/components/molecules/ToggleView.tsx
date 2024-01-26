import { FunctionComponent, ComponentProps } from 'react'

const ToggleView: FunctionComponent<
  ComponentProps<'fieldset'> & {
    options: {
      id: string
      label: string
    }[]
    view: string
    setView: (view: string) => void
  }
> = ({ options, view, setView, ...rest }) => {
  return (
    <fieldset {...rest}>
      {options.map((option) => (
        <button
          key={option.id}
          className={view === option.id ? 'outline' : ''}
          onClick={() => {
            setView(option.id)
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
export default ToggleView
