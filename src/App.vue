<template>
  <div class="min-h-screen bg-base-200">
    <NavBar />

    <!-- Main Content -->
    <main class="min-h-screen">
      <router-view />
    </main>

    <TextToSpeechButton />

    <KeyboardShortcutsButton />

    <KeyboardShortcutsModal />

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import NavBar from '@/components/NavBar.vue'
import TextToSpeechButton from '@/components/TextToSpeechButton.vue'
import KeyboardShortcutsButton from '@/components/KeyboardShortcutsButton.vue'
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal.vue'

const authStore = useAuthStore()
const uiStore = useUIStore()
const { loading } = storeToRefs(authStore)

// Initialize keyboard shortcuts
useKeyboardShortcuts()

onMounted(async () => {
  await authStore.initAuth()
  uiStore.applyTheme()
})
</script>
