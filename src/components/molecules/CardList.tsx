import { FunctionComponent, Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { PersonUtilType } from '@/types'

const CardList: FunctionComponent<{ persons: PersonUtilType[] }> = ({ persons }) => {
  return (
    <>
      <ConditionalElement as="div" className="CardsGrid" condition={persons.length > 0}>
        {persons.map((person: PersonUtilType) => (
          <article key={person.get().id}>
            <header>{person.fullName()}</header>
            {person.get().biography}
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
