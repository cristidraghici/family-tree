import { PersonIdType, PersonType, RelationshipType } from '@/types'

type ConnectionType = Record<PersonIdType, PersonIdType[]>

const getConnections = (persons: PersonType[], relationships: RelationshipType[]) => {
  const parents: ConnectionType = {}
  const spouses: ConnectionType = {}
  const children: ConnectionType = {}
  const siblings: ConnectionType = {}
  const descendants: ConnectionType = {}
  const ancestors: ConnectionType = {}

  const isPerson = (id: PersonIdType | undefined): id is PersonIdType => id !== undefined
  const findDescendants = (personId: PersonIdType): PersonIdType[] => {
    let allDescendants: PersonIdType[] = []

    const directChildren = children[personId] || []

    for (const childId of directChildren) {
      allDescendants.push(childId)

      // Recursively find descendants of the current child
      const childDescendants = findDescendants(childId)
      allDescendants = allDescendants.concat(childDescendants)
    }

    return allDescendants
  }

  const findAncestors = (personId: PersonIdType): PersonIdType[] => {
    let allAncestors: PersonIdType[] = []

    const directParents = parents[personId] || []

    for (const parentId of directParents) {
      allAncestors.push(parentId)

      // Recursively find ancestors of the current parent
      const parentAncestors = findAncestors(parentId)
      allAncestors = allAncestors.concat(parentAncestors)
    }

    return allAncestors
  }

  for (const person of persons) {
    parents[person.id] = [person.fatherId, person.motherId].filter(isPerson)
    spouses[person.id] = []
    children[person.id] = []
    siblings[person.id] = []
    descendants[person.id] = []
    ancestors[person.id] = []

    for (const p of persons) {
      if ([person.id, ...parents[person.id]].includes(p.id)) {
        continue
      }

      const hasBothParents = isPerson(p.fatherId) && isPerson(p.motherId)
      const isFather = p.fatherId === person.id
      const isMother = p.motherId === person.id

      if (isFather || isMother) {
        children[person.id].push(p.id)

        if (hasBothParents) {
          const spouseId = isFather ? p.motherId : p.fatherId
          spouses[person.id].push(spouseId as PersonIdType)
        }
      }

      const isSibling =
        (isPerson(p.fatherId) && p.fatherId === person.fatherId) ||
        (isPerson(p.motherId) && p.motherId === person.motherId)

      if (isSibling) {
        siblings[person.id].push(p.id)
      }
    }

    for (const relationship of relationships) {
      const [firstPersonId, secondPersonId] = relationship.persons

      if ([firstPersonId, secondPersonId].includes(person.id) === false) {
        continue
      }

      const otherPersonId = firstPersonId === person.id ? secondPersonId : firstPersonId

      // only add spouses
      if (relationship.relationshipType === 'spouse') {
        spouses[person.id].push(otherPersonId)
      }
    }

    parents[person.id] = [...new Set(parents[person.id])]
    spouses[person.id] = [...new Set(spouses[person.id])]
    children[person.id] = [...new Set(children[person.id])]
    siblings[person.id] = [...new Set(siblings[person.id])]
    descendants[person.id] = [...new Set(findDescendants(person.id))]
    ancestors[person.id] = [...new Set(findAncestors(person.id))]
  }

  return {
    parents,
    spouses,
    children,
    siblings,
    descendants,
    ancestors,
  }
}

export default getConnections
