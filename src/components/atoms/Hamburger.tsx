import { FunctionComponent, ComponentProps } from 'react'

interface HamburgerProps extends ComponentProps<'div'> {
  isOpen?: boolean
}

const Hamburger: FunctionComponent<HamburgerProps> = ({ isOpen = false, ...rest }) => {
  return (
    <div className={`Hamburger ${isOpen ? 'Hamburger--open' : 'Hamburger--closed'}`} {...rest}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Hamburger
