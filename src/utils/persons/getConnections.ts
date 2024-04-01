import { PersonIdType, PersonType, RelationshipType } from '@/types'

type ConnectionType = Record<PersonIdType, Set<PersonIdType>>

const getConnections = (persons: PersonType[], relationships: RelationshipType[]) => {
  const parents: ConnectionType = {}
  const spouses: ConnectionType = {}
  const children: ConnectionType = {}
  const siblings: ConnectionType = {}
  const descendants: ConnectionType = {}
  const ancestors: ConnectionType = {}

  const findDescendants = (
    personId: PersonIdType,
    descendantsList: Set<PersonIdType> = new Set(),
  ): Set<PersonIdType> => {
    const directChildren = children[personId] || new Set()

    directChildren.forEach((childId) => {
      descendantsList.add(childId)
      findDescendants(childId, descendantsList)
    })

    return descendantsList
  }

  const findAncestors = (
    personId: PersonIdType,
    ancestorsList: Set<PersonIdType> = new Set(),
  ): Set<PersonIdType> => {
    const directParents = parents[personId] || new Set()

    directParents.forEach((parentId) => {
      ancestorsList.add(parentId)
      findAncestors(parentId, ancestorsList)
    })

    return ancestorsList
  }

  const isPerson = (id: PersonIdType | undefined): id is PersonIdType => !!id && id !== undefined

  persons.forEach((person) => {
    parents[person.id] = new Set([person.fatherId, person.motherId].filter(isPerson))
    spouses[person.id] = new Set()
    children[person.id] = new Set()
    siblings[person.id] = new Set()
    descendants[person.id] = new Set()
    ancestors[person.id] = new Set()

    persons.forEach((p) => {
      if ([person.id, ...parents[person.id]].includes(p.id)) {
        return
      }

      const hasBothParents = isPerson(p.fatherId) && isPerson(p.motherId)
      const isFather = p.fatherId === person.id
      const isMother = p.motherId === person.id

      if (isFather || isMother) {
        children[person.id].add(p.id)

        if (hasBothParents) {
          const spouseId = isFather ? p.motherId : p.fatherId
          spouses[person.id].add(spouseId as PersonIdType)
        }
      }

      const isSibling =
        (isPerson(p.fatherId) && p.fatherId === person.fatherId) ||
        (isPerson(p.motherId) && p.motherId === person.motherId)

      if (isSibling) {
        siblings[person.id].add(p.id)
      }
    })

    relationships.forEach((relationship) => {
      const [firstPersonId, secondPersonId] = relationship.persons

      if ([firstPersonId, secondPersonId].includes(person.id) === false) {
        return
      }

      const otherPersonId = firstPersonId === person.id ? secondPersonId : firstPersonId

      // only add spouses
      if (relationship.relationshipType === 'spouse') {
        spouses[person.id].add(otherPersonId)
      }
    })

    descendants[person.id] = findDescendants(person.id)
    ancestors[person.id] = findAncestors(person.id)
  })

  const connections = Object.entries({
    parents,
    spouses,
    children,
    siblings,
    descendants,
    ancestors,
  }).reduce(
    (acc, [key, value]) => {
      acc[key] = Object.entries(value).reduce(
        (result, [personId, connection]) => {
          result[personId] = Array.from(connection)
          return result
        },
        {} as Record<PersonIdType, PersonIdType[]>,
      )
      return acc
    },
    {} as Record<string, Record<PersonIdType, PersonIdType[]>>,
  )

  return connections
}

export default getConnections
