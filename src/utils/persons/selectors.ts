import {
  PersonIdType,
  PersonType,
  RelationshipType,
  ExtendedPersonType,
  RelationshipIdType,
} from '@/types'
import getConnections from './getConnections'
import getGenerations from './getGenerations'

export const getFullName = (
  person: PersonType | undefined,
  comparisonPerson?: PersonType,
): string => {
  if (!person) return ''
  const { firstName, lastName } = person
  const { lastName: comparisonLastName } = comparisonPerson || {}

  if (lastName === comparisonLastName && firstName) {
    return firstName
  }

  return [firstName, lastName].filter(Boolean).join(' ')
}

export const getPeopleNames = (
  personIds: PersonIdType[],
  personMap: Record<PersonIdType, PersonType>,
  comparisonPerson?: PersonType,
): string => {
  return personIds
    .map((id) => getFullName(personMap[id], comparisonPerson))
    .filter(Boolean)
    .join(', ')
}

export const getExtendedPersons = (
  persons: PersonType[],
  relationships: RelationshipType[],
  search: string = '',
): ExtendedPersonType[] => {
  const personMap = persons.reduce(
    (acc, person) => {
      acc[person.id] = person
      return acc
    },
    {} as Record<PersonIdType, PersonType>,
  )

  const connections = getConnections(persons, relationships)

  // Augmented spouses for generation calculation
  const spouseRelationships = Object.entries(connections.spouses).reduce<RelationshipType[]>(
    (acc, [personId, spouseIds]) => {
      return [
        ...acc,
        ...spouseIds.map<RelationshipType>((spouseId) => ({
          id: `${personId}-${spouseId}` as RelationshipIdType,
          relationshipType: 'spouse',
          persons: [personId as PersonIdType, spouseId],
        })),
      ]
    },
    [],
  )

  const allRelationships = [...relationships, ...spouseRelationships]
  const generations = getGenerations(persons, allRelationships)

  const extended = persons.map((person) => {
    const pConnections = {
      parents: connections.parents[person.id] || [],
      spouses: connections.spouses[person.id] || [],
      children: connections.children[person.id] || [],
      siblings: connections.siblings[person.id] || [],
      descendants: connections.descendants[person.id] || [],
      ancestors: connections.ancestors[person.id] || [],
    }

    return {
      ...person,
      generation: generations[person.id],
      spouses: pConnections.spouses,
      descendants: pConnections.descendants,
      ancestors: pConnections.ancestors,
      fullName: getFullName(person),
      parentsNames: getPeopleNames(pConnections.parents, personMap, person),
      spousesNames: getPeopleNames(pConnections.spouses, personMap, person),
      childrenNames: getPeopleNames(pConnections.children, personMap, person),
      siblingsNames: getPeopleNames(pConnections.siblings, personMap, person),
    }
  })

  const results = extended.sort((a, b) => {
    if (a.generation !== b.generation) {
      return (a.generation || 0) - (b.generation || 0)
    }
    return a.fullName.localeCompare(b.fullName)
  })

  const normalizedSearch = search.toLowerCase()
  return normalizedSearch
    ? results.filter((p) => p.fullName.toLowerCase().includes(normalizedSearch))
    : results
}
