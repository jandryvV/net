<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div class="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-8 border border-primary/20">
        <div class="flex items-center gap-4">
          <div class="bg-primary/20 p-3 rounded-full">
            <Cog6ToothIcon class="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 class="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Configuración
            </h1>
            <p class="text-base-content/70 text-lg">
              Personaliza tu experiencia y gestiona tu cuenta
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-lg border border-base-300 sticky top-8">
            <div class="card-body p-4">
              <ul class="menu menu-vertical w-full">
                <li>
                  <a
                    :class="{ 'active': activeTab === 'account' }"
                    @click="activeTab = 'account'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <UserIcon class="h-5 w-5" />
                    Cuenta
                  </a>
                </li>
                <li>
                  <a
                    :class="{ 'active': activeTab === 'security' }"
                    @click="activeTab = 'security'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <LockClosedIcon class="h-5 w-5" />
                    Seguridad
                  </a>
                </li>
                <li>
                  <a
                    :class="{ 'active': activeTab === 'appearance' }"
                    @click="activeTab = 'appearance'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <PaintBrushIcon class="h-5 w-5" />
                    Apariencia
                  </a>
                </li>
                <li>
                  <a
                    :class="{ 'active': activeTab === 'notifications' }"
                    @click="activeTab = 'notifications'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <BellIcon class="h-5 w-5" />
                    Notificaciones
                  </a>
                </li>
                <li>
                  <a
                    :class="{ 'active': activeTab === 'privacy' }"
                    @click="activeTab = 'privacy'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <ShieldCheckIcon class="h-5 w-5" />
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    :class="{ 'active': activeTab === 'about' }"
                    @click="activeTab = 'about'"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg"
                  >
                    <InformationCircleIcon class="h-5 w-5" />
                    Acerca de
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
            <!-- Account Settings -->
            <div v-if="activeTab === 'account'" class="space-y-6">
                <div class="card bg-base-100 shadow-lg border border-base-300">
                <div class="card-body">
                <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                <UserIcon class="h-6 w-6 text-primary" />
                Información de la Cuenta
                </h2>

                <form @submit.prevent="updateAccount" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-control flex flex-col">
                  <label class="label mb-2">
                  <span class="label-text font-semibold">Nombre completo</span>
                  </label>
                  <input
                  v-model="accountForm.full_name"
                  type="text"
                  class="input input-bordered input-lg"
                  placeholder="Tu nombre completo"
                  />
                  </div>

                  <div class="form-control flex flex-col">
                  <label class="label mb-2">
                  <span class="label-text font-semibold">Email</span>
                  </label>
                  <input
                  v-model="accountForm.email"
                  type="email"
                  class="input input-bordered input-lg"
                  placeholder="tu@email.com"
                  readonly
                  />
                  <div class="label">
                  <span class="label-text-alt text-warning">El email no se puede cambiar</span>
                  </div>
                  </div>
                </div>

                <div class="form-control flex flex-col">
                  <label class="label mb-2">
                  <span class="label-text font-semibold">Biografía</span>
                  </label>
                  <textarea
                  v-model="accountForm.bio"
                  class="textarea textarea-bordered h-32"
                  placeholder="Cuéntanos sobre ti..."
                  maxlength="500"
                  readonly
                    :style="{
                    resize: 'none',
                    pointerEvents: 'none',
                    backgroundColor: 'var(--b1)'
                    }"
                  ></textarea>
                  <div class="label">
                  <span class="label-text-alt">{{ (accountForm.bio || '').length }}/500</span>
                  </div>
                </div>

                <div class="form-control flex flex-col">
                  <label class="label mb-2">
                  <span class="label-text font-semibold">Avatar URL</span>
                  </label>
                  <input
                  v-model="accountForm.avatar_url"
                  type="url"
                  class="input input-bordered input-lg"
                  placeholder="https://ejemplo.com/avatar.jpg"
                  />
                </div>

                <div class="flex justify-end">
                  <button
                  type="submit"
                  class="btn btn-primary btn-lg gap-2"
                  :class="{ 'loading': updating }"
                  :disabled="updating"
                  >
                  <CheckIcon v-if="!updating" class="h-5 w-5" />
                  {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
                </form>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="card bg-error/5 border border-error/20 shadow-lg">
              <div class="card-body">
                <h3 class="card-title text-error mb-4 flex items-center gap-2">
                  <ExclamationTriangleIcon class="h-6 w-6" />
                  Zona Peligrosa
                </h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center p-4 bg-base-100 rounded-lg border">
                    <div>
                      <h4 class="font-semibold">Eliminar cuenta</h4>
                      <p class="text-sm text-base-content/70">Esta acción no se puede deshacer</p>
                    </div>
                    <button
                      class="btn btn-error btn-outline"
                      @click="showDeleteModal = true"
                    >
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <!-- Security Settings -->
            <div v-if="activeTab === 'security'" class="space-y-6">
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
              <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                <LockClosedIcon class="h-6 w-6 text-primary" />
                Cambiar Contraseña
              </h2>

              <form @submit.prevent="changePassword" class="space-y-6">
                <div class="form-control flex flex-col">
                <label class="label mb-2">
                  <span class="label-text font-semibold">Contraseña actual</span>
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="input input-bordered input-lg"
                  placeholder="Tu contraseña actual"
                  required
                />
                </div>

                <div class="form-control flex flex-col">
                <label class="label mb-2">
                  <span class="label-text font-semibold">Nueva contraseña</span>
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="input input-bordered input-lg"
                  placeholder="Nueva contraseña"
                  required
                  minlength="6"
                />
                </div>

                <div class="form-control flex flex-col">
                <label class="label mb-2">
                  <span class="label-text font-semibold">Confirmar nueva contraseña</span>
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="input input-bordered input-lg"
                  placeholder="Confirmar nueva contraseña"
                  required
                />
                </div>

                <div v-if="passwordError" class="alert alert-error">
                <ExclamationTriangleIcon class="h-5 w-5" />
                {{ passwordError }}
                </div>

                <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg gap-2"
                  :class="{ 'loading': changingPassword }"
                  :disabled="changingPassword"
                >
                  <KeyIcon v-if="!changingPassword" class="h-5 w-5" />
                  {{ changingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
                </div>
              </form>
              </div>
            </div>

            <!-- Reset Password -->
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h3 class="card-title text-xl mb-4 flex items-center gap-2">
                  <KeyIcon class="h-6 w-6 text-warning" />
                  Recuperar Contraseña
                </h3>
                <div class="space-y-4">
                  <p class="text-base-content/80">
                    Envía un enlace de recuperación a tu email registrado
                  </p>
                  <button
                    @click="sendPasswordReset"
                    class="btn btn-outline btn-warning gap-2"
                    :disabled="sendingReset"
                    :class="{ 'loading': sendingReset }"
                  >
                    <KeyIcon v-if="!sendingReset" class="h-5 w-5" />
                    {{ sendingReset ? 'Enviando...' : 'Enviar enlace de recuperación' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Two Factor Authentication -->
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h3 class="card-title text-xl mb-4 flex items-center gap-2">
                  <ShieldCheckIcon class="h-6 w-6 text-success" />
                  Autenticación de Dos Factores
                </h3>
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-base-content/80">Agrega una capa extra de seguridad a tu cuenta</p>
                    <p class="text-sm text-base-content/60 mt-1">Proximamente disponible</p>
                  </div>
                  <input type="checkbox" class="toggle toggle-primary" disabled />
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance Settings -->
          <div v-if="activeTab === 'appearance'" class="space-y-6">
            <!-- Theme Selection -->
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                  <PaintBrushIcon class="h-6 w-6 text-primary" />
                  Tema
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    v-for="theme in themes"
                    :key="theme.name"
                    class="card cursor-pointer border-2 transition-all"
                    :class="currentTheme === theme.name ? 'border-primary shadow-lg' : 'border-base-300 hover:border-primary/50'"
                    @click="setTheme(theme.name)"
                  >
                    <div class="card-body p-4 text-center">
                      <div class="mb-3" :class="theme.preview"></div>
                      <h3 class="font-semibold">{{ theme.label }}</h3>
                      <p class="text-xs text-base-content/60">{{ theme.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Font Size -->
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
              <h3 class="card-title text-xl mb-4 flex items-center gap-2">
                <DocumentTextIcon class="h-6 w-6 text-primary" />
                Tamaño de Fuente
              </h3>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                <span>Tamaño de fuente</span>
                <div class="flex items-center gap-4">
                  <button
                  class="btn btn-sm btn-ghost"
                  @click="fontSize = Math.max(12, fontSize - 1); updateFontSize()"
                  :disabled="fontSize <= 12"
                  aria-label="Disminuir tamaño"
                  >-</button>
                  <span class="text-sm w-10 text-center">{{ fontSize }}px</span>
                  <button
                  class="btn btn-sm btn-ghost"
                  @click="fontSize = Math.min(20, fontSize + 1); updateFontSize()"
                  :disabled="fontSize >= 20"
                  aria-label="Aumentar tamaño"
                  >+</button>
                  <button
                  class="btn btn-xs btn-outline ml-2"
                  @click="fontSize = 14; updateFontSize()"
                  :disabled="fontSize === 14"
                  aria-label="Restablecer"
                  >Restablecer</button>
                </div>
                </div>

                <div class="bg-base-200 p-4 rounded-lg">
                <p :style="{ fontSize: fontSize + 'px' }">
                  Este es un ejemplo de texto con el tamaño de fuente seleccionado.
                </p>
                </div>
              </div>
              </div>
            </div>
            </div>


          <!-- Notifications Settings -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                  <BellIcon class="h-6 w-6 text-primary" />
                  Preferencias de Notificaciones
                </h2>

                <div class="space-y-6">
                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Comentarios en proyectos</h4>
                        <p class="text-sm text-base-content/70">Recibe notificaciones cuando comenten tus proyectos</p>
                      </div>
                      <input
                        v-model="notifications.comments"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="saveNotificationSettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Likes en proyectos</h4>
                        <p class="text-sm text-base-content/70">Recibe notificaciones cuando den like a tus proyectos</p>
                      </div>
                      <input
                        v-model="notifications.likes"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="saveNotificationSettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Nuevos seguidores</h4>
                        <p class="text-sm text-base-content/70">Recibe notificaciones de nuevos seguidores</p>
                      </div>
                      <input
                        v-model="notifications.followers"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="saveNotificationSettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Actualizaciones del sistema</h4>
                        <p class="text-sm text-base-content/70">Recibe notificaciones sobre nuevas funciones</p>
                      </div>
                      <input
                        v-model="notifications.updates"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="saveNotificationSettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Email de notificaciones</h4>
                        <p class="text-sm text-base-content/70">Recibe un resumen semanal por email</p>
                      </div>
                      <input
                        v-model="notifications.email"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="saveNotificationSettings"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div v-if="activeTab === 'privacy'" class="space-y-6">
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                  <ShieldCheckIcon class="h-6 w-6 text-primary" />
                  Configuración de Privacidad
                </h2>

                <div class="space-y-6">
                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Perfil público</h4>
                        <p class="text-sm text-base-content/70">Tu perfil será visible para otros usuarios</p>
                      </div>
                      <input
                        v-model="privacy.publicProfile"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="savePrivacySettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Mostrar email</h4>
                        <p class="text-sm text-base-content/70">Tu email será visible en tu perfil público</p>
                      </div>
                      <input
                        v-model="privacy.showEmail"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="savePrivacySettings"
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-semibold">Proyectos privados por defecto</h4>
                        <p class="text-sm text-base-content/70">Los nuevos proyectos serán privados automáticamente</p>
                      </div>
                      <input
                        v-model="privacy.defaultPrivateProjects"
                        type="checkbox"
                        class="toggle toggle-primary"
                        @change="savePrivacySettings"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Export -->
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h3 class="card-title text-xl mb-4 flex items-center gap-2">
                  <ArrowDownTrayIcon class="h-6 w-6 text-primary" />
                  Exportar Datos
                </h3>

                <div class="space-y-4">
                  <p class="text-base-content/80">
                    Descarga una copia de todos tus datos en formato JSON
                  </p>
                  <button
                    class="btn btn-outline btn-primary gap-2"
                    @click="exportData"
                    :disabled="exporting"
                    :class="{ 'loading': exporting }"
                  >
                    <ArrowDownTrayIcon v-if="!exporting" class="h-5 w-5" />
                    {{ exporting ? 'Exportando...' : 'Descargar Mis Datos' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- About Settings -->
          <div v-if="activeTab === 'about'" class="space-y-6">
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
                  <InformationCircleIcon class="h-6 w-6 text-primary" />
                  Acerca de la Aplicación
                </h2>

                <div class="space-y-6">
                  <div class="stats shadow">
                    <div class="stat">
                      <div class="stat-title">Versión</div>
                      <div class="stat-value text-primary">1.0.0</div>
                      <div class="stat-desc">Versión actual</div>
                    </div>

                    <div class="stat">
                      <div class="stat-title">Última actualización</div>
                      <div class="stat-value text-secondary">28 Oct</div>
                      <div class="stat-desc text-secondary">2025</div>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <button class="btn btn-outline w-full justify-start gap-3">
                      <DocumentTextIcon class="h-5 w-5" />
                      Términos de Servicio
                    </button>

                    <button class="btn btn-outline w-full justify-start gap-3">
                      <ShieldCheckIcon class="h-5 w-5" />
                      Política de Privacidad
                    </button>

                    <button class="btn btn-outline w-full justify-start gap-3">
                      <QuestionMarkCircleIcon class="h-5 w-5" />
                      Centro de Ayuda
                    </button>

                    <button class="btn btn-outline w-full justify-start gap-3">
                      <ChatBubbleLeftIcon class="h-5 w-5" />
                      Contactar Soporte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error mb-4">Eliminar Cuenta</h3>
        <div class="space-y-4">
          <p class="text-base-content/80">
            Esta acción eliminará permanentemente tu cuenta y todos tus datos.
            No podrás recuperar tu cuenta después de eliminarla.
          </p>

          <div class="bg-error/10 p-4 rounded-lg border border-error/20">
            <p class="text-sm font-semibold mb-2">Para confirmar, escribe "ELIMINAR" en el campo:</p>
            <input
              v-model="deleteConfirmation"
              type="text"
              class="input input-bordered w-full"
              placeholder="ELIMINAR"
            />
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" @click="showDeleteModal = false">
            Cancelar
          </button>
          <button
            class="btn btn-error"
            :disabled="deleteConfirmation !== 'ELIMINAR' || deleting"
            :class="{ 'loading': deleting }"
            @click="deleteAccount"
          >
            {{ deleting ? 'Eliminando...' : 'Eliminar Cuenta' }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showDeleteModal = false"></div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <CheckIcon class="h-5 w-5" />
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  Cog6ToothIcon,
  UserIcon,
  LockClosedIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  DocumentTextIcon,
  ViewColumnsIcon,
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

// Active tab
const activeTab = ref('account')

// Loading states
const updating = ref(false)
const changingPassword = ref(false)
const sendingReset = ref(false)
const deleting = ref(false)
const exporting = ref(false)

// Forms
const accountForm = ref({
  full_name: '',
  email: '',
  bio: '',
  avatar_url: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Error handling
const passwordError = ref('')

// Modals
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')

// Success feedback
const showSuccessToast = ref(false)
const successMessage = ref('')

// Theme settings
const themes = [
  {
    name: 'light',
    label: 'Claro',
    description: 'Tema clásico',
    preview: 'w-8 h-8 bg-white border-2 border-gray-300 rounded'
  },
  {
    name: 'dark',
    label: 'Oscuro',
    description: 'Fácil para los ojos',
    preview: 'w-8 h-8 bg-gray-800 rounded'
  },
]

const currentTheme = ref('light')
const fontSize = ref(14)
const interfaceDensity = ref('normal')

// Notification settings
const notifications = ref({
  comments: true,
  likes: true,
  followers: true,
  updates: false,
  email: false
})

// Privacy settings
const privacy = ref({
  publicProfile: true,
  showEmail: false,
  defaultPrivateProjects: false
})

// Initialize forms
const initializeForms = () => {
  if (profile.value) {
    accountForm.value = {
      full_name: profile.value.full_name || '',
      email: profile.value.email || '',
      bio: profile.value.bio || '',
      avatar_url: profile.value.avatar_url || ''
    }
  }

  // Load settings from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light'
  const savedFontSize = localStorage.getItem('fontSize') || '14'
  const savedDensity = localStorage.getItem('interfaceDensity') || 'normal'
  const savedNotifications = localStorage.getItem('notifications')
  const savedPrivacy = localStorage.getItem('privacy')

  currentTheme.value = savedTheme
  fontSize.value = parseInt(savedFontSize)
  interfaceDensity.value = savedDensity

  if (savedNotifications) {
    notifications.value = JSON.parse(savedNotifications)
  }

  if (savedPrivacy) {
    privacy.value = JSON.parse(savedPrivacy)
  }

  // Apply saved settings
  updateFontSize()
  updateDensity()
}

// Account functions
const updateAccount = async () => {
  updating.value = true
  try {
    await authStore.updateProfile(accountForm.value)
    showSuccess('Información actualizada correctamente')
  } catch (error) {
    console.error('Error updating account:', error)
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  changingPassword.value = true
  passwordError.value = ''

  try {
    await authStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    showSuccess('Contraseña cambiada correctamente')
  } catch (error: any) {
    passwordError.value = error.message || 'Error al cambiar la contraseña'
  } finally {
    changingPassword.value = false
  }
}

const sendPasswordReset = async () => {
  sendingReset.value = true
  try {
    if (profile.value?.email) {
      await authStore.resetPassword(profile.value.email)
      showSuccess('Enlace de recuperación enviado a tu email')
    }
  } catch (error: any) {
    console.error('Error sending password reset:', error)
    showSuccess('Error al enviar el enlace de recuperación')
  } finally {
    sendingReset.value = false
  }
}

const deleteAccount = async () => {
  deleting.value = true
  try {
    await authStore.deleteAccount()
    router.push('/')
  } catch (error) {
    console.error('Error deleting account:', error)
  } finally {
    deleting.value = false
  }
}

// Theme functions
const setTheme = (theme: string) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  showSuccess('Tema cambiado a ' + (theme === 'light' ? 'Claro' : 'Oscuro'))
  showSuccess('Tema actualizado')
}

const updateFontSize = () => {
  document.documentElement.style.fontSize = fontSize.value + 'px'
  localStorage.setItem('fontSize', fontSize.value.toString())
}

const updateDensity = () => {
  document.documentElement.className = document.documentElement.className
    .replace(/density-\w+/g, '')
  document.documentElement.classList.add(`density-${interfaceDensity.value}`)
  localStorage.setItem('interfaceDensity', interfaceDensity.value)
  // No mostrar mensaje para cambios de densidad
}

// Settings functions
const saveNotificationSettings = () => {
  localStorage.setItem('notifications', JSON.stringify(notifications.value))
  showSuccess('Preferencias de notificaciones guardadas')
}

const savePrivacySettings = () => {
  localStorage.setItem('privacy', JSON.stringify(privacy.value))
  showSuccess('Configuración de privacidad guardada')
}

const exportData = async () => {
  exporting.value = true
  try {
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000))

    const userData = {
      profile: profile.value,
      settings: {
        theme: currentTheme.value,
        fontSize: fontSize.value,
        density: interfaceDensity.value,
        notifications: notifications.value,
        privacy: privacy.value
      },
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()

    showSuccess('Datos exportados correctamente')
  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    exporting.value = false
  }
}

// Utility functions
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

onMounted(() => {
  initializeForms()
})
</script>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.menu li > *:where(.active) {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}

/* Density classes */
:global(.density-compact) {
  --spacing-unit: 0.75rem;
}

:global(.density-normal) {
  --spacing-unit: 1rem;
}

:global(.density-comfortable) {
  --spacing-unit: 1.5rem;
}
</style>
