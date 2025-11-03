<template>
  <div v-if="show" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header mejorado -->
      <div class="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8 border border-primary/20">
        <div class="flex items-center gap-4">
          <div class="bg-primary/20 p-3 rounded-full">
            <RocketLaunchIcon class="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 class="text-2xl font-bold mb-1">Crear Nuevo Proyecto</h3>
            <p class="text-base-content/60">Comparte tu idea con la comunidad</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Form Progress Bar -->
        <FormProgress
          :progress="formProgress"
          :label="progressLabel"
          :show-steps="true"
          :steps="5"
          :current-step="currentStep"
          :step-labels="stepLabels"
        />

        <!-- Barra de progreso durante la creación -->
        <div v-if="loading" class="mb-4">
          <progress class="progress progress-primary w-full" />
        </div>
        <!-- Title -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <DocumentTextIcon class="h-5 w-5 text-primary" />
              Título del proyecto *
            </span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Mi increíble proyecto..."
            class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md"
            required
          />
        </div>
        <!-- Description -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <PencilSquareIcon class="h-5 w-5 text-primary" />
              Descripción *
            </span>
          </label>
          <div>
            <textarea
              v-model="form.description"
              class="textarea textarea-bordered h-32 text-base focus:textarea-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md resize-none"
              placeholder="Describe tu proyecto, objetivos, tecnologías que usarás, cómo ayudará a los usuarios..."
              required
            ></textarea>
          </div>
        </div>

        <!-- Status -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <ChartBarIcon class="h-5 w-5 text-primary" />
              Estado del proyecto
            </span>
          </label>
          <div>
            <select v-model="form.status" class="select select-bordered select-lg focus:select-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md">
              <option value="">Selecciona un estado</option>
              <option value="planning">Planificando</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="on_hold">En Pausa</option>
            </select>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <TagIcon class="h-5 w-5 text-primary" />
              Etiquetas
            </span>
          </label>
          <div class="space-y-3">
            <input
              v-model="tagInput"
              type="text"
              placeholder="react, nodejs, api, machine-learning..."
              class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md"
              @keydown.enter.prevent="addTag"
            />
            <div class="text-sm text-base-content/60 flex items-center gap-1">
              <InformationCircleIcon class="h-4 w-4" />
              Presiona Enter para agregar etiquetas o sepáralas por comas
            </div>
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="badge badge-primary badge-lg gap-2 px-3 py-2"
              >
                <HashtagIcon class="h-3 w-3" />
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="btn btn-ghost btn-xs btn-circle hover:bg-error hover:text-error-content"
                >
                  <XMarkIcon class="h-3 w-3" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Image URL -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <PhotoIcon class="h-5 w-5 text-primary" />
              Imagen del proyecto (opcional)
            </span>
          </label>
          <input
            v-model="form.image_url"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md"
          />
          <div v-if="form.image_url" class="mt-4">
            <div class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-primary/30">
              <img
                :src="form.image_url"
                alt="Vista previa"
                class="w-full h-48 object-cover rounded-lg shadow-md"
                @error="imageError = true"
              />
              <p v-if="imageError" class="text-error text-sm mt-2 flex items-center gap-1">
                <ExclamationTriangleIcon class="h-4 w-4" />
                No se pudo cargar la imagen
              </p>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold flex items-center gap-2">
              <UsersIcon class="h-5 w-5 text-primary" />
              Miembros del equipo (emails)
            </span>
          </label>
          <div class="space-y-3">
            <div class="relative">
              <input
                v-model="memberInput"
                type="text"
                placeholder="usuario@email.com, colaborador@gmail.com..."
                class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300 bg-base-100 shadow-sm hover:shadow-md"
                @keydown.enter.prevent="addMember"
                @input="showMemberSuggestions = !!memberInput"
                aria-autocomplete="list"
              />

              <!-- Autocompletado simple -->
              <ul v-if="showMemberSuggestions && memberSuggestions.length > 0" class="absolute z-50 left-0 right-0 bg-base-100 border border-base-300 rounded mt-1 max-h-40 overflow-auto">
                <li
                  v-for="suggestion in memberSuggestions"
                  :key="suggestion.email"
                  class="px-3 py-2 hover:bg-base-200 cursor-pointer"
                  @click="addMemberFromSuggestion(suggestion.email)"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ suggestion.full_name }}</span>
                    <small class="text-xs text-base-content/60">{{ suggestion.email }}</small>
                  </div>
                </li>
              </ul>
            </div>
            <div class="text-sm text-base-content/60 flex items-center gap-1">
              <InformationCircleIcon class="h-4 w-4" />
              Presiona Enter para agregar miembros o sepáralos por comas
            </div>
            <div v-if="form.team_members.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(member, index) in form.team_members"
                :key="index"
                class="badge badge-secondary badge-lg gap-2 px-3 py-2"
              >
                <UserIcon class="h-3 w-3" />
                {{ member }}
                <button
                  type="button"
                  @click="removeMember(index)"
                  class="btn btn-ghost btn-xs btn-circle hover:bg-error hover:text-error-content"
                >
                  <XMarkIcon class="h-3 w-3" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-error shadow-lg">
          <ExclamationTriangleIcon class="h-6 w-6" />
          <div>
            <h3 class="font-bold">Error</h3>
            <div class="text-xs">{{ error }}</div>
          </div>
        </div>

        <!-- Success toast (local) -->
        <div v-if="showSuccessToast" class="fixed top-6 right-6 z-50">
          <div class="alert alert-success shadow-lg">
            <div>
              <span>{{ successMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-base-300">
          <button
            type="button"
            class="btn btn-outline btn-lg flex-1 gap-2"
            @click="$emit('close')"
          >
            <XMarkIcon class="h-5 w-5" />
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary btn-lg flex-1 gap-2"
            :class="{ 'loading': loading }"
            :disabled="loading"
          >
            <RocketLaunchIcon v-if="!loading" class="h-5 w-5" />
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ loading ? 'Creando proyecto...' : 'Crear Proyecto' }}
          </button>
        </div>
      </form>
    </div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { storeToRefs } from 'pinia'
