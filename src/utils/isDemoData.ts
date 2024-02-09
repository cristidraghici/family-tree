import registryJSON from '@/data/registry.json'

import { PersonType, RelationshipType } from '@/types'

const isDemoData = (persons: PersonType[], relationships: RelationshipType[]) => {
  return (
    JSON.stringify(persons?.sort()) === JSON.stringify(registryJSON.persons.sort()) &&
    JSON.stringify(relationships?.sort()) === JSON.stringify(registryJSON.relationships.sort())
  )
}
export default isDemoData
