import { PersonType } from '@/types'

export default function PersonsTable({ persons }: { persons: PersonType[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Biography</th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person: PersonType) => (
          <tr key={person.id}>
            <td className="font-medium">
              {person.firstName} {person.lastName}
            </td>
            <td>{person.biologicalGender}</td>
            <td>{person.biography}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
