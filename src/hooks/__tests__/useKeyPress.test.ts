import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useKeyPress from '../useKeyPress'

describe('useKeyPress', () => {
  it('calls callback when target key is pressed', () => {
    const targetKeys = ['a', 'b']
    const callback = vi.fn()

    const { unmount } = renderHook(() => useKeyPress(targetKeys, callback))

    const eventA = new KeyboardEvent('keydown', { key: 'a' })
    const eventB = new KeyboardEvent('keydown', { key: 'b' })

    document.dispatchEvent(eventA)
    expect(callback).toHaveBeenCalledTimes(1)

    document.dispatchEvent(eventB)
    expect(callback).toHaveBeenCalledTimes(2)

    unmount()
  })

  it('does not call callback when non-target key is pressed', () => {
    const targetKeys = ['a', 'b']
    const callback = vi.fn()

    const { unmount } = renderHook(() => useKeyPress(targetKeys, callback))

    const eventC = new KeyboardEvent('keydown', { key: 'c' })

    document.dispatchEvent(eventC)
    expect(callback).not.toHaveBeenCalled()

    unmount()
  })
})
