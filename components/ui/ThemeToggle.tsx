'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md focus:outline-none transition-all animate-in animate-out antialiased"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle
