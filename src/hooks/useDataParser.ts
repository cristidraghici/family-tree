import { useMemo } from 'react'
import PersonUtil from '@/utils/PersonUtil'
import { personSchema } from '@/schemas'

const useDataParser = ({ persons, search }: { persons: string; search: string }) => {
  const result = personSchema.array().safeParse(persons)

  const everybody = useMemo(() => {
    if (result.success === false) {
      return []
    }

    return result.data.map((person) => new PersonUtil(person, result.data))
  }, [result])

  return result.success === true
    ? {
        error: null,
        data: everybody.filter((person) =>
          person.fullName().toLowerCase().includes(search.toLowerCase()),
        ),
      }
    : {
        error: 'Invalid persons data.',
        data: [],
      }
}

export default useDataParser
