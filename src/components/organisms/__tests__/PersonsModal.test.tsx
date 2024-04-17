import { render } from '@testing-library/react'
import PersonsModal from '../PersonsModal'

describe('PersonsModal', () => {
  it('renders correctly', () => {
    const { container } = render(<PersonsModal />)

    expect(container).toMatchSnapshot()
  })
})
