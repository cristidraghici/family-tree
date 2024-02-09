import { useState, useEffect, useMemo, useCallback } from 'react'
import { v4 as uuid } from 'uuid'

import { setTreeStorage } from '@/utils/helpers/treeStorageUtil'
import getConnections from '@/utils/persons/getConnections'
import getGenerations from '@/utils/persons/getGenerations'

import isDemoData from '@/utils/isDemoData'

import {
  PersonType,
  PersonIdType,
  RelationshipType,
  RelationshipIdType,
  ExtendedPersonType,
} from '@/types'

interface PersonsRegistryProps {
  persons: PersonType[]
  relationships?: RelationshipType[]
  search?: string
}

const usePersonRegistry = ({
  persons: rawPersons,
  relationships: rawRelationships = [],
  search = '',
}: PersonsRegistryProps) => {
  const [persons, setPersons] = useState<PersonType[]>([])
  const [relationships, setRelationships] = useState<RelationshipType[]>([])

  useEffect(() => {
    setPersons(rawPersons || [])
    setRelationships(rawRelationships || [])
  }, [rawPersons, rawRelationships])

  const getNextId = (): PersonIdType => {
    let id: PersonIdType

    do {
      id = uuid()
    } while (persons.some((person) => person.id === id))

    return id
  }

  const getById = useCallback(
    (id?: PersonIdType): PersonType | undefined => {
      return id ? persons.find((person) => person.id === id) : undefined
    },
    [persons],
  )

  const connections = useMemo(() => {
    return getConnections(persons, relationships)
  }, [persons, relationships])

  const generations = useMemo(() => {
    const spouses =
      Object.entries(connections.spouses).reduce<RelationshipType[]>(
        (acc, [personId, spouseIds]) => {
          const person = getById(personId)

          if (!person) {
            return acc
          }

          return [
            ...acc,
            ...spouseIds.map<RelationshipType>((spouseId) => ({
              id: `${personId}-${spouseId}` as RelationshipIdType,
              relationshipType: 'spouse',
              persons: [personId, spouseId],
            })),
          ]
        },
        [],
      ) || []

    const allRelationships = [...relationships, ...spouses]

    return getGenerations(persons, allRelationships)
  }, [persons, connections, relationships, getById])

  const extendedPersons: ExtendedPersonType[] = useMemo(() => {
    const fullName = (personId: PersonIdType, comparisonPersonId?: PersonIdType): string => {
      const { firstName, lastName } = getById(personId) || {}
      const { lastName: comparisonLastName } = getById(comparisonPersonId) || {}

      // Return only the first name if the last name is the same
      if (lastName === comparisonLastName) {
        return firstName || ''
      }

      return [firstName, lastName].join(' ').trim()
    }

    const getPeopleNames = (
      personIds: PersonIdType[],
      comparisonPersonId?: PersonIdType,
    ): string => {
      return personIds.map((personId) => fullName(personId, comparisonPersonId)).join(', ')
    }

    return persons
      .map<ExtendedPersonType>((person) => ({
        ...person,

        generation: generations[person.id],
        spouses: connections.spouses[person.id],

        fullName: fullName(person.id),
        parentsNames: getPeopleNames(connections.parents[person.id], person.id),
        spousesNames: getPeopleNames(connections.spouses[person.id], person.id),
        childrenNames: getPeopleNames(connections.children[person.id], person.id),
        siblingsNames: getPeopleNames(connections.siblings[person.id], person.id),
      }))
      .sort(
        (a, b) =>
          (a.generation && b.generation && a.generation - b.generation) ||
          a.fullName.localeCompare(b.fullName),
      )
  }, [persons, generations, connections, getById])

  const addPerson = (person: PersonType) => {
    const id = person.id === 'new' ? getNextId() : person.id
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

  return {
    persons: extendedPersons,
    filteredPersons: extendedPersons.filter((person) =>
      person.fullName.toLowerCase().includes(search.toLowerCase()),
    ),

    addPerson,
    removePerson,
    clearAll,

    getNextId,

    isDemoData: isDemoData(persons, relationships),
  }
}

export default usePersonRegistry
