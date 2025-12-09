<template>
  <Teleport to="body">
    <Transition name="context-menu">
      <div
        v-if="isVisible"
        ref="menuRef"
        class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl min-w-[200px] py-2"
        :style="menuStyle"
        @click="closeMenu"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
        >
          <div
            v-if="item.divider"
            class="divider my-1"
          ></div>
          <button
            v-else
            @click="handleItemClick(item)"
            :disabled="item.disabled"
            class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'text-error hover:bg-error/10': item.danger,
              'text-warning': item.warning,
              'text-success': item.success
            }"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="w-4 h-4"
            />
            <span class="text-sm">{{ item.label }}</span>
            <span
              v-if="item.shortcut"
              class="ml-auto text-xs opacity-60"
            >
              {{ item.shortcut }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Component } from 'vue'

export interface ContextMenuItem {
  label: string
  icon?: Component
  action?: () => void
  disabled?: boolean
  danger?: boolean
  warning?: boolean
  success?: boolean
  divider?: boolean
  shortcut?: string
}

interface Props {
  items: ContextMenuItem[]
}

const props = defineProps<Props>()

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })
const menuRef = ref<HTMLElement | null>(null)

const menuStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`
}))

const show = (x: number, y: number) => {
  position.value = { x, y }
  isVisible.value = true

  // Ajustar posición si se sale de la pantalla
  setTimeout(() => {
    if (menuRef.value) {
      const rect = menuRef.value.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Ajustar horizontalmente
      if (rect.right > viewportWidth) {
        position.value.x = viewportWidth - rect.width - 10
      }

      // Ajustar verticalmente
      if (rect.bottom > viewportHeight) {
        position.value.y = viewportHeight - rect.height - 10
      }
    }
  }, 0)
}

const closeMenu = () => {
  isVisible.value = false
}

const handleItemClick = (item: ContextMenuItem) => {
  if (item.disabled) return
  item.action?.()
  closeMenu()
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

defineExpose({
  show,
  closeMenu
})
</script>

<style scoped>
.context-menu-enter-active,
.context-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
