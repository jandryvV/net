<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="uiStore.showKeyboardShortcutsHelp"
        class="fixed inset-0 z-50 flex items-center justify-center modal modal-open"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-base-100 rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          :aria-label="t('keyboardShortcuts.title')"
        >
          <!-- Header -->
          <div
            class="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <CommandLineIcon class="w-8 h-8 text-primary" />
              <h2 class="text-2xl font-bold">{{ t('keyboardShortcuts.title') }}</h2>
            </div>
            <button
              @click="close"
              class="btn btn-ghost btn-sm btn-circle"
              :aria-label="t('keyboardShortcuts.close')"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-base-content/70 mb-6">
              {{ t('keyboardShortcuts.description') }}
            </p>

            <!-- Navigation shortcuts -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <ArrowPathIcon class="w-5 h-5 text-primary" />
                {{ t('keyboardShortcuts.navigation') }}
              </h3>
              <div class="space-y-2">
                <div
                  v-for="shortcut in navigationShortcuts"
                  :key="shortcut.key"
                  class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <span class="text-sm">{{ t(shortcut.description) }}</span>
                  <kbd class="kbd kbd-sm">{{ shortcut.key }}</kbd>
                </div>
              </div>
            </div>

            <!-- Action shortcuts -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <BoltIcon class="w-5 h-5 text-success" />
                {{ t('keyboardShortcuts.actions') }}
              </h3>
              <div class="space-y-2">
                <div
                  v-for="shortcut in actionShortcuts"
                  :key="shortcut.key"
                  class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <span class="text-sm">{{ t(shortcut.description) }}</span>
                  <kbd class="kbd kbd-sm">{{ shortcut.key }}</kbd>
                </div>
              </div>
            </div>

            <!-- Settings shortcuts -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <CogIcon class="w-5 h-5 text-warning" />
                {{ t('keyboardShortcuts.settings') }}
              </h3>
              <div class="space-y-2">
                <div
                  v-for="shortcut in settingsShortcuts"
                  :key="shortcut.key"
                  class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <span class="text-sm">{{ t(shortcut.description) }}</span>
                  <kbd class="kbd kbd-sm">{{ shortcut.key }}</kbd>
                </div>
              </div>
            </div>

            <!-- Accessibility shortcuts -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <SpeakerWaveIcon class="w-5 h-5 text-secondary" />
                {{ t('keyboardShortcuts.accessibility') }}
              </h3>
              <div class="space-y-2">
                <div
                  v-for="shortcut in accessibilityShortcuts"
                  :key="shortcut.key"
                  class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <span class="text-sm">{{ t(shortcut.description) }}</span>
                  <kbd class="kbd kbd-sm">{{ shortcut.key }}</kbd>
                </div>
              </div>
            </div>

            <!-- Help section -->
            <div class="bg-base-200 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
                <InformationCircleIcon class="w-5 h-5 text-info" />
                {{ t('keyboardShortcuts.tip') }}
              </h3>
              <p class="text-sm text-base-content/70">
                {{ t('keyboardShortcuts.tipText') }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-base-100 border-t border-base-300 p-4 flex justify-end">
            <button @click="close" class="btn btn-primary">
              {{ t('keyboardShortcuts.gotIt') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import {
  XMarkIcon,
  CommandLineIcon,
  ArrowPathIcon,
  BoltIcon,
  CogIcon,
  InformationCircleIcon,
  SpeakerWaveIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const uiStore = useUIStore()
const authStore = useAuthStore()

const close = () => {
  uiStore.toggleKeyboardShortcutsHelp()
}

// Categorized shortcuts
const navigationShortcuts = computed(() =>
  [
    { key: 'Alt + H', description: 'keyboardShortcuts.shortcuts.home', requiresAuth: false },
    { key: 'Alt + A', description: 'keyboardShortcuts.shortcuts.about', requiresAuth: false },
    { key: 'Alt + N', description: 'keyboardShortcuts.shortcuts.news', requiresAuth: false },
    { key: 'Alt + P', description: 'keyboardShortcuts.shortcuts.projects', requiresAuth: true },
    {
      key: 'Alt + L',
      description: 'keyboardShortcuts.shortcuts.loginProfile',
      requiresAuth: false,
    },
  ].filter((s) => !s.requiresAuth || authStore.user),
)

const actionShortcuts = computed(() =>
  [
    { key: 'Alt + R', description: 'keyboardShortcuts.shortcuts.register', requiresAuth: false },
    { key: 'Alt + X', description: 'keyboardShortcuts.shortcuts.logout', requiresAuth: true },
  ].filter((s) => !s.requiresAuth || authStore.user),
)

const settingsShortcuts = computed(() =>
  [
    { key: 'Alt + S', description: 'keyboardShortcuts.shortcuts.settings', requiresAuth: true },
    { key: 'Alt + T', description: 'keyboardShortcuts.shortcuts.theme', requiresAuth: false },
    { key: 'Alt + I', description: 'keyboardShortcuts.shortcuts.language', requiresAuth: false },
    { key: 'Alt + ?', description: 'keyboardShortcuts.shortcuts.help', requiresAuth: false },
  ].filter((s) => !s.requiresAuth || authStore.user),
)

const accessibilityShortcuts = computed(() => [
  { key: 'Alt + V', description: 'keyboardShortcuts.shortcuts.toggleTTS', requiresAuth: false },
  { key: 'Alt + Q', description: 'keyboardShortcuts.shortcuts.readPage', requiresAuth: false },
  { key: 'Alt + W', description: 'keyboardShortcuts.shortcuts.readSelection', requiresAuth: false },
  { key: 'Alt + E', description: 'keyboardShortcuts.shortcuts.stopReading', requiresAuth: false },
  { key: 'Alt + +', description: 'keyboardShortcuts.shortcuts.zoomIn', requiresAuth: false },
  { key: 'Alt + -', description: 'keyboardShortcuts.shortcuts.zoomOut', requiresAuth: false },
  { key: 'Alt + 0', description: 'keyboardShortcuts.shortcuts.resetZoom', requiresAuth: false },
])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
