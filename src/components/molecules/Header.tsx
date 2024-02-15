import Logo from '@/components/atoms/Logo'
import ConditionalElement from '@/components/atoms/ConditionalElement'
import Hamburger from '@/components/atoms/Hamburger'

import usePersonContext from '@/hooks/usePersonContext'
import useToggle from '@/hooks/useToggle'

import downloadTextAsFile from '@/utils/downloadTextAsFile'

const Header = () => {
  const { isDemoData, clearAll, registry } = usePersonContext()
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
        <ConditionalElement as="p" condition={!!isDemoData}>
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

        <p>
          You can manually save your current data to a file by{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              downloadTextAsFile(JSON.stringify(registry, null, 2), 'family-tree.json')
            }}
          >
            clicking here
          </a>
          .
        </p>
      </ConditionalElement>
    </header>
  )
}
export default Header
