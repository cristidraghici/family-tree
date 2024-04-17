import { render } from '@testing-library/react'
import UploadJSON from '../UploadJSON'

describe('UploadJSON', () => {
  it('renders correctly', () => {
    const { container } = render(<UploadJSON />)
    expect(container).toMatchSnapshot()
  })
})
