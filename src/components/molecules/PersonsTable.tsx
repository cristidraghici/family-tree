import { Fragment } from 'react'
import ConditionalElement from '../atoms/ConditionalElement'
import { ExtendedPersonType } from '@/utils/PersonRegistryUtil'

export default function PersonsTable({ persons }: { persons: ExtendedPersonType[] }) {
  return (
    <figure>
      <table className="PersonsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Parents</th>
            <th>Biography</th>
          </tr>
        </thead>
        <tbody>
          <ConditionalElement as={Fragment} condition={persons.length > 0}>
            {persons.map((person: ExtendedPersonType) => (
              <tr key={person.id}>
                <td>{person.fullName}</td>
                <td>{person.biologicalGender}</td>
                <td>{person.parentsNames}</td>
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
