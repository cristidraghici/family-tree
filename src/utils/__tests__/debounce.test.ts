import { vi, beforeEach } from 'vitest'
import debounce from '../debounce'

vi.useFakeTimers()

describe('debounce', () => {
  const mockFn = vi.fn()

  beforeEach(() => {
    mockFn.mockClear()
  })

  it('debounces calls', () => {
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    vi.advanceTimersByTime(500)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
