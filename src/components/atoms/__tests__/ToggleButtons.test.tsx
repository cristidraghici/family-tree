import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ToggleButtons from '../ToggleButtons'

describe('ToggleButtons', () => {
  const setValue = vi.fn()
  const options = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
  ]

  it('renders buttons and handles click', () => {
    render(<ToggleButtons options={options} value="1" setValue={setValue} />)

    options.forEach((option) => {
      const button = screen.getByText(option.label)
      expect(button).toBeInTheDocument()
    })

    const button = screen.getByText('Option 2')
    fireEvent.click(button)

    expect(setValue).toHaveBeenCalledTimes(1)
  })
})
