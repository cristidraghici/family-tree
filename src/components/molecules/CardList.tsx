import { FunctionComponent, Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { ExtendedPersonType } from '@/utils/PersonRegistryUtil'

const CardList: FunctionComponent<{ persons: ExtendedPersonType[] }> = ({ persons }) => {
  return (
    <>
      <ConditionalElement as="div" className="CardsGrid" condition={persons.length > 0}>
        {persons.map((person: ExtendedPersonType) => (
          <article key={person.id}>
            <header>{person.fullName}</header>
            {person.biography}
            <footer>
              <ConditionalElement as="p" condition={!!person.parentsNames}>
                <strong>Parents</strong>: {person.parentsNames}
              </ConditionalElement>
              <ConditionalElement as="p" condition={!!person.relativesNames}>
                <strong>Relatives</strong>: {person.relativesNames}
              </ConditionalElement>
            </footer>
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
