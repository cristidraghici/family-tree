import { useState, useRef, useEffect } from 'react'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import ToggleButtons from '@/components/molecules/ToggleButtons'

import Header from '@/components/organisms/Header'
import FamilyTree from '@/components/organisms/FamilyTree'
import CardList from '@/components/organisms/CardList'
import PersonsModal from '@/components/organisms/PersonsModal'

import usePersonContext from '@/hooks/usePersonContext'

import debounce from '@/utils/debounce'

const App = () => {
  const [view, setView] = useState<string>('cards')
  const { error, handleSelectPerson, setSearch } = usePersonContext()

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  const toggleOptions = [
    { id: 'cards', label: 'Cards' },
    { id: 'tree', label: 'Graph' },
  ]

  const handleSetSearch = debounce((text) => {
    setSearch(text)
  }, 100)

  return (
    <>
      <Header />
      <main className="Main">
        <ConditionalElement condition={!!error} as="main" className="Main container-fluid">
          {error}
        </ConditionalElement>

        <ConditionalElement as="main" condition={!error} className="Main container-fluid">
          <div className="Controls Controls--horizontal">
            <ToggleButtons
              className="Controls_ToggleView"
              role="group"
              options={toggleOptions}
              value={view}
              setValue={setView}
            />

            <input
              className="Search"
              type="search"
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

          <ConditionalElement condition={view === 'cards'} as={CardList} />
          <ConditionalElement condition={view === 'tree'} as={FamilyTree} />

          <PersonsModal />
        </ConditionalElement>
      </main>
    </>
  )
}

export default App
