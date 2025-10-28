<template>
  <div class="min-h-screen bg-base-200">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Project Not Found -->
    <div v-else-if="!project" class="container mx-auto px-4 py-12 text-center">
      <div class="card bg-base-100 shadow-lg max-w-md mx-auto">
        <div class="card-body">
          <FolderIcon class="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h2 class="text-2xl font-bold mb-2">Proyecto no encontrado</h2>
          <p class="text-base-content/70 mb-4">
            El proyecto que buscas no existe o ha sido eliminado.
          </p>
          <button
            class="btn btn-primary"
            @click="$router.push('/')"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>

    <!-- Project Details -->
    <div v-else class="container mx-auto px-4 py-6 max-w-6xl">
      <!-- Header con navegación -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <button
            class="btn btn-ghost btn-sm"
            @click="$router.back()"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            Volver
          </button>
          <div class="breadcrumbs text-sm">
            <ul>
              <li><router-link to="/">Inicio</router-link></li>
              <li>{{ project.title }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Contenido Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información del Proyecto -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <!-- Header del proyecto -->
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full">
                      <img
                        :src="getProjectCreatorAvatar(project)"
                        :alt="getProjectCreatorName(project)"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold">{{ getProjectCreatorName(project) }}</h4>
                    <p class="text-sm text-base-content/60">{{ formatTimeAgo(project.created_at) }}</p>
                  </div>
                </div>
                <div class="badge" :class="getStatusColor(project.status)">
                  {{ getProjectStatusText(project.status) }}
                </div>
              </div>

              <!-- Título y descripción -->
              <div class="mb-6">
                <h1 class="text-3xl font-bold mb-4">{{ project.title }}</h1>
                <p class="text-lg text-base-content/80 leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <!-- Imagen del proyecto -->
              <div v-if="project.image_url" class="mb-6">
                <img
                  :src="project.image_url"
                  :alt="project.title"
                  class="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <!-- Tags -->
              <div v-if="project.tags?.length" class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Tecnologías</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="badge badge-primary badge-lg"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Acciones del proyecto -->
              <div class="flex items-center justify-between pt-6 border-t border-base-300">
                <div class="flex items-center gap-4">
                  <button
                    class="btn btn-ghost flex items-center gap-2"
                    :class="project.liked_by_user ? 'text-red-500' : ''"
                    @click="toggleLike"
                  >
                    <HeartIcon
                      class="h-6 w-6"
                      :class="project.liked_by_user ? 'fill-red-500' : ''"
                    />
                    <span class="font-semibold">{{ project.likes_count || 0 }}</span>
                    <span class="hidden sm:inline">Likes</span>
                  </button>

                  <button
                    class="btn btn-ghost flex items-center gap-2"
                    @click="scrollToComments"
                  >
                    <ChatBubbleLeftIcon class="h-6 w-6" />
                    <span class="font-semibold">{{ project.comments_count || 0 }}</span>
                    <span class="hidden sm:inline">Comentarios</span>
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    v-if="isProjectOwner"
                    class="btn btn-outline btn-sm"
                    @click="editProject"
                  >
                    <PencilIcon class="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    class="btn btn-primary"
                    @click="collaborateProject"
                  >
                    <UsersIcon class="h-5 w-5" />
                    Colaborar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de Comentarios -->
          <div ref="commentsSection" class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="text-xl font-bold mb-4">
                Comentarios ({{ project.comments_count || 0 }})
              </h3>

              <!-- Formulario para nuevo comentario -->
              <div v-if="user" class="mb-6">
                <div class="flex gap-3">
                  <div class="avatar">
                    <div class="w-10 h-10 rounded-full">
                      <img
                        :src="user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`"
                        :alt="user.full_name"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <textarea
                      v-model="newCommentText"
                      placeholder="Escribe un comentario..."
                      class="textarea textarea-bordered w-full h-20"
                    ></textarea>
                    <div class="flex justify-end mt-2">
                      <button
                        class="btn btn-primary btn-sm"
                        :disabled="!newCommentText.trim() || isLoadingComment"
                        @click="addComment"
                      >
                        <span v-if="isLoadingComment" class="loading loading-spinner loading-xs"></span>
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista de comentarios -->
              <div v-if="comments.length > 0" class="space-y-4">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="flex gap-3 p-4 bg-base-200 rounded-lg"
                >
                  <div class="avatar">
                    <div class="w-8 h-8 rounded-full">
                      <img
                        :src="comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.full_name || 'Usuario')}&background=random`"
                        :alt="comment.user?.full_name || 'Usuario'"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-sm">{{ comment.user?.full_name || 'Usuario' }}</h4>
                      <span class="text-xs text-base-content/60">{{ formatTimeAgo(comment.created_at) }}</span>
                    </div>
                    <p class="text-sm">{{ comment.content }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-base-content/60">
                <ChatBubbleLeftIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Información del proyecto -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">Detalles del proyecto</h3>

              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-base-content/60">Creado:</span>
                  <p class="text-sm">{{ formatDate(project.created_at) }}</p>
                </div>

                <div>
                  <span class="text-sm font-medium text-base-content/60">Última actualización:</span>
                  <p class="text-sm">{{ formatDate(project.updated_at) }}</p>
                </div>

                <div v-if="project.team_members?.length">
                  <span class="text-sm font-medium text-base-content/60">Equipo:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="member in project.team_members"
                      :key="member"
                      class="badge badge-outline badge-sm"
                    >
                      {{ member }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historial de cambios -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">Historial de cambios</h3>
              <div v-if="historyEntries.length > 0" class="space-y-2 text-sm">
                <div v-for="(entry, idx) in historyEntries" :key="idx" class="p-3 bg-base-200 rounded">
                  <div class="flex justify-between">
                    <div>
                      <div class="font-medium">{{ entry.title }}</div>
                      <div class="text-xs text-base-content/60">{{ entry.detail }}</div>
                    </div>
                    <div class="text-xs text-base-content/60">{{ entry.time }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-base-content/60">No hay historial disponible.</div>
            </div>
          </div>

          <!-- Proyectos relacionados -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">Más proyectos</h3>

              <div v-if="relatedProjects.length > 0" class="space-y-3">
                <div
                  v-for="relatedProject in relatedProjects"
                  :key="relatedProject.id"
                  class="cursor-pointer p-3 hover:bg-base-200 rounded-lg transition-colors"
                  @click="$router.push(`/projects/${relatedProject.id}`)"
                >
                  <h4 class="font-medium text-sm truncate">{{ relatedProject.title }}</h4>
                  <p class="text-xs text-base-content/60">{{ getProjectCreatorName(relatedProject) }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex items-center gap-1">
                      <HeartIcon class="h-3 w-3" />
                      <span class="text-xs">{{ relatedProject.likes_count || 0 }}</span>
                    </div>
                    <div class="badge badge-xs" :class="getStatusColor(relatedProject.status)">
                      {{ getProjectStatusText(relatedProject.status) }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-4 text-base-content/60 text-sm">
                No hay proyectos relacionados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import type { Project, Comment } from '@/types'
import {
  ArrowLeftIcon,
  FolderIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  UsersIcon
} from '@/icons'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const { profile } = storeToRefs(authStore)
const { projects } = storeToRefs(projectsStore)

const user = computed(() => profile.value)

// State
const loading = ref(true)
const isLoadingComment = ref(false)
const newCommentText = ref('')
const comments = ref<Comment[]>([])
const commentsSection = ref<HTMLElement>()

// Computed
const projectId = computed(() => route.params.id as string)
const project = computed(() => projects.value.find(p => p.id === projectId.value))

const isProjectOwner = computed(() => {
  return user.value && project.value && project.value.created_by === user.value.id
})

const relatedProjects = computed(() => {
  if (!project.value) return []
  return projects.value
    .filter(p => p.id !== project.value?.id && p.created_by === project.value?.created_by)
    .slice(0, 3)
})

// Historial simple: usa project.history si existe, si no muestra creado/actualizado
const historyEntries = computed(() => {
  if (!project.value) return []
  if (project.value.history && Array.isArray(project.value.history) && project.value.history.length > 0) {
    return project.value.history.slice(-5).reverse().map((h: any) => ({
      title: h.title || h.action || 'Cambio',
      detail: h.detail || h.summary || '',
      time: h.time || new Date(h.timestamp || h.date || h.at).toLocaleString()
    }))
  }

  // Fallback: created / updated
  const entries = []
  if (project.value.created_at) {
    entries.push({ title: 'Creado', detail: `Creado por ${getProjectCreatorName(project.value)}`, time: formatDate(project.value.created_at) })
  }
  if (project.value.updated_at && project.value.updated_at !== project.value.created_at) {
    entries.push({ title: 'Última actualización', detail: `Actualizado`, time: formatDate(project.value.updated_at) })
  }
  return entries
})

// Methods
const getProjectCreatorName = (proj: Project): string => {
  if (proj.creator?.full_name) {
    return proj.creator.full_name
  }
  if (proj.created_by === user.value?.id) {
    return user.value?.full_name || 'Usuario'
  }
  return 'Usuario'
}

const getProjectCreatorAvatar = (proj: Project): string => {
  if (proj.creator?.avatar_url) {
    return proj.creator.avatar_url
  }
  if (proj.created_by === user.value?.id && user.value?.avatar_url) {
    return user.value.avatar_url
  }
  const creatorName = getProjectCreatorName(proj)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random`
}

const getProjectStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'planning': 'Planificando',
    'in_progress': 'En Progreso',
    'completed': 'Completado',
    'on_hold': 'En Pausa'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'planning': 'badge-info',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'on_hold': 'badge-ghost',
    'Planificando': 'badge-info',
    'En Progreso': 'badge-warning',
    'Completado': 'badge-success',
    'En Pausa': 'badge-ghost'
  }
  return colorMap[status] || 'badge-ghost'
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `hace ${minutes} min`
  } else if (hours < 24) {
    return `hace ${hours}h`
  } else {
    return `hace ${days}d`
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleLike = async () => {
  if (!user.value || !project.value) return

  try {
    await projectsStore.toggleLike(project.value.id, user.value.id)
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const addComment = async () => {
  if (!user.value || !project.value || !newCommentText.value.trim()) return

  isLoadingComment.value = true
  try {
    const newComment = await projectsStore.addComment(project.value.id, newCommentText.value)
    comments.value.unshift(newComment)
    newCommentText.value = ''
  } catch (error) {
    console.error('Error adding comment:', error)
  } finally {
    isLoadingComment.value = false
  }
}

const scrollToComments = () => {
  commentsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const editProject = () => {
  // Navegar a la página de edición del proyecto
  router.push(`/projects/${project.value?.id}/edit`)
}

const collaborateProject = () => {
  // Lógica para solicitar colaboración
  console.log('Solicitar colaboración en el proyecto')
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await projectsStore.fetchProjects()

    // Si el proyecto no existe, redirigir
    if (!project.value) {
      router.push('/')
      return
    }

    // Cargar comentarios del proyecto
    comments.value = await projectsStore.fetchComments(projectId.value)
  } catch (error) {
    console.error('Error loading project:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
