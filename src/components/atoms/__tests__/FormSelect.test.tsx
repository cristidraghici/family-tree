import { render, screen, renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'

import FormSelect from '../FormSelect'
import type { PersonType } from '@/types'

describe('FormSelect', () => {
  const { register: mockRegister } = renderHook(() => useForm<PersonType>()).result.current
  const options = [
    { value: 'man', label: 'Man' },
    { value: 'woman', label: 'Woman' },
  ]

  it('renders with error', () => {
    const ERROR = 'Gender is required'

    render(
      <FormSelect
        id="biologicalGender"
        label="Gender"
        options={options}
        register={mockRegister}
        error={ERROR}
      />,
    )

    const error = screen.getByText(ERROR)
    expect(error).toBeInTheDocument()
  })

  it('renders label and select without error', () => {
    render(
      <FormSelect id="biologicalGender" label="Gender" options={options} register={mockRegister} />,
    )

    const label = screen.getByText('Gender')
    expect(label).toBeInTheDocument()

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()

    options.forEach((option) => {
      const optionElement = screen.getByText(option.label)
      expect(optionElement).toBeInTheDocument()
    })
  })
})
