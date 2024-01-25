import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PersonType } from '@/types'

export default function PersonsTable({ persons }: { persons: PersonType[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Biography</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {persons.map((person: PersonType) => (
          <TableRow key={person.id}>
            <TableCell className="font-medium">
              {person.firstName} {person.lastName}
            </TableCell>
            <TableCell>{person.biologicalGender}</TableCell>
            <TableCell>{person.biography}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
