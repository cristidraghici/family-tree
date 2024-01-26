import { personSchema, relationSchema } from '@/schemas'

const useDataParser = ({
  persons,
  relations,
  search,
}: {
  persons: string
  relations: string
  search: string
}) => {
  const personsResult = personSchema.array().safeParse(persons)
  const relationsResult = relationSchema.array().safeParse(relations)

  if (personsResult.success === false || relationsResult.success === false) {
    return {
      error: 'Invalid persons data.',
      data: [],
    }
  }

  const data = personsResult.data.map((person) => {
    const relations = relationsResult.data
      .filter((relation) => relation.personId === person.id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ personId, ...rest }) => rest)

    return {
      ...person,
      relations,
    }
  })

  return {
    error: null,
    data: data.filter((person) =>
      JSON.stringify(person).toLowerCase().includes(search.toLowerCase()),
    ),
  }
}

export default useDataParser
