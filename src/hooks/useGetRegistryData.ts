import { useEffect, useState } from 'react'
import { registrySchema } from '@/schemas'
import { hasTreeStorage, getTreeStorage } from '@/utils/helpers/treeStorageUtil'

import registryJSON from '@/data/registry.json'

import { RegistryType } from '@/types'

import devLog from '@/utils/helpers/devLog'

const useGetRegistryData = () => {
  const [registryData, setRegistryData] = useState<RegistryType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    try {
      const isLocalStorageEmpty = !hasTreeStorage()
      if (isLocalStorageEmpty) {
        setRegistryData(registryJSON as RegistryType)
        return
      }

      const localStorageRegistryJSON = getTreeStorage()

      if (localStorageRegistryJSON === null) {
        setRegistryData({
          persons: [],
          relationships: [],
        })

        return
      }

      const result = registrySchema.safeParse(localStorageRegistryJSON)

      if (result.success === false) {
        devLog(result.error, 'error')
        setError('Invalid data.')
        return
      }

      setRegistryData(result.data)
    } catch (error) {
      devLog(error, 'error')
      setError('Invalid data.')
    }
  }, [])

  const { persons, relationships } = registryData || {}

  const isDemoData =
    JSON.stringify(persons?.sort()) === JSON.stringify(registryJSON.persons.sort()) &&
    JSON.stringify(relationships?.sort()) === JSON.stringify(registryJSON.relationships.sort())

  return {
    registryData,
    error,
    isDemoData,
  }
}

export default useGetRegistryData
