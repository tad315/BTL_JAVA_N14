const STORAGE_KEY = 'vissmartGeminiApiKey'

export const getStoredGeminiKey = (): string | null => {
  if (typeof window === 'undefined') return null
  const key = localStorage.getItem(STORAGE_KEY)
  return key ? key.trim() : null
}

export const saveGeminiKey = (key: string) => {
  if (typeof window === 'undefined') return
  if (key && key.trim().length > 0) {
    localStorage.setItem(STORAGE_KEY, key.trim())
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
  window.dispatchEvent(new Event('geminiApiKeyUpdated'))
}

export const clearGeminiKey = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('geminiApiKeyUpdated'))
}

export const resolveGeminiApiKey = (): string | null => {
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim()
  }

  return getStoredGeminiKey()
}

