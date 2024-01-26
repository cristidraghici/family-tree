import { Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { PersonUtilType } from '@/types'

export default function PersonsTable({ persons }: { persons: PersonUtilType[] }) {
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
            {persons.map((person: PersonUtilType) => (
              <tr key={person.get().id}>
                <td className="font-medium">{person.fullName()}</td>
                <td>{person.get().biologicalGender}</td>
                <td>{person.get().biography}</td>
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
