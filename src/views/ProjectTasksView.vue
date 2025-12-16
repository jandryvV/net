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
          <h2 class="text-2xl font-bold mb-2">{{ t('tasks.projectNotFound') }}</h2>
          <p class="text-base-content/70 mb-4">
            {{ t('tasks.projectNotFoundDesc') }}
          </p>
          <button class="btn btn-primary" @click="$router.push('/')">
            {{ t('tasks.backHome') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tasks View -->
    <div v-else class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header con navegación -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <button class="btn btn-ghost btn-sm" @click="goBack">
            <ArrowLeftIcon class="h-5 w-5" />
            {{ t('tasks.back') }}
          </button>
          <div class="breadcrumbs text-sm">
            <ul>
              <li><router-link to="/">{{ t('nav.home') }}</router-link></li>
              <li><router-link :to="`/projects/${projectId}`">{{ project.title }}</router-link></li>
              <li>{{ t('tasks.title') }}</li>
            </ul>
          </div>
        </div>

        <!-- Project Info Header -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <div class="flex items-center justify-between">
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
                  <h1 class="text-2xl font-bold">{{ project.title }}</h1>
                  <p class="text-sm text-base-content/60">{{ t('tasks.taskManagement') }}</p>
                </div>
              </div>
              <div class="badge badge-lg" :class="getStatusColor(project.status)">
                {{ getProjectStatusText(project.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-lg">{{ t('tasks.progress.title') }}</h3>
              <span class="text-sm text-base-content/60">
                {{ completedTasksCount }} {{ t('tasks.progress.of') }} {{ totalTasksCount }} {{ t('tasks.progress.completed') }}
              </span>
            </div>
            <progress
              class="progress progress-primary w-full"
              :value="completedTasksCount"
              :max="totalTasksCount || 1"
            ></progress>
            <div class="flex justify-between text-xs text-base-content/60 mt-2">
              <span>{{ progressPercentage }}% {{ t('tasks.progress.completed') }}</span>
              <span>{{ totalTasksCount }} {{ t('tasks.progress.total') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <KanbanBoard
            :tasks="tasks"
            :project-id="projectId"
            :can-create="isProjectOwner"
            :can-edit="isProjectOwner"
            :can-move="isTeamMember"
            @create="handleCreateTask"
            @update="handleUpdateTask"
            @delete="handleDeleteTask"
          />
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
import { useTranslation } from '@/composables/useTranslation'
import type { Project, Task } from '@/types'
import KanbanBoard from '@/components/KanbanBoard.vue'
import { ArrowLeftIcon } from '@/icons'

const { t } = useTranslation()
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const { profile } = storeToRefs(authStore)
const { projects } = storeToRefs(projectsStore)

const user = computed(() => profile.value)

// State
const loading = ref(true)
const tasks = ref<Task[]>([])

// Computed
const projectId = computed(() => route.params.id as string)
const project = computed(() => projects.value.find(p => p.id === projectId.value))

const isProjectOwner = computed(() => {
  if (!user.value || !project.value) return false
  return project.value.created_by === user.value.id
})

const isTeamMember = computed(() => {
  if (!user.value || !project.value) return false
  return project.value.team_members?.includes(user.value.id) || isProjectOwner.value
})

const totalTasksCount = computed(() => tasks.value.length)
const completedTasksCount = computed(() =>
  tasks.value.filter(task => task.status === 'done').length
)
const progressPercentage = computed(() => {
  if (totalTasksCount.value === 0) return 0
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100)
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
  return t(`project.status.${status}`)
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'planning': 'badge-info',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'on_hold': 'badge-ghost'
  }
  return colorMap[status] || 'badge-ghost'
}

const goBack = () => {
  router.push(`/projects/${projectId.value}`)
}

// Task management functions
const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
  if (!isProjectOwner.value) {
    alert('❌ Solo el creador del proyecto puede crear tareas')
    return
  }

  try {
    console.log('Creating task with data:', taskData)
    const newTask = await projectsStore.createTask(taskData)
    console.log('Task created successfully:', newTask)
    tasks.value.unshift(newTask)
    alert('✅ Tarea creada exitosamente')
  } catch (error: any) {
    console.error('Error creating task:', error)
    console.error('Error details:', error.message)

    let errorMessage = 'Error al crear la tarea'
    if (error.message?.includes('relation "tasks" does not exist')) {
      errorMessage = '❌ La tabla "tasks" no existe en Supabase.\n\nPor favor ejecuta el script SQL en:\nscripts/tasks-table-setup.sql'
    } else if (error.message?.includes('not authenticated')) {
      errorMessage = '❌ Debes estar autenticado para crear tareas'
    } else if (error.code === '42501') {
      errorMessage = '❌ No tienes permisos para crear tareas en este proyecto'
    } else if (error.message) {
      errorMessage = `❌ Error: ${error.message}`
    }

    alert(errorMessage)
  }
}

const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const updatedTask = await projectsStore.updateTask(taskId, updates)
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1 && updatedTask) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const handleDeleteTask = async (taskId: string) => {
  try {
    await projectsStore.deleteTask(taskId)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await projectsStore.fetchProjects()

    if (!project.value) {
      router.push('/')
      return
    }

    // Cargar tareas del proyecto
    tasks.value = await projectsStore.fetchTasks(projectId.value)
  } catch (error) {
    console.error('Error loading project tasks:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>
