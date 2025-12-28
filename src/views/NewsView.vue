<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary to-secondary text-primary-content">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h1 class="text-4xl font-bold">{{ t('news.title') }}</h1>
          </div>
          <p class="text-lg opacity-90">{{ t('news.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filters -->
      <div class="card bg-base-100 shadow-lg border border-base-300 mb-8">
        <div class="card-body p-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.key"
              @click="activeCategory = category.key"
              class="btn btn-sm"
              :class="activeCategory === category.key ? 'btn-primary' : 'btn-ghost'"
            >
              <component :is="category.icon" class="h-4 w-4" />
              {{ category.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- News Grid -->
      <div v-if="filteredNews.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="item in filteredNews"
          :key="item.id"
          class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
          @contextmenu.prevent="(e) => handleNewsContextMenu(e, item)"
        >
          <div class="card-body">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="p-3 rounded-lg" :class="getCategoryColor(item.category)">
                  <component :is="getCategoryIcon(item.category)" class="h-6 w-6" />
                </div>
                <div>
                  <h2 class="card-title text-xl">{{ item.title }}</h2>
                  <p class="text-sm text-base-content/60">
                    {{ t('news.postedOn') }} {{ formatDate(item.date) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="badge" :class="getCategoryBadgeColor(item.category)">
                  {{ getCategoryLabel(item.category) }}
                </div>
                <button
                  @click="(e) => handleNewsMenuClick(e, item)"
                  class="btn btn-ghost btn-sm btn-circle"
                >
                  <EllipsisVerticalIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-3">
              <p
                class="text-base-content/80 leading-relaxed"
                :class="expandedItems[item.id] ? '' : 'line-clamp-3'"
              >
                {{ item.content }}
              </p>

              <!-- Read More Button -->
              <button
                v-if="item.content.length > 150"
                @click="toggleExpand(item.id)"
                class="text-primary hover:text-primary-focus font-medium text-sm flex items-center gap-1"
              >
                {{ expandedItems[item.id] ? t('news.readLess') : t('news.readMore') }}
                <svg
                  class="h-4 w-4 transition-transform"
                  :class="expandedItems[item.id] ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- Features List -->
              <ul v-if="item.features && item.features.length > 0" class="space-y-2 mt-4">
                <li
                  v-for="(feature, index) in item.features"
                  :key="index"
                  class="flex items-start gap-2 text-sm"
                >
                  <svg
                    class="h-5 w-5 text-success shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
              <span v-for="tag in item.tags" :key="tag" class="badge badge-outline badge-sm">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="card bg-base-100 shadow-lg border border-base-300">
          <div class="card-body p-12">
            <svg
              class="h-16 w-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 class="text-xl font-semibold mb-2">{{ t('news.noNews') }}</h3>
            <p class="text-base-content/70">{{ t('news.comingSoon') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Context Menu -->
    <ContextMenu ref="newsContextMenuRef" :items="newsContextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import AppFooter from '@/components/AppFooter.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import type { ContextMenuItem } from '@/components/ContextMenu.vue'
import {
  SparklesIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  MegaphoneIcon,
  NewspaperIcon,
  EllipsisVerticalIcon,
  ShareIcon,
  BookmarkIcon,
  ClipboardDocumentIcon,
} from '@/icons'

const { t, locale } = useTranslation()

const activeCategory = ref('all')
const expandedItems = ref<Record<string, boolean>>({})
const newsContextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)
const currentNewsItem = ref<any>(null)

// Categories
const categories = computed(() => [
  { key: 'all', label: t('news.categories.all'), icon: NewspaperIcon },
  { key: 'features', label: t('news.categories.features'), icon: SparklesIcon },
  { key: 'improvements', label: t('news.categories.improvements'), icon: RocketLaunchIcon },
  { key: 'fixes', label: t('news.categories.fixes'), icon: WrenchScrewdriverIcon },
  { key: 'announcements', label: t('news.categories.announcements'), icon: MegaphoneIcon },
])

// News data
const newsItems = computed(() => {
  const isSpanish = locale.value === 'es'

  return [
    {
      id: 1,
      category: 'features',
      date: '2025-11-02',
      title: isSpanish ? 'Sistema de Lector de Voz' : 'Text-to-Speech System',
      content: isSpanish
        ? 'Hemos implementado un completo sistema de lector de voz para mejorar la accesibilidad de la plataforma. Ahora puedes escuchar cualquier contenido de la aplicación con solo hacer clic.'
        : 'We have implemented a complete text-to-speech system to improve platform accessibility. Now you can listen to any application content with just one click.',
      features: isSpanish
        ? [
            'Lectura de página completa o selección de texto',
            'Control de velocidad y volumen de voz',
            'Atajos de teclado (Alt+R, Alt+S, Alt+X, Alt+T)',
            'Selección automática de voz según idioma',
            'Botón flotante de fácil acceso',
          ]
        : [
            'Full page or text selection reading',
            'Voice speed and volume control',
            'Keyboard shortcuts (Alt+R, Alt+S, Alt+X, Alt+T)',
            'Automatic voice selection by language',
            'Easy-access floating button',
          ],
      tags: ['accessibility', 'voice', 'ux'],
    },
    {
      id: 2,
      category: 'features',
      date: '2025-11-01',
      title: isSpanish ? 'Modo Alto Contraste' : 'High Contrast Mode',
      content: isSpanish
        ? 'Nuevo modo de alto contraste disponible para mejorar la legibilidad y accesibilidad. El modo se adapta automáticamente a tu tema claro u oscuro preferido.'
        : 'New high contrast mode available to improve readability and accessibility. The mode automatically adapts to your preferred light or dark theme.',
      features: isSpanish
        ? [
            'Contraste mejorado en colores',
            'Bordes más gruesos y visibles',
            'Sombras y efectos mejorados',
            'Enlaces subrayados para mejor identificación',
            'Adaptación a temas claro/oscuro',
          ]
        : [
            'Enhanced color contrast',
            'Thicker and more visible borders',
            'Improved shadows and effects',
            'Underlined links for better identification',
            'Light/dark theme adaptation',
          ],
      tags: ['accessibility', 'design', 'ux'],
    },
    {
      id: 3,
      category: 'features',
      date: '2025-10-30',
      title: isSpanish ? 'Sistema Multiidioma Completo' : 'Complete Multilingual System',
      content: isSpanish
        ? 'La plataforma ahora está completamente traducida en español e inglés. Todas las páginas, modales, mensajes y componentes están disponibles en ambos idiomas con traducción en tiempo real.'
        : 'The platform is now fully translated into Spanish and English. All pages, modals, messages and components are available in both languages with real-time translation.',
      features: isSpanish
        ? [
            'Cambio de idioma en tiempo real',
            'Persistencia de preferencia de idioma',
            'Todas las vistas traducidas',
            'Mensajes de error y éxito localizados',
            'Fechas y formatos adaptados',
          ]
        : [
            'Real-time language switching',
            'Language preference persistence',
            'All views translated',
            'Localized error and success messages',
            'Adapted dates and formats',
          ],
      tags: ['i18n', 'localization', 'ux'],
    },
    {
      id: 4,
      category: 'improvements',
      date: '2025-10-28',
      title: isSpanish ? 'Diseño Mejorado de Registro' : 'Improved Registration Design',
      content: isSpanish
        ? 'Rediseño completo de la página de registro con un layout moderno de dos columnas, efectos glassmorphism y panel de beneficios. Incluye visualización de contraseña para mayor facilidad de uso.'
        : 'Complete redesign of the registration page with a modern two-column layout, glassmorphism effects and benefits panel. Includes password visibility for ease of use.',
      tags: ['ui', 'design', 'registration'],
    },
    {
      id: 5,
      category: 'features',
      date: '2025-10-25',
      title: isSpanish ? 'Modales de Términos y Privacidad' : 'Terms and Privacy Modals',
      content: isSpanish
        ? 'Nuevos modales informativos para Términos de Uso y Política de Privacidad accesibles desde el footer. Diseño profesional con secciones organizadas y fácil navegación.'
        : 'New informative modals for Terms of Use and Privacy Policy accessible from the footer. Professional design with organized sections and easy navigation.',
      features: isSpanish
        ? [
            '8 secciones en Términos de Uso',
            '11 secciones en Política de Privacidad',
            'Iconos visuales para cada sección',
            'Diseño responsive y scrolleable',
            'Información actualizada al 2 de noviembre de 2025',
          ]
        : [
            '8 sections in Terms of Use',
            '11 sections in Privacy Policy',
            'Visual icons for each section',
            'Responsive and scrollable design',
            'Information updated as of November 2, 2025',
          ],
      tags: ['legal', 'compliance', 'ui'],
    },
    {
      id: 6,
      category: 'announcements',
      date: '2025-10-20',
      title: isSpanish ? 'Bienvenidos a DevConnect Platform' : 'Welcome to DevConnect Platform',
      content: isSpanish
        ? '¡Bienvenidos a nuestra plataforma de colaboración para desarrolladores! DevConnect es el lugar perfecto para compartir proyectos, colaborar con otros desarrolladores y construir el futuro de la tecnología juntos.'
        : 'Welcome to our collaboration platform for developers! DevConnect is the perfect place to share projects, collaborate with other developers and build the future of technology together.',
      features: isSpanish
        ? [
            'Crea y gestiona proyectos ilimitados',
            'Colabora con otros desarrolladores',
            'Comparte tu progreso y aprendizajes',
            'Descubre proyectos innovadores',
            'Comunidad activa y soporte continuo',
          ]
        : [
            'Create and manage unlimited projects',
            'Collaborate with other developers',
            'Share your progress and learnings',
            'Discover innovative projects',
            'Active community and continuous support',
          ],
      tags: ['announcement', 'welcome', 'community'],
    },
  ]
})

// Filtered news
const filteredNews = computed(() => {
  if (activeCategory.value === 'all') {
    return newsItems.value
  }
  return newsItems.value.filter((item) => item.category === activeCategory.value)
})

// Helper functions
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    features: 'bg-primary/10 text-primary',
    improvements: 'bg-success/10 text-success',
    fixes: 'bg-warning/10 text-warning',
    announcements: 'bg-info/10 text-info',
  }
  return colors[category] || 'bg-base-200 text-base-content'
}

const getCategoryBadgeColor = (category: string) => {
  const colors: Record<string, string> = {
    features: 'badge-primary',
    improvements: 'badge-success',
    fixes: 'badge-warning',
    announcements: 'badge-info',
  }
  return colors[category] || 'badge-ghost'
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    features: SparklesIcon,
    improvements: RocketLaunchIcon,
    fixes: WrenchScrewdriverIcon,
    announcements: MegaphoneIcon,
  }
  return icons[category] || NewspaperIcon
}

const getCategoryLabel = (category: string) => {
  return t(`news.categories.${category}`)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const toggleExpand = (id: number) => {
  expandedItems.value[id] = !expandedItems.value[id]
}

// Context menu handlers
const newsContextMenuItems = computed((): ContextMenuItem[] => [
  {
    label: locale.value === 'es' ? 'Compartir' : 'Share',
    icon: ShareIcon,
    action: () => handleShareNews(),
  },
  {
    label: locale.value === 'es' ? 'Copiar enlace' : 'Copy link',
    icon: ClipboardDocumentIcon,
    action: () => handleCopyLink(),
  },
  {
    label: locale.value === 'es' ? 'Guardar' : 'Save',
    icon: BookmarkIcon,
    action: () => handleSaveNews(),
  },
])

const handleNewsContextMenu = (event: MouseEvent, item: any) => {
  currentNewsItem.value = item
  newsContextMenuRef.value?.show(event.clientX, event.clientY)
}

const handleNewsMenuClick = (event: MouseEvent, item: any) => {
  currentNewsItem.value = item
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  newsContextMenuRef.value?.show(rect.left - 180, rect.bottom + 5)
}

const handleShareNews = () => {
  if (!currentNewsItem.value) return

  const url = `${window.location.origin}/news#${currentNewsItem.value.id}`
  const text = currentNewsItem.value.title

  if (navigator.share) {
    navigator.share({ title: text, url })
  } else {
    navigator.clipboard.writeText(url)
    // TODO: Show toast
  }
}

const handleCopyLink = () => {
  if (!currentNewsItem.value) return

  const url = `${window.location.origin}/news#${currentNewsItem.value.id}`
  navigator.clipboard.writeText(url)
  // TODO: Show toast "Enlace copiado"
}

const handleSaveNews = () => {
  if (!currentNewsItem.value) return
  // TODO: Save to user's saved items
  console.log('Guardando noticia:', currentNewsItem.value.id)
}
</script>
