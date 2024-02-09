import z from 'zod'

export const personIdSchema = z.string().uuid()

export const personSchema = z.object({
  id: personIdSchema,

  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),

  biologicalGender: z.enum(['male', 'female']),

  fatherId: z.string().optional(), //z.string().uuid().optional(),
  motherId: z.string().optional(), //z.string().uuid().optional(),

  biography: z.string().optional(), //z.string().min(2).max(1000).optional(),
  notes: z.string().optional(), // z.string().min(2).max(1000).optional(),
})

export const relationshipIdSchema = z.string().uuid()

export const relationshipSchema = z.object({
  id: relationshipIdSchema,
  persons: z.array(personIdSchema).min(2).max(2),
  relationshipType: z.enum(['spouse', 'blood']),
})

export const positionIdSchema = z.string().uuid()
export const xSchema = z.number()
export const ySchema = z.number()

export const positionsSchema = z.object({
  id: positionIdSchema,
  x: xSchema,
  y: ySchema,
})

export const registrySchema = z.object({
  persons: z.array(personSchema),
  relationships: z.array(relationshipSchema).optional(),
  positions: z.array(positionsSchema).optional(),
})
