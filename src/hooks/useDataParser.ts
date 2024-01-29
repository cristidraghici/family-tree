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
        filteredPersons: everybody.filter((person) =>
          person.fullName.toLowerCase().includes(search.toLowerCase()),
        ),
        everybody: everybody,
      }
    : {
        error: `Invalid persons data. [e.g. ${result.error.issues[0].message}]`,
        filteredPersons: [],
        everybody: [],
      }
}

export default useDataParser
