import Logo from '@/components/atoms/Logo'
import ConditionalElement from '@/components/atoms/ConditionalElement'

interface HeaderProps {
  isDemoData?: boolean
  onClearAll?: () => void
}

const Header = ({ isDemoData, onClearAll }: HeaderProps) => {
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
              !!onClearAll && onClearAll()
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
