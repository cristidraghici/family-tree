import React, { ComponentProps, useState } from 'react'
import Condition from '@/components/atoms/ConditionalElement'

type TextWithConfirmedActionProps = ComponentProps<'p'> & {
  onConfirm: () => void
}

const TextWithConfirmedAction: React.FC<TextWithConfirmedActionProps> = ({
  onConfirm,
  children,
  ...props
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)

  const handleOpenConfirmation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setIsDeleteConfirmationOpen(true)
  }

  const handleCloseConfirmation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setIsDeleteConfirmationOpen(false)
  }

  const handleConfirm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    onConfirm()
  }

  return (
    <div {...props}>
      <Condition condition={!isDeleteConfirmationOpen}>
        <a href="#" onClick={handleOpenConfirmation}>
          {children}
        </a>
      </Condition>
      <Condition condition={isDeleteConfirmationOpen}>
        Are you sure?
        <div className="DeleteConfirmation_Actions">
          <a href="#" onClick={handleConfirm}>
            Yes
          </a>
          <a href="#" onClick={handleCloseConfirmation}>
            No
          </a>
        </div>
      </Condition>
    </div>
  )
}

export default TextWithConfirmedAction
