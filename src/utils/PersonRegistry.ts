import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { personSchema, personIdSchema } from '@/schemas'

export type PersonIdType = z.infer<typeof personIdSchema>
export type PersonType = z.infer<typeof personSchema>

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
  private everybody: PersonType[]

  // Constructor takes a  list of all people
  constructor(everybody: PersonType[]) {
    this.everybody = everybody
  }

  // Public method to get the next ID
  public getNextId(): PersonIdType {
    let id: PersonIdType

    do {
      id = uuid()
    } while (this.everybody.find((person) => person.id === id))

    return id
  }

  // Public method to get all people
  public getAll(): ExtendedPersonType[] {
    const everybody = this.everybody || ([] as ExtendedPersonType[])
    return everybody
      .map<ExtendedPersonType>((person) => ({
        ...person,

        fullName: this.fullName(person.id),
        parentsNames: this.parents(person.id)
          .map((personId) => this.fullName(personId))
          .filter(Boolean)
          .join(', '),
        spousesNames: this.spouses(person.id)
          .map((personId) => this.fullName(personId))
          .filter(Boolean)
          .join(', '),
        childrenNames: this.children(person.id)
          .map((personId) => this.fullName(personId))
          .filter(Boolean)
          .join(', '),
        siblingsNames: this.siblings(person.id)
          .map((personId) => this.fullName(personId))
          .filter(Boolean)
          .join(', '),

        spouses: this.spouses(person.id),
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  }

  // Get all the persons in the raw format
  public getAllRaw(): PersonType[] {
    return this.everybody
  }

  // Private method to get a person by their ID
  private getById(personId?: PersonIdType): PersonType | undefined {
    if (!personId || !this.everybody) {
      return undefined
    }

    return this.everybody.find((person) => person.id === personId)
  }

  // Public method to get the full name
  private fullName(personId: PersonIdType): string {
    const { firstName, lastName } = this.getById(personId) || {}

    return [firstName, lastName].filter(Boolean).join(' ').trim()
  }

  // Public method to get the parents
  private parents(personId: PersonIdType): PersonIdType[] {
    const { fatherId, motherId } = this.getById(personId) || {}

    return [this.getById(fatherId), this.getById(motherId)]
      .filter((person): person is PersonType => person !== undefined)
      .map((person) => person.id) as PersonIdType[]
  }

  // Public method to get the siblings
  private siblings(personId: PersonIdType): PersonIdType[] {
    const { fatherId, motherId } = this.getById(personId) || {}
    const siblings = this.everybody
      .filter(
        (person) =>
          person.id !== personId &&
          ((fatherId && person.fatherId === fatherId) ||
            (motherId && person.motherId === motherId)),
      )
      .map((person) => person.id) as PersonIdType[]

    return [...new Set(siblings)] || []
  }

  // Public method to get the spouses
  private spouses(personId: PersonIdType): PersonIdType[] {
    const spouses = this.everybody
      .map((child) => {
        if (
          [child.fatherId, child.motherId].includes(personId) &&
          !!child.fatherId &&
          !!child.motherId
        ) {
          const spouseId = child.fatherId === personId ? child.motherId : child.fatherId
          return this.everybody?.find((person) => person.id === spouseId)
        }

        return false
      })
      .filter((person): person is PersonType => person !== undefined)
      .map((person) => person.id) as PersonIdType[]

    return [...new Set(spouses)] || []
  }

  // Public method to get the children
  private children(personId: PersonIdType): PersonIdType[] {
    const children = this.everybody
      .filter((person) => [person.fatherId, person.motherId].includes(personId))
      .map((person) => person.id) as PersonIdType[]

    return children || []
  }
}

export default PersonRegistry
