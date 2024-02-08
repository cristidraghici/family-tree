import { useEffect, useState, useMemo } from 'react'
import { registrySchema } from '@/schemas'
import PersonRegistry, {
  PersonType,
  PersonIdType,
  RelationshipType,
  RegistryType,
} from '@/utils/PersonRegistry'
import { getTreeStorage, setTreeStorage } from '@/utils/helpers/treeStorageUtil'
import registryJSON from '@/data/registry.json'

const usePersonsRegistry = ({ search }: { search: string }) => {
  const [persons, setPersons] = useState<PersonType[]>([])
  const [relationships, setRelationships] = useState<RelationshipType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeRegistry = () => {
      const localStorageRegistryJSON = getTreeStorage()

      if (localStorageRegistryJSON === null) {
        const registry = JSON.parse(JSON.stringify(registryJSON)) as RegistryType
        setPersons(registry.persons)
        setRelationships(registry?.relationships || [])
        setError(null)
      } else if (localStorageRegistryJSON === false) {
        setPersons([])
        setRelationships([])
        setError('Invalid data.')
      } else {
        const result = registrySchema.safeParse(localStorageRegistryJSON)
        if (result.success === true) {
          setPersons(result.data.persons)
          setRelationships(result.data?.relationships || [])
          setError(null)
        } else {
          if (import.meta.env.DEV) {
            console.error(result.error)
          }
          setPersons([])
          setRelationships([])
          setError('Invalid data.')
        }
      }
    }

    initializeRegistry()
  }, [])

  // TODO: use a different approach to handle the registry, maybe a context?
  const registry = useMemo(
    () => new PersonRegistry(persons, relationships),
    [persons, relationships],
  )

  const addPerson = (person: PersonType) => {
    const id = person.id === 'new' ? registry.getNextId() : person.id
    const newPersons = [...persons.filter((p) => p.id !== person.id), { ...person, id }]

    setPersons(newPersons)
    setTreeStorage({ persons: newPersons, relationships })
  }

  const removePerson = (personId: PersonIdType) => {
    const newPersons = persons.filter((person) => person.id !== personId)
    const newRelationships = relationships.filter((relationship) =>
      relationship.persons.includes(personId),
    )

    setPersons(newPersons)
    setRelationships(newRelationships)
    setTreeStorage({ persons: newPersons, relationships: newRelationships })
  }

  const clearAll = () => {
    setPersons([])
    setRelationships([])
    setTreeStorage({ persons: [], relationships: [] })
  }

  const isDemoData = JSON.stringify(persons.sort()) === JSON.stringify(registryJSON.persons.sort())

  return {
    everybody: registry.getAll(),
    filteredPersons: registry
      .getAll()
      .filter((person) => person.fullName.toLowerCase().includes(search.toLowerCase())),
    relationships: registry.getRelationships(),
    error,
    addPerson,
    removePerson,
    clearAll,
    isDemoData,
  }
}

export default usePersonsRegistry
