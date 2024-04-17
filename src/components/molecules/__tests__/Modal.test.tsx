import { render } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal', () => {
  const Header = <>Header</>
  const Footer = <>Footer</>

  it('renders modal with content', () => {
    const { getByText } = render(
      <Modal isOpen header={Header} footer={Footer}>
        Content
      </Modal>,
    )

    expect(getByText('Header')).toBeInTheDocument()
    expect(getByText('Content')).toBeInTheDocument()
    expect(getByText('Footer')).toBeInTheDocument()
  })
})
