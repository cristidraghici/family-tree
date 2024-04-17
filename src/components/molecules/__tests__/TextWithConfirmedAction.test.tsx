import { render } from '@testing-library/react'
import { vi } from 'vitest'
import TextWithConfirmedAction from '../TextWithConfirmedAction'

describe('TextWithConfirmedAction', () => {
  it('renders text with confirmed action', () => {
    const onConfirm = vi.fn()
    const { getByText } = render(
      <TextWithConfirmedAction onConfirm={onConfirm}>Confirm</TextWithConfirmedAction>,
    )

    expect(getByText('Confirm')).toBeInTheDocument()
  })
})
