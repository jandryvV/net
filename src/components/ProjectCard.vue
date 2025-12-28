<template>
  <div
    class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
    @contextmenu.prevent="handleContextMenu"
  >
    <figure v-if="project.image_url" class="aspect-video">
      <img :src="project.image_url" :alt="project.title" class="w-full h-full object-cover" />
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

        <button @click="handleMenuClick" class="btn btn-ghost btn-sm btn-circle">
          <EllipsisVerticalIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Context Menu -->
      <ContextMenu ref="contextMenuRef" :items="contextMenuItems" />

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
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ project.likes_count || 0 }}
          </button>

          <button class="btn btn-ghost btn-sm gap-2" @click="$emit('comment', project.id)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            {{ project.comments_count || 0 }}
          </button>
        </div>

        <button class="btn btn-primary btn-sm">Ver Proyecto</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import type { Project } from '@/types'
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  BookmarkIcon,
  FlagIcon,
} from '@/icons'

interface Props {
  project: Project & { creator?: { full_name: string; avatar_url?: string } }
}

const props = defineProps<Props>()
const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)

const emit = defineEmits<{
  like: [projectId: string]
  comment: [projectId: string]
  view: [projectId: string]
  edit: [projectId: string]
  delete: [projectId: string]
  share: [projectId: string]
  save: [projectId: string]
  report: [projectId: string]
}>()

const isOwner = computed(() => {
  return authStore.user?.id === props.project.user_id
})

const contextMenuItems = computed(() => {
  const items = [
    {
      label: t('common.view') || 'Ver Proyecto',
      icon: EyeIcon,
      action: () => handleViewProject(),
    },
    {
      label: 'Guardar',
      icon: BookmarkIcon,
      action: () => emit('save', props.project.id),
    },
    {
      label: t('common.share') || 'Compartir',
      icon: ShareIcon,
      action: () => handleShare(),
    },
  ]

  if (isOwner.value) {
    items.push({ divider: true } as any)
    items.push(
      {
        label: t('common.edit') || 'Editar',
        icon: PencilIcon,
        action: () => emit('edit', props.project.id),
      },
      {
        label: t('common.delete') || 'Eliminar',
        icon: TrashIcon,
        danger: true,
        action: () => emit('delete', props.project.id),
      },
    )
  } else {
    items.push({ divider: true } as any)
    items.push({
      label: 'Reportar',
      icon: FlagIcon,
      warning: true,
      action: () => emit('report', props.project.id),
    })
  }

  return items
})

const handleContextMenu = (event: MouseEvent) => {
  contextMenuRef.value?.show(event.clientX, event.clientY)
}

const handleMenuClick = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  contextMenuRef.value?.show(rect.left, rect.bottom + 5)
}

const handleViewProject = () => {
  router.push(`/projects/${props.project.id}`)
  emit('view', props.project.id)
}

const handleShare = () => {
  const url = `${window.location.origin}/projects/${props.project.id}`
  if (navigator.share) {
    navigator.share({
      title: props.project.title,
      text: props.project.description,
      url: url,
    })
  } else {
    navigator.clipboard.writeText(url)
    // TODO: Mostrar toast de "Enlace copiado"
  }
  emit('share', props.project.id)
}

const isLiked = computed(() => {
  // TODO: Check if current user has liked this project
  return false
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.ceil(diffDays / 7)

  if (diffDays === 1) return t('common.dates.yesterday')
  if (diffDays < 7) return t('common.dates.daysAgo', { days: diffDays })
  if (diffDays < 30) return t('common.dates.weeksAgo', { weeks: diffWeeks })
  return date.toLocaleDateString()
}

const getStatusClass = (status: string) => {
  const classes = {
    planning: 'badge-warning',
    in_progress: 'badge-info',
    completed: 'badge-success',
    on_hold: 'badge-error',
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    planning: t('project.status.planning'),
    Planificando: t('project.status.planning'),
    in_progress: t('project.status.in_progress'),
    'En Progreso': t('project.status.in_progress'),
    completed: t('project.status.completed'),
    Completado: t('project.status.completed'),
    on_hold: t('project.status.on_hold'),
    'En Pausa': t('project.status.on_hold'),
  }
  return statusMap[status] || status
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
