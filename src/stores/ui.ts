import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'es' | 'en'

export const useUIStore = defineStore('ui', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'auto')
  const language = ref<Language>((localStorage.getItem('language') as Language) || 'es')
  const sidebarOpen = ref(false)
  const highContrast = ref<boolean>(localStorage.getItem('highContrast') === 'true')
  const textToSpeechEnabled = ref<boolean>(localStorage.getItem('ttsEnabled') === 'true')

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

    // Apply high contrast mode
    if (highContrast.value) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }

  // Accessibility management
  const toggleHighContrast = () => {
    highContrast.value = !highContrast.value
    localStorage.setItem('highContrast', highContrast.value.toString())
    applyTheme()
  }

  const setHighContrast = (value: boolean) => {
    highContrast.value = value
    localStorage.setItem('highContrast', value.toString())
    applyTheme()
  }

  // Text to speech management
  const toggleTextToSpeech = () => {
    textToSpeechEnabled.value = !textToSpeechEnabled.value
    localStorage.setItem('ttsEnabled', textToSpeechEnabled.value.toString())
  }

  const setTextToSpeech = (value: boolean) => {
    textToSpeechEnabled.value = value
    localStorage.setItem('ttsEnabled', value.toString())
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
    highContrast,
    textToSpeechEnabled,
    setTheme,
    setLanguage,
    toggleSidebar,
    closeSidebar,
    applyTheme,
    toggleHighContrast,
    setHighContrast,
    toggleTextToSpeech,
    setTextToSpeech
  }
})
