import { render, screen, renderHook } from '@testing-library/react'
import FormTextarea from '../FormTextarea'
import { useForm } from 'react-hook-form'
import { type PersonType } from '@/types'

describe('FormTextarea', () => {
  const { register: mockRegister } = renderHook(() => useForm<PersonType>()).result.current

  it('renders with error', () => {
    const ERROR = 'This field is required'

    render(<FormTextarea id="biography" label="Biography" error={ERROR} register={mockRegister} />)

    const error = screen.getByText(ERROR)
    expect(error).toBeInTheDocument()
  })

  it('renders without error', () => {
    render(<FormTextarea id="notes" label="Notes" register={mockRegister} />)

    const label = screen.getByText('Notes')
    expect(label).toBeInTheDocument()

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })
})
