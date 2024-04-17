import { renderHook, act } from '@testing-library/react'
import useToggle from '../useToggle'

describe('useToggle', () => {
  it('should return the initial state', () => {
    const [state] = renderHook(() => useToggle()).result.current
    expect(state).toBe(false)
  })

  it('should toggle the state', async () => {
    const hook = renderHook(() => useToggle())

    const [state, toggle] = hook.result.current
    expect(state).toBe(false)

    act(() => toggle())

    const [newState] = hook.result.current
    expect(newState).toBe(true)
  })
})
