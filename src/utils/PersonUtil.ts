import { PersonType, PersonIdType } from '@/types'

class PersonUtil {
  private person: PersonType
  private everybody?: PersonType[]

  // Constructor takes a person and an optional list of all people
  constructor(person: PersonType, everybody?: PersonType[]) {
    this.person = person
    this.everybody = everybody
  }

  // Private method to get a person by their ID
  private getPerson(personId?: PersonIdType): PersonType | undefined {
    if (!personId || !this.everybody) {
      return undefined
    }

    return this.everybody.find((person) => person.id === personId)
  }

  // Public method to get the current person
  public get(): PersonType {
    return this.person
  }

  // Public method to get the full name of a person
  // If no ID is provided, it returns the full name of the current person
  public fullName(personId?: PersonIdType): string {
    const person = personId ? this.getPerson(personId) : this.person
    const { firstName, middleName, lastName } = person || {}

    return [firstName, middleName, lastName].filter(Boolean).join(' ').trim()
  }

  // Public method to get the full name of the father of the current person
  public fatherFullName(): string | null {
    const { fatherId } = this.person
    return fatherId ? this.fullName(fatherId) : null
  }

  // Public method to get the full name of the mother of the current person
  public motherFullName(): string | null {
    const { motherId } = this.person
    return motherId ? this.fullName(motherId) : null
  }
}

export default PersonUtil
