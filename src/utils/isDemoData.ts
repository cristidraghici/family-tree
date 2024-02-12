import registryJSON from '@/data/registry.json'

import { PersonType, RelationshipType } from '@/types'

const stringify = <T extends object>(arr: T[]) =>
  JSON.stringify(
    arr
      .map((obj) =>
        JSON.stringify(
          obj,
          Object.keys(obj)
            .filter((key) => !!obj[key as keyof T]) // Remove empty values
            .sort(), // Sort keys
        ),
      )
      .sort(),
  )

const isDemoData = (persons: PersonType[], relationships: RelationshipType[]) => {
  return (
    stringify(persons) === stringify(registryJSON.persons) &&
    stringify(relationships) === stringify(registryJSON.relationships)
  )
}
export default isDemoData
