import Logo from '../Logo'
import { render } from '@testing-library/react'

describe('Logo', () => {
  it('renders the logo', () => {
    const { container } = render(<Logo />)

    const logo = container.querySelector('.Logo')
    expect(logo).toBeInTheDocument()
  })
})
