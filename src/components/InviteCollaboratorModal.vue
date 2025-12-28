<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ t('projects.inviteCollaborator') }}</h3>

      <form @submit.prevent="handleInvite">
        <!-- User Search -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t('projects.searchUser') }}</span>
          </label>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('projects.searchUserPlaceholder')"
            class="input input-bordered w-full"
            @input="handleSearch"
          />

          <!-- Search Results Dropdown -->
          <div
            v-if="searchResults.length > 0"
            class="mt-2 max-h-48 overflow-y-auto border border-base-300 rounded-lg bg-base-100 shadow-lg"
          >
            <button
              v-for="user in searchResults"
              :key="user.id"
              type="button"
              @click="selectUser(user)"
              class="w-full p-3 hover:bg-base-200 text-left flex items-center gap-3 transition-colors"
            >
              <div class="avatar">
                <div class="w-10 h-10 rounded-full">
                  <img
                    :src="
                      user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`
                    "
                    :alt="user.full_name"
                  />
                </div>
              </div>
              <div>
                <p class="font-medium">{{ user.full_name }}</p>
                <p class="text-sm text-base-content/60">{{ user.email }}</p>
              </div>
            </button>
          </div>

          <!-- No results message -->
          <div
            v-if="searchQuery && !searching && searchResults.length === 0"
            class="mt-2 p-3 text-sm text-base-content/60 text-center border border-base-300 rounded-lg"
          >
            {{ t('projects.noUsersFound') }}
          </div>

          <!-- Searching indicator -->
          <div v-if="searching" class="mt-2 p-3 text-sm text-center">
            <span class="loading loading-spinner loading-sm"></span>
            {{ t('projects.searching') }}
          </div>
        </div>

        <!-- Selected User Display -->
        <div v-if="selectedUser" class="mt-4 p-4 bg-base-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img
                    :src="
                      selectedUser.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.full_name)}&background=random`
                    "
                    :alt="selectedUser.full_name"
                  />
                </div>
              </div>
              <div>
                <p class="font-semibold">{{ selectedUser.full_name }}</p>
                <p class="text-sm text-base-content/60">{{ selectedUser.email }}</p>
              </div>
            </div>
            <button type="button" @click="clearSelection" class="btn btn-ghost btn-circle btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Message -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">{{ t('projects.inviteMessage') }}</span>
            <span class="label-text-alt text-base-content/60">{{ t('projects.optional') }}</span>
          </label>
          <textarea
            v-model="message"
            :placeholder="t('projects.inviteMessagePlaceholder')"
            class="textarea textarea-bordered h-24"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button type="button" @click="closeModal" class="btn">
            {{ t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!selectedUser || sending">
            <span v-if="sending" class="loading loading-spinner loading-sm"></span>
            {{ sending ? t('projects.sending') : t('projects.sendInvite') }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useNotificationsStore } from '@/stores/notifications'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/composables/useTranslation'
import type { User } from '@/types'

interface Props {
  projectId: string
  projectTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  invited: []
}>()

const { t } = useTranslation()
const notificationsStore = useNotificationsStore()
const authStore = useAuthStore()

const modal = ref<HTMLDialogElement | null>(null)
const searchQuery = ref('')
const searchResults = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const message = ref('')
const searching = ref(false)
const sending = ref(false)

let searchTimeout: number | null = null

const showModal = () => {
  modal.value?.showModal()
}

const closeModal = () => {
  modal.value?.close()
  resetForm()
}

const resetForm = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedUser.value = null
  message.value = ''
}

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }

  searching.value = true
  searchTimeout = setTimeout(async () => {
    await searchUsers()
    searching.value = false
  }, 500)
}

const searchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, created_at')
      .ilike('full_name', `%${searchQuery.value}%`)
      .neq('id', authStore.user?.id) // Excluir el usuario actual
      .limit(5)

    if (error) throw error

    searchResults.value = (data || []) as User[]
  } catch (error) {
    console.error('Error searching users:', error)
    searchResults.value = []
  }
}

const selectUser = (user: User) => {
  selectedUser.value = user
  searchQuery.value = user.full_name
  searchResults.value = []
}

const clearSelection = () => {
  selectedUser.value = null
  searchQuery.value = ''
}

const handleInvite = async () => {
  if (!selectedUser.value) return

  sending.value = true
  try {
    await notificationsStore.sendProjectInvite(
      selectedUser.value.id,
      props.projectId,
      props.projectTitle,
      message.value || '',
    )

    alert('✅ ¡Invitación enviada con éxito!')
    emit('invited')
    closeModal()
  } catch (error: any) {
    console.error('Error sending invite:', error)

    if (error.message.includes('already invited')) {
      alert('ℹ️ Este usuario ya tiene una invitación pendiente para este proyecto')
    } else {
      alert(`❌ Error: ${error.message || 'No se pudo enviar la invitación'}`)
    }
  } finally {
    sending.value = false
  }
}

// Watch para limpiar resultados cuando se borra el query
watch(searchQuery, (newValue) => {
  if (!newValue) {
    searchResults.value = []
  }
})

defineExpose({
  showModal,
})
</script>
