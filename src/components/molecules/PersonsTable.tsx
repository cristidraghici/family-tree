import { Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { PersonWithRelationsType } from '@/types'

export default function PersonsTable({ persons }: { persons: PersonWithRelationsType[] }) {
  return (
    <figure>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Biography</th>
          </tr>
        </thead>
        <tbody>
          <ConditionalElement as={Fragment} condition={persons.length > 0}>
            {persons.map((person: PersonWithRelationsType) => (
              <tr key={person.id}>
                <td className="font-medium">
                  {person.firstName} {person.lastName}
                </td>
                <td>{person.biologicalGender}</td>
                <td>{person.biography}</td>
              </tr>
            ))}
          </ConditionalElement>

          <ConditionalElement as={Fragment} condition={persons.length === 0}>
            <tr>
              <td colSpan={3}>No persons found.</td>
            </tr>
          </ConditionalElement>
        </tbody>
      </table>
    </figure>
  )
}
