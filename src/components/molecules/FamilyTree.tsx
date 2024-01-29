import { FunctionComponent } from 'react'
import { ExtendedPersonType } from '@/utils/PersonRegistryUtil'

const FamilyTree: FunctionComponent<{
  persons: ExtendedPersonType[]
}> = ({ persons }) => {
  return <pre>{JSON.stringify(persons, null, 2)}</pre>
}
export default FamilyTree
