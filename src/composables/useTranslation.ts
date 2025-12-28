import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { useUIStore } from '@/stores/ui'

/**
 * Composable para manejo de traducciones
 * Sincroniza el idioma entre vue-i18n y el store de UI
 */
export function useTranslation() {
  const { t, locale } = useI18n()
  const uiStore = useUIStore()

  // Sincronizar cambios de idioma
  watch(
    () => uiStore.language,
    (newLang) => {
      locale.value = newLang
    },
    { immediate: true },
  )

  /**
   * Cambiar el idioma de toda la aplicación
   */
  const changeLanguage = (lang: 'es' | 'en') => {
    locale.value = lang
    uiStore.setLanguage(lang)
  }

  /**
   * Alternar entre español e inglés
   */
  const toggleLanguage = () => {
    const newLang = locale.value === 'es' ? 'en' : 'es'
    changeLanguage(newLang)
  }

  return {
    t,
    locale,
    changeLanguage,
    toggleLanguage,
  }
}
