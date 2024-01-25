import { z } from 'zod'
import { personSchema } from './schemas'

export type PersonType = z.infer<typeof personSchema>
