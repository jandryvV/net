<template>
  <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
    <figure v-if="project.image_url" class="aspect-video">
      <img
        :src="project.image_url"
        :alt="project.title"
        class="w-full h-full object-cover"
      />
    </figure>

    <div class="card-body">
      <!-- Project Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center space-x-3">
          <div class="avatar">
            <div class="w-8 h-8 rounded-full">
              <img
                :src="project.creator?.avatar_url || 'https://via.placeholder.com/32'"
                :alt="project.creator?.full_name || 'Usuario'"
              />
            </div>
          </div>
          <div>
            <p class="font-semibold text-sm">{{ project.creator?.full_name || 'Usuario' }}</p>
            <p class="text-xs text-base-content/60">{{ formatDate(project.created_at) }}</p>
          </div>
        </div>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </div>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Reportar</a></li>
            <li><a>Compartir</a></li>
          </ul>
        </div>
      </div>

      <!-- Project Content -->
      <h2 class="card-title text-lg mb-2">{{ project.title }}</h2>
      <p class="text-base-content/80 text-sm mb-4 line-clamp-3">{{ project.description }}</p>

      <!-- Status Badge -->
      <div class="mb-4">
        <div class="badge" :class="getStatusClass(project.status)">
          {{ getStatusText(project.status) }}
        </div>
      </div>

      <!-- Tags -->
      <div v-if="project.tags && project.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span
          v-for="tag in project.tags.slice(0, 3)"
          :key="tag"
          class="badge badge-outline badge-sm"
        >
          #{{ tag }}
        </span>
        <span v-if="project.tags.length > 3" class="badge badge-ghost badge-sm">
          +{{ project.tags.length - 3 }}
        </span>
      </div>

      <!-- Team Members -->
      <div v-if="project.team_members && project.team_members.length > 0" class="mb-4">
        <div class="flex items-center space-x-2">
          <span class="text-xs text-base-content/60">Equipo:</span>
          <div class="avatar-group -space-x-2">
            <div
              v-for="(member, index) in project.team_members.slice(0, 3)"
              :key="member"
              class="avatar"
            >
              <div class="w-6 h-6 rounded-full">
                <img
                  :src="`https://via.placeholder.com/24?text=${index + 1}`"
                  :alt="`Miembro ${index + 1}`"
                />
              </div>
            </div>
            <div v-if="project.team_members.length > 3" class="avatar placeholder">
              <div class="w-6 h-6 bg-neutral text-neutral-content rounded-full">
                <span class="text-xs">+{{ project.team_members.length - 3 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card-actions justify-between items-center">
        <div class="flex space-x-4">
          <button
            class="btn btn-ghost btn-sm gap-2"
            :class="{ 'text-red-500': isLiked }"
            @click="$emit('like', project.id)"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            {{ project.likes_count || 0 }}
          </button>

          <button
            class="btn btn-ghost btn-sm gap-2"
            @click="$emit('comment', project.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            {{ project.comments_count || 0 }}
          </button>
        </div>

        <button class="btn btn-primary btn-sm">
          Ver Proyecto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Project } from '@/types'

interface Props {
  project: Project & { creator?: { full_name: string; avatar_url?: string } }
}

const props = defineProps<Props>()
const { t } = useI18n()

defineEmits<{
  like: [projectId: string]
  comment: [projectId: string]
  view: [projectId: string]
}>()

const isLiked = computed(() => {
  // TODO: Check if current user has liked this project
  return false
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Hace 1 día'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`
  return date.toLocaleDateString('es-ES')
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
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
