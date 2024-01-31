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