import {
  RocketLaunchIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  TagIcon,
  HashtagIcon,
  PhotoIcon,
  UsersIcon,
  UserIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import FormProgress from '@/components/ui/FormProgress.vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const { profile } = storeToRefs(authStore)

const form = ref({
  title: '',
  description: '',
  status: '' as const,
  tags: [] as string[],
  image_url: '',
  team_members: [] as string[]
})

const tagInput = ref('')
const memberInput = ref('')
const loading = ref(false)
const error = ref('')
const imageError = ref(false)
const showMemberSuggestions = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('')

// Simple dataset de usuarios para autocompletado (puedes reemplazar por fetch desde store)
const allUsers = [
  { id: 'u1', full_name: 'Ana García', email: 'ana@example.com' },
  { id: 'u2', full_name: 'Carlos Mendoza', email: 'carlos@example.com' },
  { id: 'u3', full_name: 'María López', email: 'maria@example.com' },
  { id: 'u4', full_name: 'Juan Pérez', email: 'juan@example.com' }
]

const memberSuggestions = computed(() => {
  const q = memberInput.value.toLowerCase()
  if (!q) return []
  return allUsers.filter(u => u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q)).slice(0, 6)
})

// Form Progress Computeds
const formProgress = computed(() => {
  let progress = 0

  if (form.value.title.trim().length > 0) progress += 20
  if (form.value.description.trim().length > 0) progress += 20
  if (form.value.status !== '') progress += 20
  if (form.value.tags.length > 0) progress += 20
  if (form.value.image_url.trim().length > 0 || form.value.team_members.length > 0) progress += 20

  return progress
})

const currentStep = computed(() => {
  if ((form.value.image_url.trim().length > 0 || form.value.team_members.length > 0) && form.value.tags.length > 0 && form.value.status && form.value.description.trim().length > 0 && form.value.title.trim().length > 0) return 5
  if (form.value.tags.length > 0 && form.value.status && form.value.description.trim().length > 0 && form.value.title.trim().length > 0) return 4
  if (form.value.status && form.value.description.trim().length > 0 && form.value.title.trim().length > 0) return 3
  if (form.value.description.trim().length > 0 && form.value.title.trim().length > 0) return 2
  if (form.value.title.trim().length > 0) return 1
  return 0
})

const stepLabels = computed(() => {
  return ['Título', 'Descripción', 'Estado', 'Etiquetas', 'Extras']
})

const progressLabel = computed(() => {
  if (formProgress.value === 100) {
    return '¡Listo para crear!'
  } else if (formProgress.value >= 80) {
    return 'Casi completo...'
  } else if (formProgress.value >= 50) {
    return 'Vas por buen camino'
  } else {
    return 'Completa tu proyecto'
  }
})

const addTag = () => {
  if (tagInput.value.trim()) {
    const tags = tagInput.value.split(',').map(tag => tag.trim().toLowerCase())
    form.value.tags.push(...tags.filter(tag => tag && !form.value.tags.includes(tag)))
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const addMember = () => {
  if (!memberInput.value.trim()) return

  const members = memberInput.value.split(',').map(member => member.trim()).filter(Boolean)
  const invalid = members.find(m => !isValidEmail(m))
  if (invalid) {
    error.value = `Email inválido: ${invalid}`
    return
  }

  members.forEach(member => {
    if (!form.value.team_members.includes(member)) {
      form.value.team_members.push(member)
    }
  })
  memberInput.value = ''
  showMemberSuggestions.value = false
  error.value = ''
}

const addMemberFromSuggestion = (email: string) => {
  if (!form.value.team_members.includes(email)) {
    form.value.team_members.push(email)
  }
  memberInput.value = ''
  showMemberSuggestions.value = false
}

const removeMember = (index: number) => {
  form.value.team_members.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    status: '',
    tags: [],
    image_url: '',
    team_members: []
  }
  tagInput.value = ''
  memberInput.value = ''
  error.value = ''
  imageError.value = false
}

const handleSubmit = async () => {
  if (!profile.value) {
    error.value = 'Debes estar autenticado'
    return
  }

  if (!form.value.title.trim() || !form.value.description.trim()) {
    error.value = 'El título y la descripción son obligatorios'
    return
  }

  // Validar emails de miembros
  const invalid = form.value.team_members.find((m: string) => !isValidEmail(m))
  if (invalid) {
    error.value = `Email inválido en miembros: ${invalid}`
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: createError } = await projectsStore.createProject({
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      status: form.value.status,
      tags: form.value.tags,
      image_url: form.value.image_url.trim() || undefined,
      team_members: form.value.team_members,
      created_by: profile.value.id
    })

    if (createError) {
      error.value = 'Error al crear el proyecto'
    } else {
      // Mostrar éxito breve
      successMessage.value = 'Proyecto creado correctamente'
      showSuccessToast.value = true
      setTimeout(() => { showSuccessToast.value = false }, 2500)

      resetForm()
      emit('created')
    }
  } catch {
    error.value = 'Error inesperado al crear el proyecto'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    resetForm()
  }
})

watch(() => form.value.image_url, () => {
  imageError.value = false
})

// Utilidades
const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
  return re.test(String(email).toLowerCase())
}
</script>
