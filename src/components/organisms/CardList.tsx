import { FunctionComponent, Fragment } from 'react'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import Card from '@/components/molecules/Card'

import { ExtendedPersonType } from '@/utils/PersonRegistryUtil'

const CardList: FunctionComponent<{
  persons: ExtendedPersonType[]
  onEdit: (person: ExtendedPersonType) => void
}> = ({ persons, onEdit }) => {
  return (
    <>
      <ConditionalElement as="div" className="CardsGrid" condition={persons.length > 0}>
        {persons.map((person: ExtendedPersonType) => (
          <Card key={person.id} person={person} onClick={() => onEdit(person)} />
        ))}
      </ConditionalElement>

      <ConditionalElement as={Fragment} condition={persons.length === 0}>
        <article>No persons found.</article>
      </ConditionalElement>
    </>
  )
}
export default CardList
