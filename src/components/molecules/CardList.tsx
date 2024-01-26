import { FunctionComponent, Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { PersonWithRelationsType } from '@/types'

const CardList: FunctionComponent<{ persons: PersonWithRelationsType[] }> = ({ persons }) => {
  return (
    <>
      <ConditionalElement as="div" className="CardsGrid" condition={persons.length > 0}>
        {persons.map((person: PersonWithRelationsType) => (
          <article key={person.id}>
            <header>
              {person.firstName} {person.lastName}
            </header>
            {person.biography}
          </article>
        ))}
      </ConditionalElement>

      <ConditionalElement as={Fragment} condition={persons.length === 0}>
        <article>No persons found.</article>
      </ConditionalElement>
    </>
  )
}
export default CardList
