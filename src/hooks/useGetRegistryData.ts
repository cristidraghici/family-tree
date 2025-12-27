import { useEffect, useState, useMemo } from 'react'
import { registrySchema } from '@/schemas'
import { hasTreeStorage, getTreeStorage } from '@/utils/treeStorageUtil'

import registryJSON from '@/data/registry.json'

import { RegistryType } from '@/types'

import devLog from '@/utils/devLog'

export const initialReturnValue: ReturnType<typeof useGetRegistryData> = {
  registryData: null,
  error: null,
  loadRegistryData: () => {},
}

const useGetRegistryData = () => {
  const [registryData, setRegistryData] = useState<RegistryType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadRegistryData = <T>(data: T) => {
    const result = registrySchema.safeParse(data)

    if (result.success === false) {
      devLog(result.error, 'error')
      setError('Invalid data.')
      return
    }

    setRegistryData(result.data)
  }

  useEffect(() => {
    setError(null)

    try {
      const isLocalStorageEmpty = !hasTreeStorage()
      if (isLocalStorageEmpty) {
        loadRegistryData(registryJSON)
        return
      }

      const localStorageRegistryJSON = getTreeStorage()
      if (localStorageRegistryJSON === null) {
        loadRegistryData({
          persons: [],
          relationships: [],
          positions: [],
        } as RegistryType)

        return
      }

      loadRegistryData(localStorageRegistryJSON)
    } catch (error) {
      devLog(error, 'error')
      setError('Invalid data.')
    }
  }, [])

  return useMemo(
    () => ({
      registryData,
      error,
      loadRegistryData,
    }),
    [registryData, error],
  )
}

export default useGetRegistryData
