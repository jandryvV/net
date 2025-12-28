<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">{{ t('tasks.title') }}</h2>
      <button v-if="canCreate" @click="showAddModal = true" class="btn btn-primary btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ t('tasks.addTask') }}
      </button>
      <div v-else class="badge badge-ghost">Solo el creador puede agregar tareas</div>
    </div>

    <!-- Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- To Do Column -->
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="badge badge-info">{{ todoTasks.length }}</span>
            {{ t('tasks.status.todo') }}
          </h3>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in todoTasks"
            :key="task.id"
            :task="task"
            :can-edit="canEdit"
            :can-move="canMove"
            @edit="editTask"
            @delete="deleteTask"
            @move="moveTask"
          />
          <div v-if="todoTasks.length === 0" class="text-center text-base-content/60 py-8">
            {{ t('tasks.noTasks') }}
          </div>
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="badge badge-warning">{{ inProgressTasks.length }}</span>
            {{ t('tasks.status.inProgress') }}
          </h3>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in inProgressTasks"
            :key="task.id"
            :task="task"
            :can-edit="canEdit"
            :can-move="canMove"
            @edit="editTask"
            @delete="deleteTask"
            @move="moveTask"
          />
          <div v-if="inProgressTasks.length === 0" class="text-center text-base-content/60 py-8">
            {{ t('tasks.noTasks') }}
          </div>
        </div>
      </div>

      <!-- Done Column -->
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg flex items-center gap-2">
            <span class="badge badge-success">{{ doneTasks.length }}</span>
            {{ t('tasks.status.done') }}
          </h3>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in doneTasks"
            :key="task.id"
            :task="task"
            :can-edit="canEdit"
            :can-move="canMove"
            @edit="editTask"
            @delete="deleteTask"
            @move="moveTask"
          />
          <div v-if="doneTasks.length === 0" class="text-center text-base-content/60 py-8">
            {{ t('tasks.noTasks') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <dialog :class="['modal', { 'modal-open': showAddModal || showEditModal }]">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">
          {{ showEditModal ? t('tasks.editTask') : t('tasks.addTask') }}
        </h3>

        <form @submit.prevent="saveTask" class="space-y-4">
          <!-- Title -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('tasks.form.title') }}</span>
            </label>
            <input
              v-model="taskForm.title"
              type="text"
              :placeholder="t('tasks.form.titlePlaceholder')"
              class="input input-bordered w-full"
              required
            />
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('tasks.form.description') }}</span>
            </label>
            <textarea
              v-model="taskForm.description"
              :placeholder="t('tasks.form.descriptionPlaceholder')"
              class="textarea textarea-bordered h-24"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Status -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ t('tasks.form.status') }}</span>
              </label>
              <select v-model="taskForm.status" class="select select-bordered">
                <option value="todo">{{ t('tasks.status.todo') }}</option>
                <option value="in_progress">{{ t('tasks.status.inProgress') }}</option>
                <option value="done">{{ t('tasks.status.done') }}</option>
              </select>
            </div>

            <!-- Priority -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ t('tasks.form.priority') }}</span>
              </label>
              <select v-model="taskForm.priority" class="select select-bordered">
                <option value="low">{{ t('tasks.priority.low') }}</option>
                <option value="medium">{{ t('tasks.priority.medium') }}</option>
                <option value="high">{{ t('tasks.priority.high') }}</option>
              </select>
            </div>

            <!-- Assigned To -->
            <div class="form-control relative">
              <label class="label">
                <span class="label-text">{{ t('tasks.form.assignedTo') }}</span>
              </label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('tasks.form.assignedToPlaceholder')"
                  class="input input-bordered w-full pr-10"
                  @focus="searchQuery && searchUsers(searchQuery)"
                />
                <button
                  v-if="selectedUser"
                  type="button"
                  @click="clearUserSelection"
                  class="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Dropdown de resultados -->
              <div
                v-if="searchResults.length > 0 && !selectedUser"
                class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                style="top: 100%"
              >
                <div
                  v-for="user in searchResults"
                  :key="user.id"
                  @click="selectUser(user)"
                  class="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <div class="avatar">
                    <div class="w-8 h-8 rounded-full">
                      <img
                        :src="
                          user.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random`
                        "
                        :alt="user.full_name || 'User'"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-sm">{{ user.full_name }}</div>
                    <div class="text-xs text-base-content/60">{{ user.email }}</div>
                  </div>
                </div>
              </div>

              <!-- Loading spinner -->
              <div v-if="isSearching" class="text-xs text-base-content/60 mt-1">
                <span class="loading loading-spinner loading-xs"></span>
                Buscando...
              </div>

              <!-- Usuario seleccionado -->
              <div
                v-if="selectedUser"
                class="flex items-center gap-2 mt-2 p-2 bg-base-200 rounded-lg"
              >
                <div class="avatar">
                  <div class="w-6 h-6 rounded-full">
                    <img
                      :src="
                        selectedUser.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.full_name || 'User')}&background=random`
                      "
                      :alt="selectedUser.full_name || 'User'"
                    />
                  </div>
                </div>
                <div class="flex-1 text-sm">
                  <span class="font-semibold">{{ selectedUser.full_name }}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 text-success"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Due Date -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ t('tasks.form.dueDate') }}</span>
              </label>
              <input v-model="taskForm.due_date" type="date" class="input input-bordered w-full" />
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-action">
            <button type="button" @click="closeModal" class="btn">
              {{ t('tasks.form.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ t('tasks.form.save') }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog :class="['modal', { 'modal-open': showDeleteModal }]">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ t('tasks.deleteConfirm.title') }}</h3>
        <p class="py-4">{{ t('tasks.deleteConfirm.message') }}</p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn">
            {{ t('tasks.deleteConfirm.cancel') }}
          </button>
          <button @click="confirmDelete" class="btn btn-error">
            {{ t('tasks.deleteConfirm.confirm') }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, User } from '@/types'
import { useTranslation } from '@/composables/useTranslation'
import TaskCard from '@/components/TaskCard.vue'
import { supabase } from '@/lib/supabase'

const { t } = useTranslation()

interface Props {
  tasks: Task[]
  projectId: string
  canCreate?: boolean
  canEdit?: boolean
  canMove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canCreate: true,
  canEdit: true,
  canMove: true,
})

const emit = defineEmits<{
  create: [task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>]
  update: [taskId: string, updates: Partial<Task>]
  delete: [taskId: string]
}>()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const taskToDelete = ref<string | null>(null)
const searchQuery = ref('')
const searchResults = ref<Partial<User>[]>([])
const isSearching = ref(false)
const selectedUser = ref<Partial<User> | null>(null)

const taskForm = ref({
  title: '',
  description: '',
  status: 'todo' as Task['status'],
  priority: 'medium' as Task['priority'],
  assigned_to: '',
  due_date: '',
})

const editingTaskId = ref<string | null>(null)

const todoTasks = computed(() => props.tasks.filter((t) => t.status === 'todo'))
const inProgressTasks = computed(() => props.tasks.filter((t) => t.status === 'in_progress'))
const doneTasks = computed(() => props.tasks.filter((t) => t.status === 'done'))

// Buscar usuarios por email o nombre
const searchUsers = async (query: string) => {
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10)

    if (error) throw error
    searchResults.value = data || []
  } catch (error) {
    console.error('Error searching users:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Watch para búsqueda en tiempo real
watch(searchQuery, (newValue) => {
  if (newValue) {
    searchUsers(newValue)
  } else {
    searchResults.value = []
  }
})

const selectUser = (user: Partial<User>) => {
  selectedUser.value = user
  taskForm.value.assigned_to = user.id!
  searchQuery.value = user.email!
  searchResults.value = []
}

const clearUserSelection = () => {
  selectedUser.value = null
  taskForm.value.assigned_to = ''
  searchQuery.value = ''
  searchResults.value = []
}

async function editTask(task: Task) {
  editingTaskId.value = task.id
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assigned_to: task.assigned_to || '',
    due_date: task.due_date || '',
  }

  // Cargar el usuario asignado si existe
  if (task.assigned_to) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .eq('id', task.assigned_to)
        .single()

      if (data && !error) {
        selectedUser.value = data
        searchQuery.value = data.email
      }
    } catch (error) {
      console.error('Error loading assigned user:', error)
    }
  }

  showEditModal.value = true
}

