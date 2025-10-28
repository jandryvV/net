<template>
  <div class="min-h-screen bg-base-200">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Edit Project Form -->
    <div v-else class="container mx-auto px-4 py-6 max-w-4xl">
      <!-- Header -->
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
              <li><router-link :to="`/projects/${project?.id}`">{{ project?.title || 'Proyecto' }}</router-link></li>
              <li>Editar</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Formulario de Edición -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="bg-primary/10 p-3 rounded-full">
              <PencilIcon class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Editar Proyecto</h1>
              <p class="text-base-content/60">Actualiza la información de tu proyecto</p>
            </div>
          </div>

          <form @submit.prevent="updateProject" class="space-y-6">
            <!-- Título -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-base-content flex items-center gap-2">
                  <DocumentIcon class="h-4 w-4" />
                  Título del proyecto *
                </span>
              </label>
              <input
                v-model="editForm.title"
                type="text"
                placeholder="Nombre de tu proyecto"
                class="input input-bordered input-lg w-full focus:input-primary"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Estado -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-base-content flex items-center gap-2">
                    <ClockIcon class="h-4 w-4" />
                    Estado del proyecto
                  </span>
                </label>
                <select v-model="editForm.status" class="select select-bordered select-lg w-full focus:select-primary">
                  <option value="planning">Planificando</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="on_hold">En Pausa</option>
                </select>
              </div>

              <!-- URL de imagen -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-base-content flex items-center gap-2">
                    <PhotoIcon class="h-4 w-4" />
                    Imagen del proyecto
                  </span>
                </label>
                <input
                  v-model="editForm.image_url"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  class="input input-bordered input-lg w-full focus:input-primary"
                />
              </div>
            </div>

            <!-- Vista previa de imagen -->
            <div v-if="editForm.image_url" class="form-control">
              <div class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300">
                <p class="text-sm font-medium text-base-content/60 mb-2">Vista previa:</p>
                <img
                  :src="editForm.image_url"
                  alt="Vista previa"
                  class="w-full h-40 object-cover rounded-lg"
                  @error="editForm.image_url = ''"
                />
              </div>
            </div>

            <!-- Descripción -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-base-content flex items-center gap-2">
                  <ChatBubbleLeftIcon class="h-4 w-4" />
                  Descripción *
                </span>
              </label>
              <textarea
                v-model="editForm.description"
                placeholder="Describe tu proyecto, objetivos, tecnologías..."
                class="textarea textarea-bordered textarea-lg h-32 w-full focus:textarea-primary resize-none"
                required
              ></textarea>
              <label class="label">
                <span class="label-text-alt text-base-content/40">{{ editForm.description.length }}/500 caracteres</span>
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Etiquetas -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-base-content flex items-center gap-2">
                    <TagIcon class="h-4 w-4" />
                    Tecnologías y etiquetas
                  </span>
                </label>
                <input
                  v-model="editForm.tags"
                  type="text"
                  placeholder="React, Node.js, TypeScript..."
                  class="input input-bordered input-lg w-full focus:input-primary"
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/40">Separadas por comas</span>
                </label>
              </div>

              <!-- Miembros del equipo -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold text-base-content flex items-center gap-2">
                    <UsersIcon class="h-4 w-4" />
                    Colaboradores
                  </span>
                </label>
                <input
                  v-model="editForm.team_members"
                  type="text"
                  placeholder="juan@email.com, maria@email.com..."
                  class="input input-bordered input-lg w-full focus:input-primary"
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/40">Emails separados por comas</span>
                </label>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-3 justify-between pt-6 border-t border-base-300">
              <button
                type="button"
                class="btn btn-error btn-outline"
                @click="showDeleteModal = true"
              >
                <TrashIcon class="h-5 w-5" />
                Eliminar Proyecto
              </button>

              <div class="flex gap-3">
                <button
                  type="button"
                  class="btn btn-ghost btn-lg"
                  @click="$router.back()"
                >
                  <XMarkIcon class="h-5 w-5" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="!editForm.title.trim() || !editForm.description.trim() || isLoading"
                >
                  <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                  <CheckIcon v-else class="h-5 w-5" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">¿Eliminar proyecto?</h3>
        <p class="text-base-content/70 mb-6">
          Esta acción no se puede deshacer. El proyecto y todos sus comentarios se eliminarán permanentemente.
        </p>
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            class="btn btn-error"
            :disabled="isDeleting"
            @click="deleteProject"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
            Eliminar
          </button>
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
import type { Project } from '@/types'
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentIcon,
  ClockIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  UsersIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  FolderIcon
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
const isLoading = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)

// Computed
const projectId = computed(() => route.params.id as string)
const project = computed(() => projects.value.find(p => p.id === projectId.value))

const isProjectOwner = computed(() => {
  return user.value && project.value && project.value.created_by === user.value.id
})

// Form data
const editForm = ref({
  title: '',
  description: '',
  status: 'planning' as 'planning' | 'in_progress' | 'completed' | 'on_hold',
  image_url: '',
  tags: '',
  team_members: ''
})

// Methods
const initForm = () => {
  if (project.value) {
    editForm.value = {
      title: project.value.title,
      description: project.value.description,
      status: project.value.status as 'planning' | 'in_progress' | 'completed' | 'on_hold',
      image_url: project.value.image_url || '',
      tags: project.value.tags?.join(', ') || '',
      team_members: project.value.team_members?.join(', ') || ''
    }
  }
}

const updateProject = async () => {
  if (!project.value || !user.value || !isProjectOwner.value) return

  isLoading.value = true
  try {
    // Procesar tags
    const tags = editForm.value.tags
      ? editForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : []

    // Procesar miembros del equipo
    const teamMembers = editForm.value.team_members
      ? editForm.value.team_members.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : []

    await projectsStore.updateProject(project.value.id, {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status,
      image_url: editForm.value.image_url || undefined,
      tags,
      team_members: teamMembers
    })

    // Redirigir de vuelta al proyecto
    router.push(`/projects/${project.value.id}`)
  } catch (error) {
    console.error('Error updating project:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteProject = async () => {
  if (!project.value || !user.value || !isProjectOwner.value) return

  isDeleting.value = true
  try {
    await projectsStore.deleteProject(project.value.id)
    router.push('/')
  } catch (error) {
    console.error('Error deleting project:', error)
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true

    // Asegurar que tenemos un usuario autenticado
    if (!user.value) {
      router.push('/login')
      return
    }

    // Cargar proyectos y esperar a que se complete
    await projectsStore.fetchProjects()

    // Buscar el proyecto específico
    const foundProject = projects.value.find(p => p.id === projectId.value)

    if (!foundProject) {
      console.error('Project not found with ID:', projectId.value)
      router.push('/')
      return
    }

    // Verificar si el usuario es el propietario
    if (foundProject.created_by !== user.value.id) {
      console.log('User is not project owner')
      router.push(`/projects/${projectId.value}`)
      return
    }

    // Inicializar el formulario con los datos del proyecto
    initForm()
  } catch (error) {
    console.error('Error loading project:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>
