import { useContext } from 'react'
import { PersonContext } from '@/contexts/PersonContext'

const usePersonContext = () => useContext(PersonContext)

export default usePersonContext