function deleteTask(taskId: string) {
  taskToDelete.value = taskId
  showDeleteModal.value = true
}

function confirmDelete() {
  if (taskToDelete.value) {
    emit('delete', taskToDelete.value)
    taskToDelete.value = null
  }
  showDeleteModal.value = false
}

function moveTask(taskId: string, newStatus: Task['status']) {
  emit('update', taskId, { status: newStatus })
}

function saveTask() {
  if (showEditModal.value && editingTaskId.value) {
    // Update existing task
    emit('update', editingTaskId.value, {
      title: taskForm.value.title,
      description: taskForm.value.description,
      status: taskForm.value.status,
      priority: taskForm.value.priority,
      assigned_to: taskForm.value.assigned_to || undefined,
      due_date: taskForm.value.due_date || undefined,
    })
  } else {
    // Create new task
    const taskData: any = {
      project_id: props.projectId,
      title: taskForm.value.title.trim(),
      status: taskForm.value.status,
      priority: taskForm.value.priority,
    }

    // Solo agregar campos opcionales si tienen valor
    if (taskForm.value.description?.trim()) {
      taskData.description = taskForm.value.description.trim()
    }
    if (taskForm.value.assigned_to?.trim()) {
      taskData.assigned_to = taskForm.value.assigned_to.trim()
    }
    if (taskForm.value.due_date) {
      taskData.due_date = taskForm.value.due_date
    }

    emit('create', taskData)
  }
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingTaskId.value = null
  selectedUser.value = null
  searchQuery.value = ''
  searchResults.value = []
  taskForm.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
  }
}
</script>
