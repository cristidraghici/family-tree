import { useState, useRef, useEffect, useCallback } from 'react'

import Header from '@/components/molecules/Header'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import ToggleButtons from '@/components/molecules/ToggleButtons'
import FamilyTree from '@/components/organisms/FamilyTree'
import CardList from '@/components/organisms/CardList'
import PersonsModal from '@/components/organisms/PersonsModal'

import useGetRegistryData from '@/hooks/useGetRegistryData'
import usePersonsRegistry from '@/hooks/usePersonsRegistry'

import { PersonType, NewPersonType } from '@/types'

const App = () => {
  const [view, setView] = useState<string>('cards')
  const [selectedPerson, setSelectedPerson] = useState<PersonType | NewPersonType | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const { registryData, error } = useGetRegistryData()

  const { persons, filteredPersons, addPerson, removePerson, clearAll, isDemoData } =
    usePersonsRegistry({
      persons: registryData?.persons || [],
      relationships: registryData?.relationships || [],
      search,
    })

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  const handleSelectPerson = useCallback(
    (personId: string) => {
      const person = persons.find((person) => person.id === personId)
      if (person) {
        setSelectedPerson(person)
      }
    },
    [persons, setSelectedPerson],
  )

  return (
    <>
      <Header onClearAll={clearAll} isDemoData={isDemoData} />

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
          onClick={handleSelectPerson}
        />
        <ConditionalElement
          condition={view === 'tree'}
          as={FamilyTree}
          persons={filteredPersons}
          onDblClick={handleSelectPerson}
        />

        {selectedPerson && (
          <PersonsModal
            person={selectedPerson}
            everybody={persons}
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
