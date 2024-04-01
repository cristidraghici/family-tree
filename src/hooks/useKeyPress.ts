import { useEffect } from 'react'

function useKeyPress(targetKeys: string[], callback: () => void) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (targetKeys.includes(event.key)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  })
}

export default useKeyPress
