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
  fullName: string
  parentsNames: string
  spousesNames: string
  childrenNames: string
  siblingsNames: string

  spouses: PersonIdType[]
}

export type SelectPersonFunction = (person: PersonIdType) => void

class PersonRegistry {
  private everybodyRaw: PersonType[] = []
  private everybody: Record<PersonIdType, PersonType> = {}
  private relationships: RelationshipType[]

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

        fullName: this.fullName(person.id),
        parentsNames: this.getPeopleNames(this.parents[person.id], person.id),
        spousesNames: this.getPeopleNames(this.spouses[person.id], person.id),
        childrenNames: this.getPeopleNames(this.children[person.id], person.id),
        siblingsNames: this.getPeopleNames(this.siblings[person.id], person.id),

        spouses: this.spouses[person.id],
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  }

  // Get the list of relationships between persons
  public getRelationships(): RelationshipType[] {
    return this.relationships.sort()
  }
}

export default PersonRegistry
