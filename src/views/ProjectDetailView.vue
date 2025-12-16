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
          <h2 class="text-2xl font-bold mb-2">{{ t('projectDetail.notFound.title') }}</h2>
          <p class="text-base-content/70 mb-4">
            {{ t('projectDetail.notFound.message') }}
          </p>
          <button
            class="btn btn-primary"
            @click="$router.push('/')"
          >
            {{ t('projectDetail.notFound.backHome') }}
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
            {{ t('projectDetail.back') }}
          </button>
          <div class="breadcrumbs text-sm">
            <ul>
              <li><router-link to="/">{{ t('projectDetail.breadcrumb.home') }}</router-link></li>
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
                <h3 class="text-lg font-semibold mb-3">{{ t('projectDetail.sections.technologies') }}</h3>
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
                    <span class="hidden sm:inline">{{ t('projectDetail.sections.likes') }}</span>
                  </button>

                  <button
                    class="btn btn-ghost flex items-center gap-2"
                    @click="scrollToComments"
                  >
                    <ChatBubbleLeftIcon class="h-6 w-6" />
                    <span class="font-semibold">{{ project.comments_count || 0 }}</span>
                    <span class="hidden sm:inline">{{ t('projectDetail.sections.comments') }}</span>
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    v-if="isProjectOwner"
                    class="btn btn-outline btn-sm"
                    @click="editProject"
                  >
                    <PencilIcon class="h-4 w-4" />
                    {{ t('projectDetail.sections.edit') }}
                  </button>
                  <button
                    v-if="isProjectOwner"
                    class="btn btn-primary"
                    @click="collaborateProject"
                  >
                    <UsersIcon class="h-5 w-5" />
                    {{ t('projectDetail.sections.collaborate') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de Comentarios -->
          <div ref="commentsSection" class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="text-xl font-bold mb-4">
                {{ t('projectDetail.comments.title') }} ({{ project.comments_count || 0 }})
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
                      :placeholder="t('projectDetail.comments.placeholder')"
                      class="textarea textarea-bordered w-full h-20"
                    ></textarea>
                    <div class="flex justify-end mt-2">
                      <button
                        class="btn btn-primary btn-sm"
                        :disabled="!newCommentText.trim() || isLoadingComment"
                        @click="addComment"
                      >
                        <span v-if="isLoadingComment" class="loading loading-spinner loading-xs"></span>
                        {{ t('projectDetail.comments.submit') }}
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

                    <!-- Modo vista -->
                    <div v-if="editingCommentId !== comment.id">
                      <p class="text-sm">{{ comment.content }}</p>
                    </div>

                    <!-- Modo edición -->
                    <div v-else>
                      <textarea
                        v-model="editingCommentText"
                        class="textarea textarea-bordered w-full text-sm mb-2"
                        rows="2"
                      ></textarea>
                      <div class="flex gap-2">
                        <button
                          class="btn btn-primary btn-xs"
                          @click="saveEditComment"
                          :disabled="!editingCommentText.trim()"
                        >
                          {{ t('projectDetail.comments.save') }}
                        </button>
                        <button
                          class="btn btn-ghost btn-xs"
                          @click="cancelEditComment"
                        >
                          {{ t('projectDetail.comments.cancel') }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Dropdown menu para el creador -->
                  <div v-if="isCommentOwner(comment) && editingCommentId !== comment.id" class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
                      <li>
                        <a @click="startEditComment(comment)">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          {{ t('projectDetail.comments.edit') }}
                        </a>
                      </li>
                      <li>
                        <a @click="confirmDeleteComment(comment.id)" class="text-error">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          {{ t('projectDetail.comments.delete') }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-base-content/60">
                <ChatBubbleLeftIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{{ t('projectDetail.comments.empty') }}</p>
              </div>
            </div>
          </div>

          <!-- Enlace a Tareas -->
          <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" @click="$router.push(`/projects/${project.id}/tasks`)">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-bold mb-2">{{ t('projectDetail.tasks.title') }}</h3>
                  <p class="text-base-content/60">{{ t('projectDetail.tasks.description') }}</p>
                  <div class="mt-4">
                    <div class="stats shadow">
                      <div class="stat p-4">
                        <div class="stat-title text-xs">{{ t('projectDetail.tasks.stats.total') }}</div>
                        <div class="stat-value text-2xl">{{ tasks.length }}</div>
                      </div>
                      <div class="stat p-4">
                        <div class="stat-title text-xs">{{ t('projectDetail.tasks.stats.completed') }}</div>
                        <div class="stat-value text-2xl text-success">{{ tasks.filter(t => t.status === 'done').length }}</div>
                      </div>
                      <div class="stat p-4">
                        <div class="stat-title text-xs">{{ t('projectDetail.tasks.stats.inProgress') }}</div>
                        <div class="stat-value text-2xl text-warning">{{ tasks.filter(t => t.status === 'in_progress').length }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Información del proyecto -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">{{ t('projectDetail.sidebar.details') }}</h3>

              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-base-content/60">{{ t('projectDetail.sidebar.created') }}</span>
                  <p class="text-sm">{{ formatDate(project.created_at) }}</p>
                </div>

                <div>
                  <span class="text-sm font-medium text-base-content/60">{{ t('projectDetail.sidebar.updated') }}</span>
                  <p class="text-sm">{{ formatDate(project.updated_at) }}</p>
                </div>

                <div v-if="teamMembers.length > 0">
                  <span class="text-sm font-medium text-base-content/60 mb-3 block">{{ t('projectDetail.sidebar.team') }} ({{ teamMembers.length }}):</span>
                  <div class="space-y-2">
                    <div
                      v-for="member in teamMembers"
                      :key="member.id"
                      class="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <div class="avatar">
                        <div class="w-8 h-8 rounded-full">
                          <img
                            :src="member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random`"
                            :alt="member.full_name"
                          />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{{ member.full_name }}</p>
                        <p class="text-xs text-base-content/60 truncate">{{ member.email }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historial de cambios -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">{{ t('projectDetail.sidebar.history') }}</h3>
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
              <div v-else class="text-sm text-base-content/60">{{ t('projectDetail.sidebar.historyEmpty') }}</div>
            </div>
          </div>

          <!-- Proyectos relacionados -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="font-bold text-lg mb-4">{{ t('projectDetail.sidebar.moreProjects') }}</h3>

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
                {{ t('projectDetail.sidebar.noRelated') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Collaborator Modal -->
    <InviteCollaboratorModal
      v-if="project"
      ref="inviteModal"
      :project-id="project.id"
      :project-title="project.title"
      @invited="onUserInvited"
    />

    <!-- Delete Comment Confirmation Modal -->
    <div v-if="showDeleteCommentModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">{{ t('projectDetail.comments.deleteModal.title') }}</h3>
        <p class="text-base-content/70 mb-6">
          {{ t('projectDetail.comments.deleteModal.message') }}
        </p>
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="showDeleteCommentModal = false; commentToDelete = null"
          >
            {{ t('projectDetail.comments.deleteModal.cancel') }}
          </button>
          <button
            class="btn btn-error"
            @click="deleteComment"
          >
            {{ t('projectDetail.comments.deleteModal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useTranslation } from '@/composables/useTranslation'
import { supabase } from '@/lib/supabase'
import type { Project, Comment, Task } from '@/types'
import InviteCollaboratorModal from '@/components/InviteCollaboratorModal.vue'
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
const { t } = useTranslation()

const { profile } = storeToRefs(authStore)
const { projects } = storeToRefs(projectsStore)

const user = computed(() => profile.value)

// State
const loading = ref(true)
const isLoadingComment = ref(false)
const newCommentText = ref('')
const comments = ref<Comment[]>([])
const tasks = ref<Task[]>([])
const teamMembers = ref<any[]>([])
const commentsSection = ref<HTMLElement>()
const inviteModal = ref<InstanceType<typeof InviteCollaboratorModal> | null>(null)
const editingCommentId = ref<string | null>(null)
const editingCommentText = ref('')
const showDeleteCommentModal = ref(false)
const commentToDelete = ref<string | null>(null)
let refreshInterval: number | null = null

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
  const proj = project.value as any // Cast para acceder a history
  if (proj.history && Array.isArray(proj.history) && proj.history.length > 0) {
    return proj.history.slice(-5).reverse().map((h: any) => ({
      title: h.title || h.action || 'Cambio',
      detail: h.detail || h.summary || '',
      time: h.time || new Date(h.timestamp || h.date || h.at).toLocaleString()
    }))
  }

  // Fallback: created / updated
  const entries = []
  if (project.value.created_at) {
    entries.push({ title: t('projectDetail.sidebar.historyCreated'), detail: `${t('projectDetail.sidebar.historyCreatedBy')} ${getProjectCreatorName(project.value)}`, time: formatDate(project.value.created_at) })
  }
  if (project.value.updated_at && project.value.updated_at !== project.value.created_at) {
    entries.push({ title: t('projectDetail.sidebar.historyUpdated'), detail: `${t('projectDetail.sidebar.historyUpdated')}`, time: formatDate(project.value.updated_at) })
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
    'planning': t('projectDetail.status.planning'),
    'in_progress': t('projectDetail.status.inProgress'),
    'completed': t('projectDetail.status.completed'),
    'on_hold': t('projectDetail.status.onHold')
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

const refreshCurrentProject = async () => {
  if (!projectId.value) return

  try {
    await projectsStore.refreshProject(projectId.value)
  } catch (error) {
    console.error('Error refreshing project:', error)
  }
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
    // Refrescar el proyecto para obtener contadores actualizados
    await refreshCurrentProject()
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
    // Refrescar el proyecto para obtener contadores actualizados
    await refreshCurrentProject()
  } catch (error) {
    console.error('Error adding comment:', error)
  } finally {
    isLoadingComment.value = false
  }
}
const startEditComment = (comment: Comment) => {
  editingCommentId.value = comment.id
  editingCommentText.value = comment.content
}

const cancelEditComment = () => {
  editingCommentId.value = null
  editingCommentText.value = ''
}

const saveEditComment = async () => {
  if (!editingCommentId.value || !editingCommentText.value.trim()) return

  try {
    const updatedComment = await projectsStore.updateComment(editingCommentId.value, editingCommentText.value)
    const index = comments.value.findIndex(c => c.id === editingCommentId.value)
    if (index !== -1) {
      comments.value[index] = updatedComment
    }
    editingCommentId.value = null
    editingCommentText.value = ''
  } catch (error) {
    console.error('Error updating comment:', error)
  }
}

const confirmDeleteComment = (commentId: string) => {
  commentToDelete.value = commentId
  showDeleteCommentModal.value = true
}

const deleteComment = async () => {
  if (!commentToDelete.value || !project.value) return

  try {
    await projectsStore.deleteComment(commentToDelete.value, project.value.id)
    comments.value = comments.value.filter(c => c.id !== commentToDelete.value)
    showDeleteCommentModal.value = false
    commentToDelete.value = null
    // Refrescar el proyecto para obtener contadores actualizados
    await refreshCurrentProject()
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const isCommentOwner = (comment: Comment): boolean => {
  return user.value?.id === comment.user_id
}
const scrollToComments = () => {
  commentsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Cargar tareas solo para mostrar estadísticas

const editProject = () => {
  // Navegar a la página de edición del proyecto
  router.push(`/projects/${project.value?.id}/edit`)
}

const collaborateProject = () => {
  // Mostrar modal de invitación
  if (inviteModal.value && project.value) {
    inviteModal.value.showModal()
  }
}

const onUserInvited = () => {
  // Refrescar proyecto para actualizar contadores si es necesario
  refreshCurrentProject()
  // Recargar miembros del equipo
  loadTeamMembers()
}

const loadTeamMembers = async () => {
  if (!project.value?.team_members || project.value.team_members.length === 0) {
    teamMembers.value = []
    return
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', project.value.team_members)

    if (error) throw error
    teamMembers.value = data || []
  } catch (error) {
    console.error('Error loading team members:', error)
    teamMembers.value = []
  }
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

    // Cargar tareas del proyecto
    tasks.value = await projectsStore.fetchTasks(projectId.value)

    // Cargar miembros del equipo
    await loadTeamMembers()

    // Refrescar proyecto cada 15 segundos para obtener contadores actualizados
    refreshInterval = setInterval(() => {
      refreshCurrentProject()
    }, 15000)
  } catch (error) {
    console.error('Error loading project:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  // Limpiar el intervalo cuando el componente se desmonta
  if (refreshInterval) {
    clearInterval(refreshInterval)
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
