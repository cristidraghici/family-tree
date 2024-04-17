import { render, screen } from '@testing-library/react'
import Card from '../Card'
import { ExtendedPersonType } from '@/types'

describe('Card', () => {
  it('renders card with content', () => {
    const PERSON: ExtendedPersonType = {
      id: '3',
      fatherId: '1',
      motherId: '2',
      firstName: 'John',
      lastName: 'Doe',
      biologicalGender: 'male',
      biography: 'Biography',
      notes: 'Notes',

      generation: 1,
      spouses: ['4'],
      descendants: ['5'],
      ancestors: ['1', '2'],

      fullName: 'John Doe',
      parentsNames: 'Parents',
      spousesNames: 'Spouses',
      childrenNames: 'Children',
      siblingsNames: 'Siblings',
    }
    render(<Card person={PERSON} />)

    const card = screen.getByText('John Doe')
    expect(card).toBeInTheDocument()
  })
})
