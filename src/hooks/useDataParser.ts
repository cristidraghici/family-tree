import { useMemo } from 'react'
import { personSchema } from '@/schemas'
import PersonRegistryUtil from '@/utils/PersonRegistryUtil'

const useDataParser = ({ persons, search }: { persons: string; search: string }) => {
  const result = personSchema.array().safeParse(persons)

  const everybody = useMemo(() => {
    if (result.success === false) {
      return []
    }

    const registry = new PersonRegistryUtil(result.data)
    return registry.getAll()
  }, [result])

  return result.success === true
    ? {
        error: null,
        data: everybody.filter((person) =>
          person.fullName.toLowerCase().includes(search.toLowerCase()),
        ),
      }
    : {
        error: 'Invalid persons data.',
        data: [],
      }
}

export default useDataParser
