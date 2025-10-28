<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header mejorado -->
      <div class="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-8 border border-primary/20">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 class="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mis Proyectos
            </h1>
            <p class="text-base-content/70 text-lg">
              Gestiona y comparte tus proyectos con la comunidad
            </p>
          </div>
          <button
            class="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all"
            @click="showCreateModal = true"
          >
            <PlusIcon class="h-6 w-6" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      <!-- Stats Cards mejoradas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all">
          <div class="card-body p-6">
            <div class="flex items-center gap-4">
              <div class="bg-primary/10 p-3 rounded-full">
                <FolderIcon class="h-6 w-6 text-primary" />
              </div>
              <div>
                <div class="text-2xl font-bold text-primary">{{ userProjects.length }}</div>
                <div class="text-sm text-base-content/60">Proyectos totales</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all">
          <div class="card-body p-6">
            <div class="flex items-center gap-4">
              <div class="bg-success/10 p-3 rounded-full">
                <CheckIcon class="h-6 w-6 text-success" />
              </div>
              <div>
                <div class="text-2xl font-bold text-success">{{ completedCount }}</div>
                <div class="text-sm text-base-content/60">Completados</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all">
          <div class="card-body p-6">
            <div class="flex items-center gap-4">
              <div class="bg-warning/10 p-3 rounded-full">
                <ClockIcon class="h-6 w-6 text-warning" />
              </div>
              <div>
                <div class="text-2xl font-bold text-warning">{{ inProgressCount }}</div>
                <div class="text-sm text-base-content/60">En progreso</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all">
          <div class="card-body p-6">
            <div class="flex items-center gap-4">
              <div class="bg-error/10 p-3 rounded-full">
                <HeartIcon class="h-6 w-6 text-error fill-current" />
              </div>
              <div>
                <div class="text-2xl font-bold text-error">{{ totalLikes }}</div>
                <div class="text-sm text-base-content/60">Likes totales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda mejorados -->
      <div class="card bg-base-100 shadow-lg border border-base-300 mb-8">
        <div class="card-body p-6">
          <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 text-base-content/60">
          <FunnelIcon class="h-5 w-5" />
          <span class="font-medium">Filtrar y ordenar:</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="form-control">
            <select v-model="statusFilter" class="select select-bordered select-lg w-full lg:w-auto">
          <option value="">Todos los estados</option>
          <option value="planning">Planificando</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completado</option>
          <option value="on_hold">En Pausa</option>
            </select>
          </div>
          <div class="form-control">
            <select v-model="sortBy" class="select select-bordered select-lg w-full lg:w-auto">
          <option value="created_at">Más recientes</option>
          <option value="updated_at">Última actualización</option>
          <option value="likes_count">Más populares</option>
          <option value="title">Alfabético</option>
            </select>
          </div>
          <div class="form-control flex-1">
            <div class="input-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar en mis proyectos..."
            class="input input-bordered input-lg w-full"
          />
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

    <!-- Projects List -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
      <FolderIcon class="mx-auto h-16 w-16 text-base-content/30 mb-4" />
      <h3 class="text-xl font-semibold mb-2">
      {{ statusFilter ? 'No hay proyectos con este estado' : 'No tienes proyectos aún' }}
      </h3>
      <p class="text-base-content/70 mb-4">
      {{ statusFilter ? 'Prueba con otro filtro' : '¡Crea tu primer proyecto y compártelo con la comunidad!' }}
      </p>
      <button
      v-if="!statusFilter"
      class="btn btn-primary"
      @click="showCreateModal = true"
      >
      Crear Mi Primer Proyecto
      </button>
    </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
          @click="viewProjectDetails(project)"
        >
          <figure v-if="project.image_url" class="aspect-video overflow-hidden">
            <img
              :src="project.image_url"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </figure>

          <!-- Overlay de estado en la imagen -->
          <div v-if="project.image_url" class="absolute top-4 left-4">
            <div class="badge" :class="getStatusClass(project.status)">
              <component :is="getStatusIcon(project.status)" class="h-3 w-3 mr-1" />
              {{ getStatusText(project.status) }}
            </div>
          </div>

          <div class="card-body p-6">
            <!-- Header con estado y menú -->
            <div class="flex items-center justify-between mb-4">
              <div v-if="!project.image_url" class="badge badge-lg" :class="getStatusClass(project.status)">
                <component :is="getStatusIcon(project.status)" class="h-4 w-4 mr-2" />
                {{ getStatusText(project.status) }}
              </div>
              <div v-else class="flex-1"></div>

              <div class="dropdown dropdown-end" @click.stop>
                <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle hover:btn-primary">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                  <li>
                    <a @click="viewProjectDetails(project)" class="flex items-center gap-2">
                      <EyeIcon class="h-4 w-4" />
                      Ver Detalles
                    </a>
                  </li>
                  <li>
                    <a @click="editProject(project)" class="flex items-center gap-2">
                      <PencilIcon class="h-4 w-4" />
                      Editar
                    </a>
                  </li>
                  <li>
                    <a @click="shareProject(project)" class="flex items-center gap-2">
                      <ShareIcon class="h-4 w-4" />
                      Compartir
                    </a>
                  </li>
                  <li>
                    <a @click="deleteProjectConfirm(project)" class="flex items-center gap-2 text-error">
                      <TrashIcon class="h-4 w-4" />
                      Eliminar
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Título y descripción -->
            <h2 class="card-title text-xl mb-3 group-hover:text-primary transition-colors">
              {{ project.title }}
            </h2>
            <p class="text-base-content/80 text-sm mb-4 line-clamp-3 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Tags -->
            <div v-if="project.tags && project.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in project.tags.slice(0, 3)"
                :key="tag"
                class="badge badge-outline badge-sm hover:badge-primary transition-all"
              >
                <TagIcon class="h-3 w-3 mr-1" />
                {{ tag }}
              </span>
              <span v-if="project.tags.length > 3" class="badge badge-ghost badge-sm">
                +{{ project.tags.length - 3 }}
              </span>
            </div>

            <!-- Footer con estadísticas y botón -->
            <div class="card-actions justify-between items-center pt-4 border-t border-base-300">
              <div class="flex space-x-4 text-sm text-base-content/60">
                <span class="flex items-center gap-2 hover:text-error transition-colors">
                  <HeartIcon class="w-4 h-4 fill-current" />
                  <span class="font-medium">{{ project.likes_count || 0 }}</span>
                </span>
                <span class="flex items-center gap-2 hover:text-primary transition-colors">
                  <ChatBubbleLeftIcon class="w-4 h-4" />
                  <span class="font-medium">{{ project.comments_count || 0 }}</span>
                </span>
                <span class="flex items-center gap-2 text-base-content/40">
                  <CalendarIcon class="w-4 h-4" />
                  <span class="text-xs">{{ formatDate(project.created_at) }}</span>
                </span>
              </div>

              <button
                class="btn btn-primary btn-sm gap-2 hover:btn-primary-focus"
                @click.stop="viewProjectDetails(project)"
              >
                <EyeIcon class="h-4 w-4" />
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <CreateProjectModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProjectCreated"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="projectToDelete" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Eliminación</h3>
        <p class="py-4">
          ¿Estás seguro de que quieres eliminar el proyecto "{{ projectToDelete.title }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="projectToDelete = null">
            Cancelar
          </button>
          <button
            class="btn btn-error"
            :class="{ 'loading': deleting }"
            @click="handleDeleteProject"
          >
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import CreateProjectModal from '../components/CreateProjectModal.vue'
import type { Project } from '@/types'
import {
  PlusIcon,
  FolderIcon,
  CheckIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  TagIcon,
  RocketLaunchIcon,
  DocumentIcon,
  ExclamationCircleIcon
} from '@/icons'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const { profile } = storeToRefs(authStore)
const { loading } = storeToRefs(projectsStore)

