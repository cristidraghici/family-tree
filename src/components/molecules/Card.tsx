import { FunctionComponent, ComponentProps } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { ExtendedPersonType } from '@/utils/PersonRegistry'

const Card: FunctionComponent<ComponentProps<'article'> & { person: ExtendedPersonType }> = ({
  className = '',
  person,
  ...rest
}) => {
  return (
    <article className={`Card ${className}`} key={person.id} {...rest}>
      <header>{person.fullName}</header>

      <ConditionalElement condition={!!person.biography || !!person.notes}>
        {person.biography}
        {person.notes}
        <div className="Spacer" />
      </ConditionalElement>

      <ConditionalElement as="p" condition={!!person.parentsNames}>
        <strong>Parents</strong>: {person.parentsNames}
      </ConditionalElement>
      <ConditionalElement as="p" condition={!!person.spousesNames}>
        <strong>Spouses</strong>: {person.spousesNames}
      </ConditionalElement>
      <ConditionalElement as="p" condition={!!person.childrenNames}>
        <strong>Children</strong>: {person.childrenNames}
      </ConditionalElement>
      <ConditionalElement as="p" condition={!!person.siblingsNames}>
        <strong>Siblings</strong>: {person.siblingsNames}
      </ConditionalElement>
    </article>
  )
}
export default Card
