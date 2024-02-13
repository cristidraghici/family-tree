import { createContext, useState, useCallback, FunctionComponent, PropsWithChildren } from 'react'

import useGetRegistryData from '@/hooks/useGetRegistryData'
import usePersonsRegistry from '@/hooks/usePersonsRegistry'

import debounce from '@/utils/helpers/debounce'

import { PersonType, NewPersonType, PositionsType } from '@/types'

type PersonContextType = ReturnType<typeof usePersonsRegistry> & {
  selectedPerson: PersonType | NewPersonType | null
  handleSelectPerson: (personId: string) => void
  handleSetSearch: (text: string) => void
  error: string | null
  handleUpdatePositions: (data: PositionsType[]) => void
}

const initialContextValues: PersonContextType = {
  persons: [],
  filteredPersons: [],
  positions: [],
  addPerson: () => {},
  removePerson: () => {},
  clearAll: () => {},
  getNextId: () => '',
  updatePositions: () => {},
  isDemoData: false,

  selectedPerson: null,
  handleSelectPerson: () => {},
  handleSetSearch: () => {},
  error: null,
  handleUpdatePositions: () => {},
}

export const PersonContext = createContext<PersonContextType>({ ...initialContextValues })

export const PersonProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = useState<string>('')
  const { registryData, error } = useGetRegistryData()

  const {
    persons,
    filteredPersons,
    addPerson,
    removePerson,
    positions,
    updatePositions,
    clearAll,
    getNextId,
    isDemoData,
  } = usePersonsRegistry({
    persons: registryData?.persons || [],
    relationships: registryData?.relationships || [],
    positions: registryData?.positions || [],
    search,
  })
  const [selectedPerson, setSelectedPerson] = useState<PersonType | NewPersonType | null>(null)

  const handleSelectPerson = useCallback(
    (personId: string) => {
      const person = persons.find((person) => person.id === personId)

      if (person) {
        setSelectedPerson(person)
        return
      }

      if (personId === 'new') {
        setSelectedPerson({
          id: 'new',
        })
        return
      }

      setSelectedPerson(null)
    },
    [persons, setSelectedPerson],
  )

  const handleUpdatePositions = debounce(
    (data) => updatePositions(data as unknown as PositionsType[]),
    100,
  )

  const handleSetSearch = debounce((text) => {
    setSearch(text)
  }, 100)

  return (
    <PersonContext.Provider
      value={{
        persons,
        filteredPersons,
        positions,
        addPerson,
        removePerson,
        clearAll,
        getNextId,
        updatePositions,
        isDemoData,

        selectedPerson,
        handleSelectPerson,
        handleSetSearch,
        error,
        handleUpdatePositions,
      }}
    >
      {children}
    </PersonContext.Provider>
  )
}
