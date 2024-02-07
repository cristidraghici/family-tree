// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export default debounce
