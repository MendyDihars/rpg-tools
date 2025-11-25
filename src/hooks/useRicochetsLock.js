import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ricochets_password'
const SECRET = '2603'

function readIsUnlocked() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) === SECRET
  } catch {
    return false
  }
}

function useRicochetsLock() {
  const [isUnlocked, setIsUnlocked] = useState(() => readIsUnlocked())

  const unlock = useCallback((password) => {
    if (password !== SECRET) {
      return false
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, SECRET)
    } catch {
      // ignore storage failures, still update state
    }

    setIsUnlocked(true)
    return true
  }, [])

  const lock = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage failures, still update state
    }

    setIsUnlocked(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        setIsUnlocked(event.newValue === SECRET)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { isUnlocked, unlock, lock }
}

export default useRicochetsLock

