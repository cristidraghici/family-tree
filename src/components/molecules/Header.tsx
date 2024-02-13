import Logo from '@/components/atoms/Logo'
import ConditionalElement from '@/components/atoms/ConditionalElement'

import usePersonContext from '@/hooks/usePersonContext'

const Header = () => {
  const { isDemoData, clearAll } = usePersonContext()

  return (
    <header>
      <mark className="DataWarning">
        <small>
          <ConditionalElement as="span" condition={!!isDemoData}>
            You are viewing demo data.
          </ConditionalElement>
          <span>Be aware that we currently use your browser's memory to store the data.</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              !!clearAll && clearAll()
            }}
          >
            Clear the data.
          </a>
        </small>
      </mark>

      <nav className="Nav">
        <Logo />
      </nav>
    </header>
  )
}
export default Header
