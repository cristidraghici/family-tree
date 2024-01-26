import { useState, useRef, useEffect } from 'react'
import Logo from '@/components/atoms/Logo'

import ConditionalElement from '@/components/atoms/ConditionalElement'

import ToggleView from '@/components/molecules/ToggleView'
import PersonsTable from '@/components/molecules/PersonsTable'
import FamilyTree from '@/components/molecules/FamilyTree'
import CardList from '@/components/molecules/CardList'

import useDataParser from '@/hooks/useDataParser'

import personsJSON from '@/assets/mockedPersons.json'
import relationsJSON from '@/assets/mockedRelations.json'

function App() {
  const [view, setView] = useState<string>('table')

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const { data, error } = useDataParser({
    persons: JSON.parse(JSON.stringify(personsJSON)),
    relations: JSON.parse(JSON.stringify(relationsJSON)),
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
                id: 'tree',
                label: 'Tree',
              },
              {
                id: 'cards',
                label: 'Cards',
              },
            ]}
            view={view}
            setView={setView}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSearch(searchRef.current?.value || '')
            }}
          >
            <fieldset role="group">
              <input className="Search" type="text" ref={searchRef} />
              <input type="submit" value="Search" />
            </fieldset>
          </form>

          <fieldset className="Controls_AddButton" role="group">
            <button type="button">Add</button>
          </fieldset>
        </div>

        <div className="Spacer" />

        <ConditionalElement condition={view === 'table'} as={PersonsTable} persons={data} />
        <ConditionalElement condition={view === 'tree'} as={FamilyTree} />
        <ConditionalElement condition={view === 'cards'} as={CardList} />
      </ConditionalElement>
    </>
  )
}

export default App
