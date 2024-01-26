import { z } from 'zod'
import { personSchema, relationSchema } from './schemas'

export type PersonType = z.infer<typeof personSchema>
export type RelationSchema = z.infer<typeof relationSchema>

export type PersonWithRelationsType = PersonType & {
  relations: Omit<RelationSchema, 'personId'>[]
}