const userProjects = ref<Project[]>([])
const showCreateModal = ref(false)
const statusFilter = ref('')
const sortBy = ref('created_at')
const searchQuery = ref('')
const projectToDelete = ref<Project | null>(null)
const deleting = ref(false)

const completedCount = computed(() =>
  userProjects.value.filter(p => p.status === 'completed').length
)

const inProgressCount = computed(() =>
  userProjects.value.filter(p => p.status === 'in_progress').length
)

const totalLikes = computed(() =>
  userProjects.value.reduce((sum, p) => sum + (p.likes_count || 0), 0)
)

const filteredProjects = computed(() => {
  let filtered = userProjects.value

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Sort projects
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'updated_at':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      case 'likes_count':
        return (b.likes_count || 0) - (a.likes_count || 0)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return filtered
})

const fetchUserProjects = async () => {
  if (!profile.value) return

  try {
    const projects = await projectsStore.fetchUserProjects(profile.value.id)
    userProjects.value = projects
  } catch (error) {
    console.error('Error fetching user projects:', error)
  }
}

const handleProjectCreated = () => {
  showCreateModal.value = false
  fetchUserProjects()
}

// Navigate to project details
const viewProjectDetails = (project: Project) => {
  router.push(`/projects/${project.id}`)
}

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mes`
  return `${Math.floor(diffDays / 365)}año`
}

// Get status icon component
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, any> = {
    'planning': RocketLaunchIcon,
    'in_progress': ClockIcon,
    'completed': CheckIcon,
    'on_hold': ExclamationCircleIcon
  }
  return iconMap[status] || DocumentIcon
}

const editProject = (project: Project) => {
  router.push(`/projects/${project.id}/edit`)
}

const deleteProjectConfirm = (project: Project) => {
  projectToDelete.value = project
}

const handleDeleteProject = async () => {
  if (!projectToDelete.value) return

  deleting.value = true
  try {
    await projectsStore.deleteProject(projectToDelete.value.id)
    await fetchUserProjects()
    projectToDelete.value = null
  } catch (error) {
    console.error('Error deleting project:', error)
  } finally {
    deleting.value = false
  }
}

const shareProject = (project: Project) => {
  // Simple share functionality
  if (navigator.share) {
    navigator.share({
      title: project.title,
      text: project.description,
      url: window.location.origin + `/project/${project.id}`
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${project.title} - ${window.location.origin}/project/${project.id}`)
    // TODO: Show toast notification
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    planning: 'badge-warning',
    in_progress: 'badge-info',
    completed: 'badge-success',
    on_hold: 'badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const getStatusText = (status: string) => {
  const texts = {
    planning: 'Planificando',
    in_progress: 'En Progreso',
    completed: 'Completado',
    on_hold: 'En Pausa'
  }
  return texts[status as keyof typeof texts] || status
}

onMounted(() => {
  fetchUserProjects()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
