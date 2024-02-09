import { PersonType, PersonIdType, RelationshipType } from '@/types'

type PersonWithGenerationType = PersonType & { generation: number }
type GenerationType = Record<PersonIdType, number>

const getGenerations = (persons: PersonType[], relationships: RelationshipType[]) => {
  const personsWithGeneration: PersonWithGenerationType[] = persons.map((person) => ({
    ...person,
    generation: 0,
  }))

  const calculatePersonGeneration = (person: PersonWithGenerationType): number => {
    if (!person.fatherId && !person.motherId) {
      return 1
    }

    const fatherGeneration = person.fatherId
      ? calculatePersonGeneration(
          personsWithGeneration.find((p) => p.id === person.fatherId) as PersonWithGenerationType,
        )
      : 0

    const motherGeneration = person.motherId
      ? calculatePersonGeneration(
          personsWithGeneration.find((p) => p.id === person.motherId) as PersonWithGenerationType,
        )
      : 0

    return Math.max(fatherGeneration, motherGeneration) + 1
  }

  personsWithGeneration.forEach((person) => {
    person.generation = calculatePersonGeneration(person)
  })

  // include relationships
  for (const relationship of relationships) {
    const firstPerson = personsWithGeneration.find((p) => p.id === relationship.persons[0])
    const secondPerson = personsWithGeneration.find((p) => p.id === relationship.persons[1])

    if (!firstPerson || !secondPerson) {
      continue
    }

    // if there is a spouse relationship, the spouse should have the same generation as the person
    if (relationship.relationshipType === 'spouse') {
      if (firstPerson.generation > secondPerson.generation) {
        secondPerson.generation = firstPerson.generation
      } else {
        firstPerson.generation = secondPerson.generation
      }
    }
  }

  return personsWithGeneration.reduce((generations, person) => {
    generations[person.id] = person.generation

    return generations
  }, {} as GenerationType)
}
export default getGenerations
