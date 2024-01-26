import { useState, useRef, useEffect } from 'react'
import Logo from '@/components/atoms/Logo'

import ConditionalElement from '@/components/atoms/ConditionalElement'

import ToggleView from '@/components/molecules/ToggleView'
import PersonsTable from '@/components/molecules/PersonsTable'
import FamilyTree from '@/components/molecules/FamilyTree'
import CardList from '@/components/molecules/CardList'

import useDataParser from '@/hooks/useDataParser'

import personsJSON from '@/assets/mockedPersons.json'

function App() {
  const [view, setView] = useState<string>('table')

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const { data, error } = useDataParser({
    persons: JSON.parse(JSON.stringify(personsJSON)),
    search,
  })

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  return (
    <>
      <header>
        <nav className="Nav">
          <Logo />
        </nav>
      </header>

      <div className="Spacer" />

      <ConditionalElement condition={!!error} as="main" className="Main container-fluid">
        {error}
      </ConditionalElement>

      <ConditionalElement as="main" condition={!error} className="Main container-fluid">
        <div className="Controls Controls--horizontal">
          <ToggleView
            className="Controls_ToggleView"
            role="group"
            options={[
              {
                id: 'table',
                label: 'Table',
              },
              {
                id: 'cards',
                label: 'Cards',
              },
              {
                id: 'tree',
                label: 'Tree',
              },
            ]}
            view={view}
            setView={setView}
          />

          <input
            className="Search"
            type="search"
            ref={searchRef}
            onChange={(e) => {
              e.preventDefault()
              setSearch(e.target.value)
            }}
          />

          <fieldset className="Controls_AddButton" role="group">
            <button type="button">Add</button>
          </fieldset>
        </div>

        <div className="Spacer" />

        <ConditionalElement condition={view === 'table'} as={PersonsTable} persons={data} />
        <ConditionalElement condition={view === 'cards'} as={CardList} persons={data} />
        <ConditionalElement condition={view === 'tree'} as={FamilyTree} />
      </ConditionalElement>
    </>
  )
}

export default App
