import {
  createContext,
  useState,
  useCallback,
  FunctionComponent,
  PropsWithChildren,
  useMemo,
} from 'react'

import useGetRegistryData, {
  initialReturnValue as initialUseGetRegistryData,
} from '@/hooks/useGetRegistryData'

import usePersonsRegistry, {
  initialReturnValue as initialUsePersonsRegistry,
} from '@/hooks/usePersonsRegistry'

import { PersonType, NewPersonType } from '@/types'

type PersonContextType = ReturnType<typeof useGetRegistryData> &
  ReturnType<typeof usePersonsRegistry> & {
    selectedPerson: PersonType | NewPersonType | null
    handleSelectPerson: (personId: string) => void
    setSearch: (text: string) => void
    search: string
  }

const initialContextValues: PersonContextType = {
  ...initialUseGetRegistryData,
  ...initialUsePersonsRegistry,

  selectedPerson: null,
  handleSelectPerson: () => {},
  setSearch: () => {},
  search: '',
}

export const PersonContext = createContext<PersonContextType>({ ...initialContextValues })

export const PersonProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = useState<string>('')

  const getRegistryData = useGetRegistryData()

  const personsRegistry = usePersonsRegistry({
    persons: getRegistryData.registryData?.persons || [],
    relationships: getRegistryData.registryData?.relationships || [],
    positions: getRegistryData.registryData?.positions || [],
    search,
  })

  const [selectedPerson, setSelectedPerson] = useState<PersonType | NewPersonType | null>(null)

  const handleSelectPerson = useCallback(
    (personId: string) => {
      if (!personId) {
        setSelectedPerson(null)
        return
      }

      if (personId === 'new') {
        setSelectedPerson({
          id: 'new',
        })
        return
      }

      const person = personsRegistry.persons.find((person) => person.id === personId)

      if (person) {
        setSelectedPerson(person)
        return
      }

      setSelectedPerson(null)
    },
    [personsRegistry.persons],
  )

  const contextValue = useMemo(
    () => ({
      ...getRegistryData,
      ...personsRegistry,

      selectedPerson,
      handleSelectPerson,
      setSearch,
      search,
    }),
    [getRegistryData, personsRegistry, selectedPerson, handleSelectPerson, setSearch, search],
  )

  return <PersonContext.Provider value={contextValue}>{children}</PersonContext.Provider>
}
