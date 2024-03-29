import { RegistryType } from '@/types'

const LOCAL_STORAGE_KEY = 'familyTree'

export const hasTreeStorage = (): boolean => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) !== null
}

export const getTreeStorage = (): RegistryType | null => {
  const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY)
  return storedToken ? (JSON.parse(storedToken) as RegistryType) : null
}

export const setTreeStorage = (registryData: RegistryType | null): void => {
  if (registryData === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registryData))
  }
}
