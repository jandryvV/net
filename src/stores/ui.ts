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
  const showKeyboardShortcutsHelp = ref(false)
  const zoomLevel = ref<number>(parseFloat(localStorage.getItem('zoomLevel') || '100'))

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

  // Keyboard shortcuts help
  const toggleKeyboardShortcutsHelp = () => {
    showKeyboardShortcutsHelp.value = !showKeyboardShortcutsHelp.value
  }

  // Theme toggle helper
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme.value)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  // Language toggle helper
  const toggleLanguage = () => {
    const newLang: Language = language.value === 'es' ? 'en' : 'es'
    setLanguage(newLang)
  }

  // Zoom management
  const setZoom = (level: number) => {
    const clampedLevel = Math.max(50, Math.min(200, level))
    zoomLevel.value = clampedLevel
    localStorage.setItem('zoomLevel', clampedLevel.toString())
    applyZoom()
  }

  const increaseZoom = () => {
    setZoom(zoomLevel.value + 10)
  }

  const decreaseZoom = () => {
    setZoom(zoomLevel.value - 10)
  }

  const resetZoom = () => {
    setZoom(100)
  }

  const applyZoom = () => {
    document.documentElement.style.fontSize = `${zoomLevel.value}%`
  }

  // Initialize theme and zoom on store creation
  applyTheme()
  applyZoom()

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
    showKeyboardShortcutsHelp,
    zoomLevel,
    setTheme,
    setLanguage,
    toggleSidebar,
    closeSidebar,
    applyTheme,
    toggleHighContrast,
    setHighContrast,
    toggleTextToSpeech,
    setTextToSpeech,
    toggleKeyboardShortcutsHelp,
    toggleTheme,
    toggleLanguage,
    setZoom,
    increaseZoom,
    decreaseZoom,
    resetZoom
  }
})
