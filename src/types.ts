import { z } from 'zod'

import { personSchema, personIdSchema } from './schemas'
import PersonUtil from './utils/PersonUtil'

export type PersonIdType = z.infer<typeof personIdSchema>
export type PersonType = z.infer<typeof personSchema>

export type PersonUtilType = InstanceType<typeof PersonUtil>
