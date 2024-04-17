import { vi } from 'vitest'
import { hasTreeStorage, getTreeStorage, setTreeStorage } from '../treeStorageUtil'

import { RegistryType } from '@/types'

const LOCAL_STORAGE_KEY = 'familyTree'
const TREE_CONTENT: RegistryType = {
  persons: [],
  relationships: [],
  positions: [],
}

describe('treeStorageUtils', () => {
  const TREE_DATA = JSON.stringify(TREE_CONTENT)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('hasTreeStorage', () => {
    it('does not have tree storage', () => {
      Storage.prototype.getItem = vi.fn(() => null)
      expect(hasTreeStorage()).toBe(false)
    })

    it('has tree storage', () => {
      Storage.prototype.getItem = vi.fn(() => TREE_DATA)
      expect(hasTreeStorage()).toBe(true)
    })
  })

  describe('getTreeStorage', () => {
    it('returns null when there is no tree storage', () => {
      Storage.prototype.getItem = vi.fn(() => null)

      expect(getTreeStorage()).toBe(null)
    })

    it('returns tree storage', () => {
      Storage.prototype.getItem = vi.fn(() => TREE_DATA)

      expect(getTreeStorage()).toEqual(TREE_CONTENT)
    })
  })

  describe('setTreeStorage', () => {
    it('removes tree storage', () => {
      Storage.prototype.removeItem = vi.fn()

      setTreeStorage(null)
      expect(localStorage.removeItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY)
    })

    it('sets tree storage', () => {
      Storage.prototype.setItem = vi.fn()

      setTreeStorage(TREE_CONTENT)
      expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, TREE_DATA)
    })
  })
})
