import z from 'zod'

export const relationSchema = z.object({
  relationType: z.enum(['parent', 'child', 'sibling', 'spouse']),
  personId: z.string(),
  personRelatedToId: z.string(),
})

export const personSchema = z.object({
  id: z.string(),

  firstName: z.string().min(2).max(30),
  middleName: z.string().min(2).max(30).optional(),
  lastName: z.string().min(2).max(30),

  biologicalGender: z.enum(['male', 'female']),

  biography: z.string().min(2).max(1000).optional(),

  details: z
    .object({
      previousName: z.string().min(2).max(30).optional(),

      dateOfBirth: z.string().min(2).max(30).optional(),
      placeOfBirth: z.string().min(2).max(30).optional(),

      dateOfMarriage: z.string().min(2).max(30).optional(),
      placeOfMarriage: z.string().min(2).max(30).optional(),

      dateOfDeath: z.string().min(2).max(30).optional(),
      placeOfDeath: z.string().min(2).max(30).optional(),
      burialPlace: z.string().min(2).max(30).optional(),

      occupation: z.string().min(2).max(30).optional(),

      militaryService: z.string().min(2).max(30).optional(),

      education: z.string().min(2).max(30).optional(),

      residencies: z.string().min(2).max(1000).optional(),
    })
    .optional(),

  sources: z
    .array(
      z.object({
        source: z.string().min(2).max(30),
        details: z.string().min(2).max(1000).optional(),
        dateOfCollection: z.string().min(2).max(30).optional(),
      }),
    )
    .optional(),

  contacts: z
    .array(
      z.object({
        type: z.enum(['email', 'phone', 'address']),
        value: z.string().min(2).max(30),
      }),
    )
    .optional(),
})
