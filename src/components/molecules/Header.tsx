import Logo from '@/components/atoms/Logo'
import ConditionalElement from '@/components/atoms/ConditionalElement'
import Hamburger from '@/components/atoms/Hamburger'

import usePersonContext from '@/hooks/usePersonContext'
import useToggle from '@/hooks/useToggle'

const Header = () => {
  const { isDemoData, clearAll } = usePersonContext()
  const [isSidebarOpen, toggleSidebar] = useToggle(false)

  return (
    <header className="Header">
      <mark className="DataWarning">
        <small>
          <span>Be aware that we currently use your browser's memory to store the data.</span>
        </small>
      </mark>

      <nav className="Nav">
        <Logo />

        <Hamburger isOpen={isSidebarOpen} onClick={() => toggleSidebar()} />
      </nav>

      <ConditionalElement as="div" condition={isSidebarOpen} className="HeaderDetails">
        <ConditionalElement as="span" condition={!!isDemoData}>
          You are viewing demo data.{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              !!clearAll && clearAll()
            }}
          >
            Clear the data.
          </a>
        </ConditionalElement>
      </ConditionalElement>
    </header>
  )
}
export default Header
