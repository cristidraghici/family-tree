const LOCAL_STORAGE_KEY = 'familyTree'

import { PersonType } from '@/utils/PersonRegistry'

export const getTreeStorage = (): PersonType[] | null => {
  try {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedToken ? (JSON.parse(storedToken) as PersonType[]) : null
  } catch (e) {
    return null
  }
}

export const setTreeStorage = (token: PersonType[] | null): void => {
  if (token === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(token))
  }
}
