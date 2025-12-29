import { useState, useCallback, FunctionComponent, PropsWithChildren, useMemo } from 'react'
import useTreeData from '@/hooks/useTreeData'
import { getExtendedPersons } from '@/utils/persons/selectors'
import { NewPersonType, X, Y } from '@/types'
import { PersonContext } from './personContext'

export const PersonContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = useState<string>('')
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const [dragCoordinates, setDragCoordinates] = useState<{ x: X; y: Y } | undefined>()

  const {
    registry,
    error,
    addPerson,
    removePerson,
    updatePositions,
    clearAll,
    isDemoData,
    loadRegistryData,
    saveAll,
  } = useTreeData()

  const extendedPersons = useMemo(
    () => getExtendedPersons(registry.persons, registry.relationships || [], ''),
    [registry.persons, registry.relationships],
  )

  const filteredPersons = useMemo(
    () =>
      search
        ? getExtendedPersons(registry.persons, registry.relationships || [], search)
        : extendedPersons,
    [registry.persons, registry.relationships, search, extendedPersons],
  )

  const selectedPerson = useMemo(() => {
    if (selectedPersonId === 'new') {
      return { id: 'new', ...dragCoordinates } as NewPersonType
    }
    return extendedPersons.find((p) => p.id === selectedPersonId) || null
  }, [extendedPersons, selectedPersonId, dragCoordinates])

  const handleSelectPerson = useCallback((personId: string, coordinates?: { x: X; y: Y }) => {
    setSelectedPersonId(personId || null)
    setDragCoordinates(coordinates)
  }, [])

  const contextValue = useMemo(
    () => ({
      persons: extendedPersons,
      filteredPersons,
      relationships: registry.relationships || [],
      positions: registry.positions || [],
      registry,

      selectedPerson,
      search,
      error,
      isDemoData,

      setSearch,
      handleSelectPerson,
      addPerson,
      removePerson,
      updatePositions,
      loadRegistryData,
      saveAll,
      clearAll,
    }),
    [
      extendedPersons,
      filteredPersons,
      registry,
      selectedPerson,
      search,
      error,
      isDemoData,
      handleSelectPerson,
      addPerson,
      removePerson,
      updatePositions,
      loadRegistryData,
      saveAll,
      clearAll,
    ],
  )

  return <PersonContext.Provider value={contextValue}>{children}</PersonContext.Provider>
}
