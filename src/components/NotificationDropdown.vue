<template>
  <div class="dropdown dropdown-end">
    <!-- Bell Icon Button -->
    <label tabindex="0" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <span v-if="unreadCount > 0" class="badge badge-sm badge-error indicator-item">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </div>
    </label>

    <!-- Dropdown Menu -->
    <div
      tabindex="0"
      class="dropdown-content z-50 mt-3 card card-compact w-80 bg-base-100 shadow-xl border border-base-300"
    >
      <div class="card-body p-0">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-base-300">
          <h3 class="font-bold text-lg">{{ t('notifications.title') }}</h3>
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-ghost btn-xs">
            {{ t('notifications.markAllRead') }}
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="loading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-md"></span>
          </div>

          <div v-else-if="notifications.length === 0" class="text-center py-8 text-base-content/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 mx-auto mb-2 opacity-50"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
              />
            </svg>
            <p class="text-sm">{{ t('notifications.empty') }}</p>
          </div>

          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'p-4 border-b border-base-300 transition-colors',
                !notification.read ? 'bg-base-200' : 'hover:bg-base-200',
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full">
                    <img
                      :src="
                        notification.from_user?.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.from_user?.full_name || 'Usuario')}&background=random`
                      "
                      :alt="notification.from_user?.full_name || 'Usuario'"
                    />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm" :class="!notification.read ? 'font-semibold' : ''">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-base-content/60 mt-1">
                    {{ formatTimeAgo(notification.created_at) }}
                  </p>

                  <!-- Actions for project invites -->
                  <div
                    v-if="notification.type === 'project_invite' && !notification.read"
                    class="flex gap-2 mt-3"
                  >
                    <button
                      @click="handleAcceptInvite(notification)"
                      class="btn btn-success btn-xs"
                      :disabled="processingInvite"
                    >
                      {{ t('notifications.accept') }}
                    </button>
                    <button
                      @click="handleRejectInvite(notification)"
                      class="btn btn-error btn-xs"
                      :disabled="processingInvite"
                    >
                      {{ t('notifications.reject') }}
                    </button>
                  </div>

                  <!-- View project button -->
                  <div v-if="notification.project_id && notification.read" class="mt-2">
                    <router-link
                      :to="`/projects/${notification.project_id}`"
                      class="btn btn-ghost btn-xs"
                    >
                      {{ t('notifications.viewProject') }}
                    </router-link>
                  </div>
                </div>

                <!-- Unread indicator -->
                <div v-if="!notification.read" class="flex-shrink-0">
                  <div class="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notifications.length > 0" class="p-3 border-t border-base-300 text-center">
          <router-link to="/notifications" class="btn btn-ghost btn-sm w-full">
            {{ t('notifications.viewAll') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { useTranslation } from '@/composables/useTranslation'
import type { Notification } from '@/types'

const { t } = useTranslation()
const notificationsStore = useNotificationsStore()
const { notifications, loading, unreadCount } = storeToRefs(notificationsStore)

const processingInvite = ref(false)

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${days}d`
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

onMounted(() => {
  notificationsStore.fetchNotifications()

  // Refrescar notificaciones cada 30 segundos
  setInterval(() => {
    notificationsStore.fetchNotifications()
  }, 30000)
})
</script>
