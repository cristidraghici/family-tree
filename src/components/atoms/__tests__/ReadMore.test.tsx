import ReadMode from '../ReadMore'
import { render } from '@testing-library/react'

describe('ReadMore', () => {
  it('should render without read more button', () => {
    const { container } = render(<ReadMode maxLength={1000}>Hello there, kind user!</ReadMode>)
    const button = container.querySelector('.ReadMore')
    expect(button).not.toBeInTheDocument()
  })

  it('should render with read more button', () => {
    const { container } = render(<ReadMode maxLength={10}>Hello there, kind user!</ReadMode>)
    const button = container.querySelector('.ReadMore')
    expect(button).toBeInTheDocument()
  })
})
