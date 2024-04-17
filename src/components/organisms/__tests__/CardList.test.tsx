import { render } from '@testing-library/react'
import CardList from '../CardList'

describe('CardList', () => {
  it('renders correctly', () => {
    const { container } = render(<CardList />)

    expect(container).toMatchSnapshot()
  })
})
