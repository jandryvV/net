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
    <AppLoader v-if="loading" />
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
import AppLoader from '@/components/AppLoader.vue'

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
