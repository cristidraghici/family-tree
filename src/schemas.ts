import { z } from 'zod'

export const personIdSchema = z.union([z.string().uuid(), z.literal('new')])

export const personSchema = z.object({
  id: personIdSchema,

  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be at most 30 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be at most 30 characters'),

  biologicalGender: z.enum(['male', 'female'], {
    message: 'Please select a gender',
  }),

  fatherId: z.string().optional(),
  motherId: z.string().optional(),

  biography: z.string().max(10000, 'Biography must be at most 10000 characters').optional(),
  notes: z.string().max(10000, 'Notes must be at most 10000 characters').optional(),
})

export const relationshipIdSchema = z.string().uuid()

export const relationshipSchema = z.object({
  id: relationshipIdSchema,
  persons: z.array(personIdSchema).min(2).max(2),
  relationshipType: z.enum(['spouse', 'blood']),
})

// TODO: we can't use an unique ID here, because of the implementation of
// the connections boxes which take two IDs as key
export const positionIdSchema = z.string() // .uuid()
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
