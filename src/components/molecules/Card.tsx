import { FunctionComponent, ComponentProps } from 'react'
import Condition from '@/components/atoms/ConditionalElement'

import { ExtendedPersonType } from '@/types'

const Card: FunctionComponent<ComponentProps<'article'> & { person: ExtendedPersonType }> = ({
  className = '',
  person,
  ...rest
}) => {
  return (
    <article className={`Card ${className}`} key={person.id} {...rest}>
      <header>{person.fullName}</header>

      <Condition condition={!!person.biography || !!person.notes}>
        <div>{person.biography}</div>
        <div>{person.notes}</div>
        <div className="Spacer" />
      </Condition>

      <Condition as="p" condition={!!person.parentsNames}>
        <strong>Parents</strong>: {person.parentsNames}
      </Condition>

      <Condition as="p" condition={!!person.spousesNames}>
        <strong>Spouses</strong>: {person.spousesNames}
      </Condition>

      <Condition as="p" condition={!!person.childrenNames}>
        <strong>Children</strong>: {person.childrenNames}
      </Condition>

      <Condition as="p" condition={!!person.siblingsNames}>
        <strong>Siblings</strong>: {person.siblingsNames}
      </Condition>
    </article>
  )
}
export default Card
