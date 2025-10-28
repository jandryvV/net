import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'es' | 'en'

export const useUIStore = defineStore('ui', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'auto')
  const language = ref<Language>((localStorage.getItem('language') as Language) || 'es')
  const sidebarOpen = ref(false)

  // Theme management
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement

    if (theme.value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', theme.value)
    }
  }

  // Language management
  const setLanguage = (newLanguage: Language) => {
    language.value = newLanguage
    localStorage.setItem('language', newLanguage)
  }

  // Sidebar management
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  // Initialize theme on store creation
  applyTheme()

  // Listen for system theme changes
  if (theme.value === 'auto') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
  }

  return {
    theme,
    language,
    sidebarOpen,
    setTheme,
    setLanguage,
    toggleSidebar,
    closeSidebar,
    applyTheme
  }
})
