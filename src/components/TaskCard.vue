<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
    <div class="card-body p-4">
      <!-- Header -->
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-sm flex-1">{{ task.title }}</h4>
        <div class="dropdown dropdown-end" v-if="canMove || canEdit">
          <label tabindex="0" class="btn btn-ghost btn-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
            <!-- Opciones de mover (disponibles para miembros del equipo) -->
            <template v-if="canMove">
              <li v-if="task.status !== 'todo'">
                <a @click="$emit('move', task.id, 'todo')">
                  {{ t('tasks.status.todo') }}
                </a>
              </li>
              <li v-if="task.status !== 'in_progress'">
                <a @click="$emit('move', task.id, 'in_progress')">
                  {{ t('tasks.status.inProgress') }}
                </a>
              </li>
              <li v-if="task.status !== 'done'">
                <a @click="$emit('move', task.id, 'done')">
                  {{ t('tasks.status.done') }}
                </a>
              </li>
            </template>
            <!-- Opciones de editar/eliminar (solo para creador) -->
            <template v-if="canEdit">
              <li v-if="canMove" class="border-t border-base-300 mt-1 pt-1">
                <a @click="$emit('edit', task)">
                  {{ t('tasks.editTask') }}
                </a>
              </li>
              <li v-else>
                <a @click="$emit('edit', task)">
                  {{ t('tasks.editTask') }}
                </a>
              </li>
              <li>
                <a @click="$emit('delete', task.id)" class="text-error">
                  {{ t('tasks.deleteTask') }}
                </a>
              </li>
            </template>
          </ul>
        </div>
        <div v-else class="tooltip tooltip-left" data-tip="Sin permisos">
          <button class="btn btn-ghost btn-xs opacity-50 cursor-not-allowed" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Description -->
      <p v-if="task.description" class="text-xs text-base-content/70 mb-3 line-clamp-2">
        {{ task.description }}
      </p>

      <!-- Priority Badge -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          :class="[
            'badge badge-sm',
            task.priority === 'high' ? 'badge-error' :
            task.priority === 'medium' ? 'badge-warning' :
            'badge-info'
          ]"
        >
          {{ t(`tasks.priority.${task.priority}`) }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center text-xs text-base-content/60">
        <!-- Assigned To -->
        <div v-if="task.assigned_to" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span>{{ task.assignee?.full_name || task.assigned_to }}</span>
        </div>
        <div v-else></div>

        <!-- Due Date -->
        <div v-if="task.due_date" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span :class="{ 'text-error': isOverdue }">
            {{ formatDate(task.due_date) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

interface Props {
  task: Task
  canEdit?: boolean
  canMove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  canMove: true
})

defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  move: [taskId: string, status: Task['status']]
}>()

const isOverdue = computed(() => {
  if (!props.task.due_date) return false
  return new Date(props.task.due_date) < new Date() && props.task.status !== 'done'
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short'
  }).format(date)
}
</script>
