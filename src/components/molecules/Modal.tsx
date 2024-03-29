import { ReactNode, FunctionComponent, ComponentProps, useRef, useEffect } from 'react'
import ConditionalElement from '@/components/atoms/ConditionalElement'

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

  useEffect(() => {
    if (!onEscape) {
      return
    }

    const overlayElement = modalRef.current

    if (!overlayElement) {
      return
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape()
      }
    }

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleEscapeKey)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onEscape])

  return (
    <dialog className={`Modal ${className}`} open={isOpen} ref={modalRef}>
      <article {...props}>
        <ConditionalElement condition={!!header} as="header">
          {header}
        </ConditionalElement>
        {children}
        <ConditionalElement condition={!!footer} as="footer">
          {footer}
        </ConditionalElement>
      </article>
    </dialog>
  )
}

export default Modal
