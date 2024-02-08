import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import {
  personSchema,
  personIdSchema,
  relationshipSchema,
  relationshipIdSchema,
  registrySchema,
} from '@/schemas'

export type PersonIdType = z.infer<typeof personIdSchema>
export type PersonType = z.infer<typeof personSchema>
export type RelationshipIdType = z.infer<typeof relationshipIdSchema>
export type RelationshipType = z.infer<typeof relationshipSchema>
export type RegistryType = z.infer<typeof registrySchema>

export type NewPersonType = {
  id: PersonIdType
}

export type ExtendedPersonType = PersonType & {
  generation?: number
  spouses: PersonIdType[]

  fullName: string
  parentsNames: string
  spousesNames: string
  childrenNames: string
  siblingsNames: string
}

export type GenerationsType = Record<number, ExtendedPersonType[]>

export type SelectPersonFunction = (person: PersonIdType) => void

class PersonRegistry {
  private everybodyRaw: PersonType[] = []
  private everybody: Record<PersonIdType, PersonType> = {}
  private relationships: RelationshipType[]
  private generations: Record<PersonIdType, number> = {}

  private parents: Record<PersonIdType, PersonIdType[]> = {}
  private spouses: Record<PersonIdType, PersonIdType[]> = {}
  private children: Record<PersonIdType, PersonIdType[]> = {}
  private siblings: Record<PersonIdType, PersonIdType[]> = {}

  // Constructor takes a  list of all people and an optional list of relationships
  constructor(everybody: PersonType[], relationships: RelationshipType[] = []) {
    this.everybodyRaw = everybody
    this.relationships = relationships

    this.initPeople()
    this.initRelationships()
    this.initGenerations()
  }

  private initPeople(): void {
    for (const person of this.everybodyRaw) {
      this.everybody[person.id] = person
    }
  }

  private initRelationships(): void {
    const isPerson = (id: PersonIdType | undefined): id is PersonIdType => id !== undefined
    const everybody = Object.values(this.everybody)

    for (const person of everybody) {
      // Initialize the relationships
      this.parents[person.id] = [person.fatherId, person.motherId].filter(isPerson)
      this.spouses[person.id] = []
      this.children[person.id] = []
      this.siblings[person.id] = []

      // Loop through all the people to find the relationships
      for (const p of everybody) {
        // Skip if the person is the same or if the person is already a parent
        if ([person.id, ...this.parents[person.id]].includes(p.id)) {
          continue
        }

        const hasBothParents = isPerson(p.fatherId) && isPerson(p.motherId)
        const isFather = p.fatherId === person.id
        const isMother = p.motherId === person.id

        if (isFather || isMother) {
          this.children[person.id].push(p.id)

          if (hasBothParents) {
            const spouseId = isFather ? p.motherId : p.fatherId
            this.spouses[person.id].push(spouseId as PersonIdType)
          }
        }

        const isSibling =
          (isPerson(p.fatherId) && p.fatherId === person.fatherId) ||
          (isPerson(p.motherId) && p.motherId === person.motherId)

        if (isSibling) {
          this.siblings[person.id].push(p.id)
        }
      }

      // Remove duplicates
      this.parents[person.id] = [...new Set(this.parents[person.id])]
      this.spouses[person.id] = [...new Set(this.spouses[person.id])]
      this.children[person.id] = [...new Set(this.children[person.id])]
      this.siblings[person.id] = [...new Set(this.siblings[person.id])]
    }
  }

  // Assign generation to persons
  private initGenerations() {
    const persons = this.getAll()
    const relationships = this.getRelationships()
    type PersonWithGeneration = PersonType & { generation: number }

    const personsWithGeneration: PersonWithGeneration[] = persons.map((person) => ({
      ...person,
      generation: 0,
    }))

    const calculatePersonGeneration = (person: PersonWithGeneration): number => {
      if (!person.fatherId && !person.motherId) {
        return 1
      }

      const fatherGeneration = person.fatherId
        ? calculatePersonGeneration(
            personsWithGeneration.find((p) => p.id === person.fatherId) as PersonWithGeneration,
          )
        : 0

      const motherGeneration = person.motherId
        ? calculatePersonGeneration(
            personsWithGeneration.find((p) => p.id === person.motherId) as PersonWithGeneration,
          )
        : 0

      return Math.max(fatherGeneration, motherGeneration) + 1
    }

    personsWithGeneration.forEach((person) => {
      person.generation = calculatePersonGeneration(person)
    })

    // if there is a spouse relationship, the spouse should have the same generation as the person
    relationships.forEach((relationship) => {
      const firstPerson = personsWithGeneration.find((p) => p.id === relationship.persons[0])
      const secondPerson = personsWithGeneration.find((p) => p.id === relationship.persons[1])

      if (!firstPerson || !secondPerson) {
        return
      }

      if (firstPerson.generation > secondPerson.generation) {
        secondPerson.generation = firstPerson.generation
      } else {
        firstPerson.generation = secondPerson.generation
      }
    })

    personsWithGeneration.forEach((person) => {
      this.generations[person.id] = person.generation
    })
  }

  // Private method to get a person by their ID
  private getById(personId?: PersonIdType): PersonType | undefined {
    return personId ? this.everybody[personId] : undefined
  }

  // Public method to get the full name or only the first name
  // of a person if the last name is the same as that of the comparison person
  private fullName(personId: PersonIdType, comparisonPersonId?: PersonIdType): string {
    const { firstName, lastName } = this.getById(personId) || {}
    const { lastName: comparisonLastName } = this.getById(comparisonPersonId) || {}

    // Return only the first name if the last name is the same
    if (lastName === comparisonLastName) {
      return firstName || ''
    }

    return [firstName, lastName].join(' ').trim()
  }

  private getPeopleNames(personIds: PersonIdType[], comparisonPersonId?: PersonIdType): string {
    return personIds.map((personId) => this.fullName(personId, comparisonPersonId)).join(', ')
  }

  // Public method to get the next ID
  public getNextId(): PersonIdType {
    let id: PersonIdType

    do {
      id = uuid()
    } while (this.everybody[id])

    return id
  }

  // Public method to get all people
  public getAll(): ExtendedPersonType[] {
    const everybody = Object.values(this.everybody) || ([] as ExtendedPersonType[])
    return everybody
      .map<ExtendedPersonType>((person) => ({
        ...person,

        generation: this.generations[person.id],
        spouses: this.spouses[person.id],

        fullName: this.fullName(person.id),
        parentsNames: this.getPeopleNames(this.parents[person.id], person.id),
        spousesNames: this.getPeopleNames(this.spouses[person.id], person.id),
        childrenNames: this.getPeopleNames(this.children[person.id], person.id),
        siblingsNames: this.getPeopleNames(this.siblings[person.id], person.id),
      }))
      .sort(
        (a, b) =>
          (a.generation && b.generation && a.generation - b.generation) ||
          a.fullName.localeCompare(b.fullName),
      )
  }

  // Get the list of relationships between persons
  public getRelationships(): RelationshipType[] {
    const spouses = Object.entries(this.spouses).reduce<RelationshipType[]>(
      (acc, [personId, spouseIds]) => {
        const person = this.getById(personId)

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
    )

    return [...spouses, ...this.relationships].sort()
  }

  // Get the persons grouped by generation
  public personsGroupedByGeneration(): GenerationsType {
    return Object.entries(this.generations).reduce((acc, [personId, generation]) => {
      acc[generation] = acc[generation] || []
      acc[generation].push(this.getById(personId) as ExtendedPersonType)
      return acc
    }, {} as GenerationsType)
  }
}

export default PersonRegistry
