import { ReactNode, ElementType, ComponentPropsWithoutRef, Fragment, createElement } from 'react'

type AsElementType = keyof HTMLElementTagNameMap | ElementType

type ConditionalElementBaseProps<T extends AsElementType> =
  | ({
      condition: boolean
      as: Exclude<T, typeof Fragment>
    } & ComponentPropsWithoutRef<T>)
  | {
      condition: boolean
      as?: typeof Fragment
      children: ReactNode
    }

const ConditionalElement = <T extends AsElementType>({
  as = Fragment,
  condition,
  children,
  ...props
}: ConditionalElementBaseProps<T>) => {
  if (!condition) {
    return null
  }

  return createElement(as, props, children)
}

export default ConditionalElement
