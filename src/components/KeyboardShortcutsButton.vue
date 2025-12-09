<template>
  <div class="fixed bottom-20 right-6 z-40">
    <button
      @click="toggleHelp"
      class="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-300 tooltip tooltip-left"
      :data-tip="$t('keyboardShortcuts.title')"
    >
      <QuestionMarkCircleIcon class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { QuestionMarkCircleIcon } from '@/icons'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const toggleHelp = () => {
  uiStore.toggleKeyboardShortcutsHelp()
}
</script>
