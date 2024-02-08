function devLog<T>(data: T, level: 'log' | 'warn' | 'error' = 'log'): void {
  if (!import.meta.env.DEV) {
    return
  }

  if (level === 'log') {
    console.log(data)
  }
  if (level === 'warn') {
    console.warn(data)
  }
  if (level === 'error') {
    console.error(data)
  }
}

export default devLog
