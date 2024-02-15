import Logo from '@/components/atoms/Logo'
import ConditionalElement from '@/components/atoms/ConditionalElement'
import Hamburger from '@/components/atoms/Hamburger'

import UploadJSON from '@/components/molecules/UploadJSON'

import usePersonContext from '@/hooks/usePersonContext'
import useToggle from '@/hooks/useToggle'

import downloadTextAsFile from '@/utils/downloadTextAsFile'

const Header = () => {
  const { isDemoData, clearAll, registry } = usePersonContext()
  const [isSidebarOpen, toggleSidebar] = useToggle(false)

  const handleClearData = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    !!clearAll && clearAll()
  }

  const handleDownloadData = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    downloadTextAsFile(JSON.stringify(registry, null, 2), 'family-tree.json')
  }

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
        <fieldset>
          <legend>Manage existing data</legend>
          <p>
            <ConditionalElement as="span" condition={!!isDemoData}>
              You are viewing demo data.{' '}
            </ConditionalElement>
            <a href="#" onClick={handleClearData}>
              Clear the current the data.
            </a>
          </p>

          <p>
            You can manually save your current data to a file by{' '}
            <a href="#" onClick={handleDownloadData}>
              clicking here
            </a>
            .
          </p>
        </fieldset>

        <fieldset>
          <legend>Restore from file</legend>
          <UploadJSON />
        </fieldset>
      </ConditionalElement>
    </header>
  )
}
export default Header
