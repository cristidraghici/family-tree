import { useRef, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import Condition from '@/components/atoms/ConditionalElement'

import Header from '@/components/organisms/Header'
import CardsPage from '@/pages/CardsPage'
import GraphPage from '@/pages/GraphPage'
import PersonsModal from '@/components/organisms/PersonsModal'

import usePersonContext from '@/hooks/usePersonContext'

import debounce from '@/utils/debounce'
import ToggleButtons from './components/atoms/ToggleButtons'

const App = () => {
  const { error, handleSelectPerson, setSearch } = usePersonContext()

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  const handleSetSearch = debounce((text) => {
    setSearch(text)
  }, 100)

  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = location.pathname === '/graph' ? 'tree' : 'cards'

  const handleViewChange = (view: string) => {
    navigate(view === 'tree' ? '/graph' : '/')
  }

  return (
    <>
      <Header />
      <main className="Main">
        <Condition condition={!!error} as="section" className="Main container-fluid">
          {error}
        </Condition>

        <Condition as="section" condition={!error} className="Main container-fluid">
          <div className="Controls Controls--horizontal">
            <ToggleButtons
              className="Controls_ToggleView"
              role="group"
              options={[
                { id: 'cards', label: 'Cards' },
                { id: 'tree', label: 'Graph' },
              ]}
              value={currentPage}
              setValue={handleViewChange}
            />

            <input
              className="Search"
              type="search"
              aria-label="Search persons"
              ref={searchRef}
              onChange={(e) => {
                e.preventDefault()
                handleSetSearch(e.target.value)
              }}
            />

            <fieldset className="Controls_AddButton" role="group">
              <button type="button" onClick={() => handleSelectPerson('new')}>
                Add
              </button>
            </fieldset>
          </div>

          <div className="Spacer" />

          <Routes>
            <Route path="/" element={<CardsPage />} />
            <Route path="/graph" element={<GraphPage />} />
          </Routes>

          <PersonsModal />
        </Condition>
      </main>
    </>
  )
}

export default App
