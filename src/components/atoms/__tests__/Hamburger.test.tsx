import { render } from '@testing-library/react'
import { vi } from 'vitest'
import Hamburger from '../Hamburger'

describe('Hamburger', () => {
  const onClick = vi.fn()

  it('renders hamburger button', () => {
    const { container } = render(<Hamburger isOpen={false} onClick={onClick} />)

    const button = container.querySelector('.Hamburger')
    expect(button).toBeInTheDocument()
  })

  it('toggles open state when clicked', () => {
    const { container } = render(<Hamburger isOpen={false} onClick={onClick} />)

    const button = container.querySelector('.Hamburger > div') as HTMLDivElement
    button.click()
    expect(onClick).toHaveBeenCalled()
  })
})
