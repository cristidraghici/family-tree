import { useState, useRef, useEffect } from 'react'

import Header from '@/components/molecules/Header'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import ToggleButtons from '@/components/molecules/ToggleButtons'
import FamilyTree from '@/components/organisms/FamilyTree'
import CardList from '@/components/organisms/CardList'
import PersonsModal from '@/components/organisms/PersonsModal'

import usePersonContext from '@/hooks/usePersonContext'

const App = () => {
  const [view, setView] = useState<string>('cards')
  const { clearAll, error, handleSetSearch, handleSelectPerson } = usePersonContext()

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  return (
    <>
      <Header />

      <div className="Spacer" />

      <ConditionalElement condition={!!error} as="main" className="Main container-fluid">
        {error}{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            clearAll()
          }}
        >
          Clear the data.
        </a>
      </ConditionalElement>

      <ConditionalElement as="main" condition={!error} className="Main container-fluid">
        <div className="Controls Controls--horizontal">
          <ToggleButtons
            className="Controls_ToggleView"
            role="group"
            options={[
              {
                id: 'cards',
                label: 'Cards',
              },
              {
                id: 'tree',
                label: 'Graph',
              },
            ]}
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
    </>
  )
}

export default App
