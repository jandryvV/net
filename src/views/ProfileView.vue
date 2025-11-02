<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center space-y-4">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-base-content/60">{{ t('profile.loading') }}</p>
      </div>
    </div>

    <div v-else-if="profile" class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Cover Section -->
      <div class="relative mb-8">
        <div class="h-48 bg-linear-to-r from-primary to-secondary rounded-2xl shadow-xl"></div>
        <div class="absolute -bottom-16 left-8">
          <div class="avatar">
            <div class="w-32 h-32 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2 shadow-2xl">
              <img
                :src="profile.avatar_url || 'https://via.placeholder.com/128?text=' + (profile.full_name?.charAt(0) || 'U')"
                :alt="profile.full_name"
                class="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Info Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <!-- Left Column - Profile Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h1 class="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {{ profile.full_name || 'Usuario' }}
                  </h1>
                  <div class="flex items-center gap-2 text-base-content/70 mb-3">
                    <EnvelopeIcon class="h-5 w-5" />
                    {{ profile.email }}
                  </div>
                  <div class="flex items-center gap-2 text-base-content/60 text-sm">
                    <CalendarIcon class="h-4 w-4" />
                    {{ t('profile.memberSince') }} {{ formatDate(profile.created_at) }}
                  </div>
                </div>
                <button
                  class="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  @click="showEditModal = true"
                >
                  <PencilSquareIcon class="h-5 w-5" />
                  {{ t('profile.edit') }}
                </button>
              </div>

              <div v-if="profile.bio" class="bg-base-200 rounded-xl p-4 mt-4">
                <div class="flex items-start gap-2">
                  <DocumentTextIcon class="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 class="font-semibold text-lg mb-2">{{ t('profile.aboutMe') }}</h3>
                    <p class="text-base-content/80 leading-relaxed">{{ profile.bio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Projects Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
                <FolderIcon class="h-6 w-6 text-primary" />
                {{ t('profile.recentProjects') }}
              </h2>
              <div class="space-y-3">
                <div v-if="recentProjects.length === 0" class="text-center py-8 text-base-content/60">
                  <RocketLaunchIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{{ t('profile.noProjects') }}</p>
                  <p class="text-sm">{{ t('profile.createFirst') }}</p>
                </div>
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                >
                  <div class="avatar placeholder">
                    <div class="w-10 h-10 rounded-lg bg-primary/20">
                      <img v-if="project.image_url" :src="project.image_url" alt="" class="rounded-lg" />
                      <RocketLaunchIcon v-else class="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold truncate">{{ project.title }}</h4>
                    <div class="flex items-center gap-2 text-xs text-base-content/60">
                      <span :class="['badge badge-xs', getStatusClass(project.status)]">
                        {{ getStatusText(project.status) }}
                      </span>
                      <span>{{ formatDate(project.created_at) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 text-sm text-base-content/60">
                    <HeartIcon class="h-4 w-4" />
                    {{ project.likes_count || 0 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Stats & Quick Actions -->
        <div class="space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 gap-4">
            <div class="card bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg">
              <div class="card-body text-center">
                <FolderIcon class="h-12 w-12 text-primary mx-auto mb-2" />
                <div class="text-3xl font-bold text-primary">{{ projectCount }}</div>
                <div class="text-sm text-base-content/70">{{ t('profile.stats.projectsCreated') }}</div>
              </div>
            </div>

            <div class="card bg-linear-to-br from-secondary/20 to-secondary/5 border border-secondary/20 shadow-lg">
              <div class="card-body text-center">
                <HeartIcon class="h-12 w-12 text-secondary mx-auto mb-2" />
                <div class="text-3xl font-bold text-secondary">{{ totalLikes }}</div>
                <div class="text-sm text-base-content/70">{{ t('profile.stats.likesReceived') }}</div>
              </div>
            </div>

            <div class="card bg-linear-to-br from-accent/20 to-accent/5 border border-accent/20 shadow-lg">
              <div class="card-body text-center">
                <ChatBubbleLeftIcon class="h-12 w-12 text-accent mx-auto mb-2" />
                <div class="text-3xl font-bold text-accent">{{ totalComments }}</div>
                <div class="text-sm text-base-content/70">{{ t('profile.stats.comments') }}</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4 flex items-center gap-2">
                <BoltIcon class="h-5 w-5 text-primary" />
                {{ t('profile.quickActions') }}
              </h3>
              <div class="space-y-3">
                <RouterLink to="/projects/create" class="btn btn-outline btn-block gap-2 justify-start">
                  <PlusIcon class="h-4 w-4" />
                  {{ t('profile.createProject') }}
                </RouterLink>
                <RouterLink to="/my-projects" class="btn btn-outline btn-block gap-2 justify-start">
                  <EyeIcon class="h-4 w-4" />
                  {{ t('profile.viewProjects') }}
                </RouterLink>
                <RouterLink to="/settings" class="btn btn-outline btn-block gap-2 justify-start">
                  <Cog6ToothIcon class="h-4 w-4" />
                  {{ t('profile.settings') }}
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal modal-open">
      <div class="modal-box w-11/12 max-w-2xl">
        <div class="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6 border border-primary/20">
          <div class="flex items-center gap-4">
            <div class="bg-primary/20 p-3 rounded-full">
              <UserIcon class="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-1">{{ t('profile.editTitle') }}</h3>
              <p class="text-base-content/60">{{ t('profile.editSubtitle') }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="flex flex-col gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-lg font-semibold flex items-center gap-2">
                <UserIcon class="h-5 w-5 text-primary" />
                {{ t('profile.fullName') }}
              </span>
            </label>
            <input
              v-model="editForm.full_name"
              type="text"
              class="input input-bordered input-lg focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md w-full"
              :placeholder="t('profile.placeholders.fullName')"
              required
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-lg font-semibold flex items-center gap-2">
                <DocumentTextIcon class="h-5 w-5 text-primary" />
                {{ t('profile.bio') }}
              </span>
            </label>
            <textarea
              v-model="editForm.bio"
              class="textarea textarea-bordered h-32 text-base focus:textarea-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md resize-none w-full"
              :placeholder="t('profile.placeholders.bio')"
              maxlength="500"
            ></textarea>
            <div class="label">
              <span class="label-text-alt text-sm">{{ (editForm.bio || '').length }}/500 {{ t('home.createProject.charactersCount').split('/')[1] }}</span>
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-lg font-semibold flex items-center gap-2">
                <PhotoIcon class="h-5 w-5 text-primary" />
                {{ t('profile.avatarUrl') }}
              </span>
            </label>
            <input
              v-model="editForm.avatar_url"
              type="url"
              class="input input-bordered input-lg focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md w-full"
              :placeholder="t('profile.placeholders.avatarUrl')"
            />
            <div v-if="editForm.avatar_url" class="mt-4">
              <div class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-primary/30 flex flex-col items-center">
                <img
                  :src="editForm.avatar_url"
                  :alt="t('common.imagePreview')"
                  class="w-24 h-24 rounded-full mx-auto shadow-md"
                  @error="avatarError = true"
                />
                <p v-if="avatarError" class="text-error text-sm mt-2 text-center flex items-center justify-center gap-1">
                  <ExclamationTriangleIcon class="h-4 w-4" />
                  {{ t('common.imageError') }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-error shadow-lg w-full">
            <ExclamationTriangleIcon class="h-6 w-6" />
            <div>
              <h3 class="font-bold">{{ t('common.error') }}</h3>
              <div class="text-xs">{{ error }}</div>
            </div>
          </div>

          <div class="flex flex-col gap-4 pt-6 border-t border-base-300 w-full sm:flex-row sm:justify-end">
            <button
              type="button"
              class="btn btn-outline btn-lg w-full sm:w-auto gap-2"
              @click="showEditModal = false"
            >
              <XMarkIcon class="h-5 w-5" />
              {{ t('profile.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-lg w-full sm:w-auto gap-2"
              :class="{ 'loading': updating }"
              :disabled="updating"
            >
              <CheckIcon v-if="!updating" class="h-5 w-5" />
              <span v-if="updating" class="loading loading-spinner loading-sm"></span>
              {{ updating ? t('profile.saving') : t('profile.save') }}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="showEditModal = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useTranslation } from '@/composables/useTranslation'
import type { Project } from '@/types'
import {
  EnvelopeIcon,
  CalendarIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  ClockIcon,
  RocketLaunchIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  FolderIcon,
  BoltIcon,
  PlusIcon,
  EyeIcon,
  Cog6ToothIcon,
  StarIcon,
  UserIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const { t } = useTranslation()

const { profile, loading } = storeToRefs(authStore)

const showEditModal = ref(false)
const updating = ref(false)
const error = ref('')
const avatarError = ref(false)
const userProjects = ref<Project[]>([])

const editForm = ref({
  full_name: '',
  bio: '',
  avatar_url: ''
})

const projectCount = computed(() => userProjects.value.length)
const totalLikes = computed(() =>
  userProjects.value.reduce((sum, p) => sum + (p.likes_count || 0), 0)
)
const totalComments = computed(() =>
  userProjects.value.reduce((sum, p) => sum + (p.comments_count || 0), 0)
)
const completedProjects = computed(() =>
  userProjects.value.filter(p => p.status === 'completed').length
)
const recentProjects = computed(() =>
  userProjects.value.slice(0, 5)
)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

const loadUserProjects = async () => {
  if (!profile.value) return

  try {
    const projects = await projectsStore.fetchUserProjects(profile.value.id)
    userProjects.value = projects
  } catch (error) {
    console.error('Error loading user projects:', error)
  }
}

const handleUpdateProfile = async () => {
  if (!profile.value) return

  updating.value = true
  error.value = ''

  try {
    await authStore.updateProfile({
      full_name: editForm.value.full_name,
      bio: editForm.value.bio || undefined,
      avatar_url: editForm.value.avatar_url || undefined
    })

    showEditModal.value = false
  } catch (err) {
    error.value = 'Error al actualizar el perfil'
  } finally {
    updating.value = false
  }
}

// Initialize edit form when modal opens
const initEditForm = () => {
  if (profile.value) {
    editForm.value = {
      full_name: profile.value.full_name,
      bio: profile.value.bio || '',
      avatar_url: profile.value.avatar_url || ''
    }
  }
}

onMounted(async () => {
  await loadUserProjects()
  initEditForm()
})

// Watch for profile changes to update edit form
watch(() => profile.value, () => {
  initEditForm()
}, { deep: true })

// Watch for modal open to reinitialize form
watch(() => showEditModal.value, (isOpen: boolean) => {
  if (isOpen) {
    initEditForm()
    error.value = ''
  }
})
</script>
