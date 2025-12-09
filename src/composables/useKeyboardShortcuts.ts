import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  const handleKeyDown = async (event: KeyboardEvent) => {
    // Solo procesar si se presiona Alt + otra tecla
    if (!event.altKey) return

    // Prevenir comportamiento por defecto del navegador
    event.preventDefault()

    const key = event.key.toLowerCase()

    switch (key) {
      case 'r':
        // Alt + R: Ir a Registro (solo si no está autenticado)
        if (!authStore.user) {
          router.push('/register')
        }
        break

      case 's':
        // Alt + S: Ir a Configuración (solo si está autenticado)
        if (authStore.user) {
          router.push('/settings')
        }
        break

      case 'x':
        // Alt + X: Cerrar sesión (solo si está autenticado)
        if (authStore.user) {
          await authStore.signOut()
          router.push('/login')
        }
        break

      case 't':
        // Alt + T: Cambiar tema
        uiStore.toggleTheme()
        break

      case 'p':
        // Alt + P: Ir a Mis Proyectos (solo si está autenticado)
        if (authStore.user) {
          router.push('/my-projects')
        }
        break

      case 'n':
        // Alt + N: Ir a Noticias
        router.push('/news')
        break

      case 'h':
        // Alt + H: Ir a Inicio
        router.push('/')
        break

      case 'a':
        // Alt + A: Ir a Acerca de
        router.push('/about')
        break

      case 'l':
        // Alt + L: Ir a Login (solo si no está autenticado)
        if (!authStore.user) {
          router.push('/login')
        } else {
          // Si está autenticado, ir al perfil
          router.push('/profile')
        }
        break

      case 'i':
        // Alt + I: Cambiar idioma
        uiStore.toggleLanguage()
        break

      case '?':
        // Alt + ?: Mostrar ayuda de atajos (abrir modal)
        uiStore.showKeyboardShortcutsHelp = true
        break
    }
  }

  // Registrar el listener cuando el componente se monta
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  // Limpiar el listener cuando el componente se desmonta
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    // Retornar lista de atajos disponibles para mostrar en ayuda
    shortcuts: [
      { key: 'Alt + H', description: 'Ir a Inicio', requiresAuth: false },
      { key: 'Alt + A', description: 'Acerca de ProjectHub', requiresAuth: false },
      { key: 'Alt + N', description: 'Ver Noticias', requiresAuth: false },
      { key: 'Alt + L', description: 'Login / Perfil', requiresAuth: false },
      { key: 'Alt + R', description: 'Registrarse', requiresAuth: false },
      { key: 'Alt + P', description: 'Mis Proyectos', requiresAuth: true },
      { key: 'Alt + S', description: 'Configuración', requiresAuth: true },
      { key: 'Alt + X', description: 'Cerrar Sesión', requiresAuth: true },
      { key: 'Alt + T', description: 'Cambiar Tema', requiresAuth: false },
      { key: 'Alt + I', description: 'Cambiar Idioma', requiresAuth: false },
      { key: 'Alt + ?', description: 'Mostrar Ayuda', requiresAuth: false }
    ]
  }
}
