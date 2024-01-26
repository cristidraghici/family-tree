import React, { ElementType } from 'react'

// Define a type that includes both HTML elements and custom React components
type AsElementType = keyof HTMLElementTagNameMap | ElementType

// Define the base properties for the ConditionalElement component
type ConditionalElementBaseProps<T extends AsElementType> = {
  as: T
  condition?: boolean
}

// Extend the base properties with the properties of the specified element type
type ConditionalElementProps<T extends AsElementType> = ConditionalElementBaseProps<T> &
  React.ComponentPropsWithoutRef<T>

// Define the ConditionalElement component
const ConditionalElement = <T extends AsElementType>({
  as,
  children,
  condition = true,
  ...props
}: ConditionalElementProps<T>) => {
  if (condition === false) {
    return null
  }

  // Create the specified element type with the given properties and children
  return React.createElement(as, props as React.ComponentPropsWithoutRef<T>, children)
}

export default ConditionalElement
