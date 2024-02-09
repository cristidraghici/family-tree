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

export type SelectPersonFunction = (person: PersonIdType) => void
