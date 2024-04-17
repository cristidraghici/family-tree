import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useOutsideClick from '../useOutsideClick'

test('useOutsideClick calls callback when clicking outside the ref element', () => {
  const refElement = document.createElement('div')
  const callback = vi.fn()

  const ref = { current: refElement }
  const { unmount } = renderHook(() => useOutsideClick(ref, callback))

  const event = new MouseEvent('mousedown', { bubbles: true })
  document.dispatchEvent(event)

  expect(callback).toHaveBeenCalledTimes(1)

  refElement.dispatchEvent(event)

  expect(callback).toHaveBeenCalledTimes(1)

  unmount()
})
