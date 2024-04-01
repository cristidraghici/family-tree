import React, { useState } from 'react'

interface ReadMoreProps {
  children?: string
  maxLength: number
}

const ReadMore: React.FC<ReadMoreProps> = ({ children, maxLength }) => {
  const [isTruncated, setIsTruncated] = useState(true)

  if (!children) return null

  if (children.length <= maxLength) {
    return <>{children}</>
  }

  const resultString = isTruncated ? `${children.slice(0, maxLength)}...` : children

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsTruncated(!isTruncated)
  }

  return (
    <>
      {resultString}{' '}
      <a className="ReadMore" href="#" onClick={onClick}>
        {isTruncated ? 'Read more' : 'Show less'}
      </a>
    </>
  )
}

export default ReadMore
