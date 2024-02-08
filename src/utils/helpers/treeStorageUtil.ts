const LOCAL_STORAGE_KEY = 'familyTree'

import { RegistryType } from '@/utils/PersonRegistry'

export const getTreeStorage = (): RegistryType | null | boolean => {
  try {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedToken ? (JSON.parse(storedToken) as RegistryType) : null
  } catch (e) {
    return false
  }
}

export const setTreeStorage = (token: RegistryType | null): void => {
  if (token === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token))
  }
}
