import { FunctionComponent } from 'react'
import ConditionalElement from '@/components/atoms/ConditionalElement'
import Card from '@/components/molecules/Card'

import usePersonContext from '@/hooks/usePersonContext'

import type { ExtendedPersonType } from '@/types'

const CardList: FunctionComponent = () => {
  const { filteredPersons, handleSelectPerson } = usePersonContext()

  return (
    <>
      <ConditionalElement as="div" className="CardList" condition={filteredPersons.length > 0}>
        {filteredPersons.map((person: ExtendedPersonType) => (
          <Card key={person.id} person={person} onClick={() => handleSelectPerson(person.id)} />
        ))}
      </ConditionalElement>
      <ConditionalElement as="article" condition={filteredPersons.length === 0}>
        No persons found.
      </ConditionalElement>
    </>
  )
}
export default CardList
