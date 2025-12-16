<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold">{{ t('notifications.title') }}</h1>
          <p class="text-base-content/60 mt-1">
            {{ unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas' }}
          </p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="btn btn-ghost btn-sm"
        >
          {{ t('notifications.markAllRead') }}
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="tabs tabs-boxed mb-6">
        <a
          class="tab"
          :class="{ 'tab-active': filter === 'all' }"
          @click="filter = 'all'"
        >
          Todas
        </a>
        <a
          class="tab"
          :class="{ 'tab-active': filter === 'unread' }"
          @click="filter = 'unread'"
        >
          Sin leer ({{ unreadCount }})
        </a>
        <a
          class="tab"
          :class="{ 'tab-active': filter === 'project_invite' }"
          @click="filter = 'project_invite'"
        >
          Invitaciones
        </a>
      </div>

      <!-- Notifications List -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="card bg-base-100 shadow-lg">
        <div class="card-body text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">{{ t('notifications.empty') }}</h3>
          <p class="text-base-content/60">No tienes notificaciones en este momento</p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
          :class="{ 'border-l-4 border-primary': !notification.read }"
        >
          <div class="card-body">
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="avatar flex-shrink-0">
                <div class="w-12 h-12 rounded-full">
                  <img
                    :src="notification.from_user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.from_user?.full_name || 'Usuario')}&background=random`"
                    :alt="notification.from_user?.full_name || 'Usuario'"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p class="font-medium" :class="!notification.read ? 'font-bold' : ''">
                      {{ notification.message }}
                    </p>
                    <p class="text-sm text-base-content/60 mt-1">
                      {{ formatTimeAgo(notification.created_at) }}
                    </p>
                  </div>

                  <!-- Type badge -->
                  <div class="badge" :class="getTypeBadgeClass(notification.type)">
                    {{ getTypeLabel(notification.type) }}
                  </div>
                </div>

                <!-- Actions for project invites -->
                <div v-if="notification.type === 'project_invite' && !notification.read" class="flex gap-2 mt-4">
                  <button
                    @click="handleAcceptInvite(notification)"
                    class="btn btn-success btn-sm"
                    :disabled="processingInvite"
                  >
                    {{ t('notifications.accept') }}
                  </button>
                  <button
                    @click="handleRejectInvite(notification)"
                    class="btn btn-error btn-sm"
                    :disabled="processingInvite"
                  >
                    {{ t('notifications.reject') }}
                  </button>
                </div>

                <!-- View project button -->
                <div v-if="notification.project_id && notification.read" class="mt-3">
                  <router-link
                    :to="`/projects/${notification.project_id}`"
                    class="btn btn-ghost btn-sm"
                  >
                    {{ t('notifications.viewProject') }}
                  </router-link>
                </div>
              </div>

              <!-- Actions menu -->
              <div class="dropdown dropdown-end flex-shrink-0">
                <label tabindex="0" class="btn btn-ghost btn-circle btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 z-50">
                  <li v-if="!notification.read">
                    <a @click="notificationsStore.markAsRead(notification.id)">
                      Marcar como leída
                    </a>
                  </li>
                  <li>
                    <a @click="handleDelete(notification.id)" class="text-error">
                      Eliminar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { useTranslation } from '@/composables/useTranslation'
import type { Notification } from '@/types'

const { t } = useTranslation()
const notificationsStore = useNotificationsStore()
const { notifications, loading, unreadCount } = storeToRefs(notificationsStore)

const filter = ref<'all' | 'unread' | 'project_invite'>('all')
const processingInvite = ref(false)

const filteredNotifications = computed(() => {
  if (filter.value === 'all') return notifications.value
  if (filter.value === 'unread') return notifications.value.filter(n => !n.read)
  if (filter.value === 'project_invite') return notifications.value.filter(n => n.type === 'project_invite')
  return notifications.value
})

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Ahora mismo'
  if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    'like': 'badge-error',
    'comment': 'badge-info',
    'project_invite': 'badge-warning',
    'project_update': 'badge-primary',
    'invite_accepted': 'badge-success',
    'invite_rejected': 'badge-ghost'
  }
  return classes[type] || 'badge-ghost'
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'like': 'Like',
    'comment': 'Comentario',
    'project_invite': 'Invitación',
    'project_update': 'Actualización',
    'invite_accepted': 'Aceptada',
    'invite_rejected': 'Rechazada'
  }
  return labels[type] || type
}

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead()
}

const handleAcceptInvite = async (notification: Notification) => {
  if (!notification.project_id) return

  processingInvite.value = true
  try {
    await notificationsStore.acceptInvite(notification.id, notification.project_id)
    alert('✅ ¡Ahora eres colaborador del proyecto!')
  } catch (error: any) {
    console.error('Error accepting invite:', error)
    alert(`❌ Error: ${error.message || 'No se pudo aceptar la invitación'}`)
  } finally {
    processingInvite.value = false
  }
}

const handleRejectInvite = async (notification: Notification) => {
  if (!notification.project_id) return

  processingInvite.value = true
  try {
    await notificationsStore.rejectInvite(notification.id, notification.project_id)
  } catch (error: any) {
    console.error('Error rejecting invite:', error)
    alert(`❌ Error: ${error.message || 'No se pudo rechazar la invitación'}`)
  } finally {
    processingInvite.value = false
  }
}

const handleDelete = async (notificationId: string) => {
  if (confirm('¿Seguro que quieres eliminar esta notificación?')) {
    try {
      await notificationsStore.deleteNotification(notificationId)
    } catch (error: any) {
      console.error('Error deleting notification:', error)
      alert(`❌ Error: ${error.message || 'No se pudo eliminar la notificación'}`)
    }
  }
}

onMounted(() => {
  notificationsStore.fetchNotifications()
})
</script>
