import { useContext } from 'react'
import { PersonContext } from './personContext'

const usePersonContext = () => useContext(PersonContext)

export default usePersonContext
