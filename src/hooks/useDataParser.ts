import { PersonType } from '@/types'

const PERSONS: PersonType[] = [
  {
    id: '1',
    firstName: 'Cristian',
    middleName: 'Andres',
    lastName: 'Gonzalez',
    biologicalGender: 'male',
    biography: 'I am a student at the University of Texas at Austin',
  },
  {
    id: '2',
    firstName: 'Maria',
    middleName: 'Andres',
    lastName: 'Rodriguez',
    biologicalGender: 'female',
    biography: 'I am an artist at the University of Texas at Austin',
  },
]

const useDataParser = () => {
  return {
    persons: PERSONS,
  }
}

export default useDataParser
