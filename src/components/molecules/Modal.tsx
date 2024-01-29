import { ReactNode, FunctionComponent, ComponentProps } from 'react'
import ConditionalElement from '@/components/atoms/ConditionalElement'

const Modal: FunctionComponent<
  ComponentProps<'dialog'> & {
    header?: ReactNode
    footer?: ReactNode
    isOpen: boolean

    children: ReactNode
  }
> = ({ header, footer, className, isOpen, children, ...props }) => {
  return (
    <dialog className={`Modal ${className}`} open={isOpen}>
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
