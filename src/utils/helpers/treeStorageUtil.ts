import { RegistryType } from '@/utils/PersonRegistry'
import devLog from './devLog'

const LOCAL_STORAGE_KEY = 'familyTree'

export const getTreeStorage = (): RegistryType | null | boolean => {
  try {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedToken ? (JSON.parse(storedToken) as RegistryType) : null
  } catch (e) {
    devLog(e, 'error')
    return false
  }
}

export const setTreeStorage = (token: RegistryType | null): void => {
  try {
    if (token === null) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token))
    }
  } catch (e) {
    devLog(e, 'error')
  }
}
