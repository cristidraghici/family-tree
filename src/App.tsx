import { useState, useRef, useEffect } from 'react'

import Logo from '@/components/atoms/Logo'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import ToggleView from '@/components/molecules/ToggleView'
import FamilyTree from '@/components/molecules/FamilyTree'
import CardList from '@/components/organisms/CardList'
import PersonsModal from '@/components/organisms/PersonsModal'

import useDataParser from '@/hooks/useDataParser'

import { PersonType } from '@/utils/PersonRegistryUtil'

import personsJSON from '@/assets/mockedPersons.json'

const App = () => {
  const [view, setView] = useState<string>('cards')
  const [selectedPerson, setSelectedPerson] = useState<Partial<PersonType> | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const { filteredPersons, everybody, error } = useDataParser({
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
            <button
              type="button"
              onClick={() =>
                setSelectedPerson({
                  id: 'new',
                })
              }
            >
              Add
            </button>
          </fieldset>
        </div>

        <div className="Spacer" />

        <ConditionalElement
          condition={view === 'cards'}
          as={CardList}
          persons={filteredPersons}
          onEdit={setSelectedPerson}
        />
        <ConditionalElement condition={view === 'tree'} as={FamilyTree} persons={filteredPersons} />

        {selectedPerson && (
          <PersonsModal
            person={selectedPerson}
            everybody={everybody}
            onCancel={() => {
              setSelectedPerson(null)
            }}
            onSuccess={(data) => {
              console.log('success', { ...data, id: crypto.randomUUID() })
              setSelectedPerson(null)
            }}
          />
        )}
      </ConditionalElement>
    </>
  )
}

export default App
