import { createContext } from 'react'
import {
  PersonType,
  NewPersonType,
  PersonIdType,
  RegistryType,
  ExtendedPersonType,
  PositionsType,
  RelationshipType,
  X,
  Y,
} from '@/types'

type PersonContextType = {
  // Data State
  persons: ExtendedPersonType[]
  filteredPersons: ExtendedPersonType[]
  relationships: RelationshipType[]
  positions: PositionsType[]
  registry: RegistryType

  // UI State
  selectedPerson: PersonType | NewPersonType | null
  search: string
  error: string | null
  isDemoData: boolean

  // Actions
  setSearch: (text: string) => void
  handleSelectPerson: (personId: string, coordinates?: { x: X; y: Y }) => void
  addPerson: (person: PersonType, coordinates?: { x: X; y: Y }) => void
  removePerson: (personId: PersonIdType) => void
  updatePositions: (positions: PositionsType[]) => void
  loadRegistryData: (data: RegistryType) => void
  saveAll: (data: RegistryType) => void
  clearAll: () => void
}

const initialContextValues: Partial<PersonContextType> = {
  persons: [],
  filteredPersons: [],
  relationships: [],
  positions: [],
  selectedPerson: null,
  search: '',
  error: null,
  isDemoData: false,
}

export const PersonContext = createContext<PersonContextType>(
  initialContextValues as PersonContextType,
)
