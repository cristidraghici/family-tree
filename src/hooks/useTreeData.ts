import { useState, useEffect, useCallback, useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { RegistryType, PersonType, PositionsType, PersonIdType, X, Y } from '@/types'
import { registrySchema } from '@/schemas'
import { getTreeStorage, setTreeStorage, hasTreeStorage } from '@/utils/treeStorageUtil'
import registryJSON from '@/data/registry.json'
import devLog from '@/utils/devLog'
import isDemoData from '@/utils/isDemoData'

const EMPTY_REGISTRY: RegistryType = {
  persons: [],
  relationships: [],
  positions: [],
}

const useTreeData = () => {
  const [registry, setRegistry] = useState<RegistryType>(EMPTY_REGISTRY)
  const [error, setError] = useState<string | null>(null)

  // Initialize data from storage or demo
  useEffect(() => {
    try {
      let data: unknown
      if (!hasTreeStorage()) {
        data = registryJSON
      } else {
        const stored = getTreeStorage()
        data = stored !== null ? stored : EMPTY_REGISTRY
      }

      const result = registrySchema.safeParse(data)
      if (result.success) {
        setRegistry(result.data as RegistryType)
      } else {
        devLog(result.error, 'error')
        setError('Invalid data format.')
      }
    } catch (err) {
      devLog(err, 'error')
      setError('Failed to load data.')
    }
  }, [])

  const saveRegistry = useCallback((newRegistry: RegistryType) => {
    setRegistry(newRegistry)
    setTreeStorage(newRegistry)
  }, [])

  const addPerson = useCallback(
    (person: PersonType, coordinates?: { x: X; y: Y }) => {
      setRegistry((prev) => {
        const id = person.id === 'new' ? uuid() : person.id
        const newPersons = [...prev.persons.filter((p) => p.id !== person.id), { ...person, id }]

        let newPositions = prev.positions || []
        if (coordinates) {
          newPositions = [...newPositions.filter((p) => p.id !== id), { id, ...coordinates }]
        }

        const next = { ...prev, persons: newPersons, positions: newPositions }
        setTreeStorage(next)
        return next
      })
    },
    [setRegistry],
  )

  const removePerson = useCallback(
    (personId: PersonIdType) => {
      setRegistry((prev) => {
        const newPersons = prev.persons
          .filter((p) => p.id !== personId)
          .map((p) => ({
            ...p,
            fatherId: p.fatherId === personId ? '' : p.fatherId,
            motherId: p.motherId === personId ? '' : p.motherId,
          }))

        const newRelationships = (prev.relationships || []).filter(
          (r) => !r.persons.includes(personId),
        )

        const newPositions = (prev.positions || []).filter((p) => p.id !== personId)

        const next = {
          ...prev,
          persons: newPersons,
          relationships: newRelationships,
          positions: newPositions,
        }
        setTreeStorage(next)
        return next
      })
    },
    [setRegistry],
  )

  const updatePositions = useCallback(
    (newPositions: PositionsType[]) => {
      setRegistry((prev) => {
        const next = { ...prev, positions: newPositions }
        setTreeStorage(next)
        return next
      })
    },
    [setRegistry],
  )

  const clearAll = useCallback(() => {
    saveRegistry(EMPTY_REGISTRY)
  }, [saveRegistry])

  const demoDataStatus = useMemo(
    () => isDemoData(registry.persons, registry.relationships || []),
    [registry.persons, registry.relationships],
  )

  return {
    registry,
    error,
    addPerson,
    removePerson,
    updatePositions,
    clearAll,
    isDemoData: demoDataStatus,
    loadRegistryData: saveRegistry,
    saveAll: saveRegistry, // Aliased for backward compatibility
  }
}

export default useTreeData
