import { ElementType, ComponentPropsWithoutRef, Fragment, createElement } from 'react'

// Define a type that includes both HTML elements and custom React components
type AsElementType = keyof HTMLElementTagNameMap | ElementType

// Define the base properties for the ConditionalElement component
type ConditionalElementBaseProps<T extends AsElementType> = {
  as: T | typeof Fragment
  condition?: boolean
}

// Extend the base properties with the properties of the specified element type
type ConditionalElementProps<T extends AsElementType> = ConditionalElementBaseProps<T> &
  ComponentPropsWithoutRef<T>

// Define the ConditionalElement component
const ConditionalElement = <T extends AsElementType>({
  as = Fragment,
  condition = true,
  children,
  ...props
}: ConditionalElementProps<T>) => {
  if (condition === false) {
    return null
  }

  // Create the specified element type with the given properties and children
  return createElement(as, props, children)
}

export default ConditionalElement
