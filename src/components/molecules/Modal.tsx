import { ReactNode, FunctionComponent, ComponentProps, useRef } from 'react'
import Condition from '@/components/atoms/ConditionalElement'

import useKeyPress from '@/hooks/useKeyPress'
import useOutsideClick from '@/hooks/useOutsideClick'

const Modal: FunctionComponent<
  ComponentProps<'dialog'> & {
    header?: ReactNode
    footer?: ReactNode
    isOpen: boolean

    onEscape?: () => void

    children: ReactNode
  }
> = ({ header, footer, className = '', isOpen, onEscape, children, ...props }) => {
  const modalRef = useRef<HTMLDialogElement>(null)

  useKeyPress(['Escape'], () => {
    if (onEscape && isOpen) {
      onEscape()
    }
  })

  useOutsideClick(modalRef, () => {
    if (onEscape && isOpen) {
      onEscape()
    }
  })

  return (
    <dialog className={`Modal ${className}`} open={isOpen}>
      <article {...props} ref={modalRef}>
        <Condition condition={!!header} as="header">
          {header}
        </Condition>
        {children}
        <Condition condition={!!footer} as="footer">
          {footer}
        </Condition>
      </article>
    </dialog>
  )
}

export default Modal
