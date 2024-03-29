import { FunctionComponent } from 'react'
import Condition from '@/components/atoms/ConditionalElement'
import Card from '@/components/molecules/Card'

import usePersonContext from '@/hooks/usePersonContext'

import type { ExtendedPersonType } from '@/types'

const CardList: FunctionComponent = () => {
  const { filteredPersons, handleSelectPerson } = usePersonContext()

  return (
    <>
      <Condition as="div" className="CardList" condition={filteredPersons.length > 0}>
        {filteredPersons.map((person: ExtendedPersonType) => (
          <Card key={person.id} person={person} onClick={() => handleSelectPerson(person.id)} />
        ))}
      </Condition>

      <Condition as="article" condition={filteredPersons.length === 0}>
        No persons found.
      </Condition>
    </>
  )
}
export default CardList
