import { FunctionComponent, Fragment } from 'react'

import ConditionalElement from '@/components/atoms/ConditionalElement'
import Card from '@/components/molecules/Card'

import type { ExtendedPersonType, SelectPersonFunction } from '@/types'

interface CardListProps {
  persons: ExtendedPersonType[]
  onClick: SelectPersonFunction
}

const CardList: FunctionComponent<CardListProps> = ({ persons, onClick }) => {
  return (
    <>
      <ConditionalElement as="div" className="CardsGrid" condition={persons.length > 0}>
        {persons.map((person: ExtendedPersonType) => (
          <Card key={person.id} person={person} onClick={() => onClick(person.id)} />
        ))}
      </ConditionalElement>
      <ConditionalElement as={Fragment} condition={persons.length === 0}>
        <article>No persons found.</article>
      </ConditionalElement>
    </>
  )
}
export default CardList
