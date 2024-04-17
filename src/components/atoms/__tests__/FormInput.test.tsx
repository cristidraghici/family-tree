import { render, screen, renderHook } from '@testing-library/react'
import FormInput from '../FormInput'
import { useForm } from 'react-hook-form'
import { type PersonType } from '@/types'

describe('FormInput', () => {
  const { register: mockRegister } = renderHook(() => useForm<PersonType>()).result.current

  it('renders with error', () => {
    const ERROR = 'First name is required'

    render(<FormInput id="firstName" label="First name" error={ERROR} register={mockRegister} />)

    const error = screen.getByText(ERROR)
    expect(error).toBeInTheDocument()
  })

  it('renders without error', () => {
    render(<FormInput id="lastName" label="Last name" register={mockRegister} />)

    const label = screen.getByText('Last name')
    expect(label).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })
})
