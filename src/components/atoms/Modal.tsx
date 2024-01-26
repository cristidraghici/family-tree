import { FunctionComponent, PropsWithChildren, ComponentProps } from 'react'

const Modal: FunctionComponent<PropsWithChildren<ComponentProps<'dialog'>>> = ({ children }) => {
  return (
    <dialog open>
      <article>{children}</article>
    </dialog>
  )
}

export default Modal
