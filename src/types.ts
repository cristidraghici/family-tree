import { z } from 'zod'
import {
  personSchema,
  personIdSchema,
  relationshipSchema,
  relationshipIdSchema,
  registrySchema,
  positionIdSchema,
  xSchema,
  ySchema,
  positionsSchema,
} from '@/schemas'

export type PersonIdType = z.infer<typeof personIdSchema>
export type PersonType = z.infer<typeof personSchema>
export type RelationshipIdType = z.infer<typeof relationshipIdSchema>
export type RelationshipType = z.infer<typeof relationshipSchema>
export type RegistryType = z.infer<typeof registrySchema>
export type PositionIdType = z.infer<typeof positionIdSchema>
export type X = z.infer<typeof xSchema>
export type Y = z.infer<typeof ySchema>
export type PositionsType = z.infer<typeof positionsSchema>

export type NewPersonType = {
  id: PersonIdType
}

export type ExtendedPersonType = PersonType & {
  generation?: number
  spouses: PersonIdType[]
  descendants: PersonIdType[]
  ancestors: PersonIdType[]

  fullName: string
  parentsNames: string
  spousesNames: string
  childrenNames: string
  siblingsNames: string
}

export type ValidPersonProps = keyof PersonType

export type SelectPersonFunction = (person: PersonIdType) => void
