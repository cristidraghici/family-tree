import { render } from '@testing-library/react'

import ConditionalElement from '../ConditionalElement'

describe('ConditionalElement', () => {
  it('should not render children when condition is false', () => {
    const { queryByText } = render(
      <ConditionalElement condition={false}>
        <div>Test</div>
      </ConditionalElement>,
    )

    expect(queryByText('Test')).not.toBeInTheDocument()
  })

  it('should render children when condition is true', () => {
    const { getByText } = render(
      <ConditionalElement condition={true}>
        <div>Test</div>
      </ConditionalElement>,
    )

    expect(getByText('Test')).toBeInTheDocument()
  })
})
