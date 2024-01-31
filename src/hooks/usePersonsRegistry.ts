import { useEffect, useState, useMemo } from 'react'
import { personSchema } from '@/schemas'
import PersonRegistry, { PersonType, PersonIdType } from '@/utils/PersonRegistry'

import { getTreeStorage, setTreeStorage } from '@/utils/helpers/treeStorageUtil'

import personsJSON from '@/data/persons.json'

const usePersonsRegistry = ({ search }: { search: string }) => {
  const [persons, setPersons] = useState<PersonType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const persons = getTreeStorage()

    if (persons === null) {
      // Load some demo data
      setPersons(JSON.parse(JSON.stringify(personsJSON)) as PersonType[])
      setError(null)
      return
    }

    const result = personSchema.array().safeParse(persons)

    if (result.success === true) {
      setPersons(result.data)
      setError(null)
    }

    if (result.success === false) {
      if (import.meta.env.DEV) {
        console.error(result.error)
      }

      setPersons([])
      setError('Invalid persons data.')
    }
  }, [])

  const registry = useMemo(() => {
    return new PersonRegistry(persons)
  }, [persons])

  return {
    everybody: registry.getAll(),
    filteredPersons: registry
      .getAll()
      .filter((person) => person.fullName.toLowerCase().includes(search.toLowerCase())),
    error,

    // Add the person to the registry
    addPerson: (person: PersonType) => {
      const id = person.id === 'new' ? registry.getNextId() : person.id

      const newPersons = [...persons.filter((p) => p.id !== person.id), { ...person, id }]

      setPersons(newPersons)
      setTreeStorage(newPersons)
    },

    // Remove the person from the registry
    removePerson: (personId: PersonIdType) => {
      const newPersons = persons.filter((person) => person.id !== personId)

      setPersons(newPersons)
      setTreeStorage(newPersons)
    },

    clearAll: () => {
      setPersons([])
      setTreeStorage([])
    },

    isDemoData: JSON.stringify(persons.sort()) === JSON.stringify(personsJSON.sort()),
  }
}

export default usePersonsRegistry
