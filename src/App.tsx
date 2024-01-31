import { useState, useRef, useEffect } from 'react'

import Logo from '@/components/atoms/Logo'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import ToggleButtons from '@/components/molecules/ToggleButtons'
import FamilyTree from '@/components/organisms/FamilyTree'
import CardList from '@/components/organisms/CardList'
import PersonsModal from '@/components/organisms/PersonsModal'

import usePersonsRegistry from '@/hooks/usePersonsRegistry'

import { PersonType, NewPersonType } from '@/utils/PersonRegistry'

const App = () => {
  const [view, setView] = useState<string>('cards')
  const [selectedPerson, setSelectedPerson] = useState<PersonType | NewPersonType | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const { filteredPersons, everybody, addPerson, removePerson, clearAll, isDemoData, error } =
    usePersonsRegistry({
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
        <mark className="DataWarning">
          <ConditionalElement condition={isDemoData} as="small">
            You are viewing demo data.
          </ConditionalElement>
          <small>
            Be aware that we currently use your browser's memory to store the data.{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                clearAll()
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

      <div className="Spacer" />

      <ConditionalElement condition={!!error} as="main" className="Main container-fluid">
        {error}
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
        <ConditionalElement
          condition={view === 'tree'}
          as={FamilyTree}
          persons={filteredPersons}
          onEdit={(personId) => {
            const person = everybody.find(({ id }) => id === personId)
            if (person) {
              setSelectedPerson(person)
            }
          }}
        />

        {selectedPerson && (
          <PersonsModal
            person={selectedPerson}
            everybody={everybody}
            onCancel={() => {
              setSelectedPerson(null)
            }}
            onRemove={(id) => {
              setSelectedPerson(null)
              removePerson(id)
            }}
            onSuccess={(data) => {
              addPerson(data)
              setSelectedPerson(null)
            }}
          />
        )}
      </ConditionalElement>
    </>
  )
}

export default App
