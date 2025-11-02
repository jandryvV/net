<template>
  <div class="min-h-screen bg-gradient-to from-primary/5 to-secondary/5 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <ArrowRightOnRectangleIcon class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-2xl font-bold text-base-content">{{ $t('auth.login.title') }}</h2>
          <p class="text-base-content/60 mt-2">{{ $t('app.tagline') }}</p>
        </div>

        <!-- Progress Bar -->
        <FormProgress
          :progress="formProgress"
          :label="progressLabel"
        />

        <form @submit.prevent="handleLogin" class="space-y-6">
          <BaseInput
            v-model="form.email"
            type="email"
            :label="$t('auth.login.email')"
            :placeholder="'usuario@ejemplo.com'"
            :error="errors.email"
            :icon="AtSymbolIcon"
            required
            autocomplete="email"
            @blur="validateField('email', form.email)"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            :label="$t('auth.login.password')"
            :placeholder="'••••••••'"
            :error="errors.password"
            :icon="LockClosedIcon"
            required
            autocomplete="current-password"
            @blur="validateField('password', form.password)"
          />

          <div class="flex items-center justify-between">
            <label class="label cursor-pointer">
              <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
              <span class="label-text ml-2">Recordarme</span>
            </label>
            <a @click="showForgotPassword = true" class="link link-primary text-sm cursor-pointer">{{ $t('auth.login.forgotPassword') }}</a>
          </div>

          <BaseButton
            type="submit"
            :loading="loading"
            :disabled="!isValid || loading || isLocked"
            variant="primary"
            size="lg"
            block
            :label="isLocked 
              ? (useI18n().locale.value === 'es' ? `Bloqueado (${formatTime(remainingTime)})` : `Locked (${formatTime(remainingTime)})`)
              : (loading ? $t('auth.login.loading') : $t('auth.login.submit'))"
          />
        </form>

        <div class="divider text-base-content/40">{{ $t('common.or') }}</div>

        <div class="text-center">
          <p class="text-sm text-base-content/70">
            {{ $t('auth.login.noAccount') }}
            <router-link to="/register" class="link link-primary font-medium">
              {{ $t('auth.login.registerHere') }}
            </router-link>
          </p>
        </div>

        <div v-if="generalError" class="alert alert-error mt-4">
          <ExclamationCircleIcon class="h-5 w-5" />
          <span>{{ generalError }}</span>
        </div>

        <!-- Advertencia de intentos restantes -->
        <div v-if="!isLocked && loginAttempts.count > 0 && loginAttempts.count < MAX_ATTEMPTS" class="alert alert-warning mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            {{ useI18n().locale.value === 'es' 
              ? `Atención: Te quedan ${MAX_ATTEMPTS - loginAttempts.count} intentos antes del bloqueo.`
              : `Warning: ${MAX_ATTEMPTS - loginAttempts.count} attempts remaining before lockout.`
            }}
          </span>
        </div>

        <!-- Alerta de cuenta bloqueada -->
        <div v-if="isLocked" class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <div class="font-bold">
              {{ useI18n().locale.value === 'es' ? 'Cuenta temporalmente bloqueada' : 'Account temporarily locked' }}
            </div>
            <div class="text-sm">
              {{ useI18n().locale.value === 'es' 
                ? `Por seguridad, debes esperar ${formatTime(remainingTime)} antes de intentar nuevamente.`
                : `For security, you must wait ${formatTime(remainingTime)} before trying again.`
              }}
            </div>
          </div>
        </div>

        <!-- Success Toast -->
        <div v-if="showSuccessToast" class="toast toast-top toast-end">
          <div class="alert alert-success">
            <span>{{ successMessage }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Recuperar Contraseña -->
    <div v-if="showForgotPassword" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Recuperar Contraseña</h3>
        <div class="space-y-4">
          <p class="text-sm text-base-content/70">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="resetEmail"
              type="email"
              placeholder="tu@email.com"
              class="input input-bordered"
              required
            />
          </div>
          <div v-if="resetError" class="alert alert-error">
            <ExclamationCircleIcon class="h-5 w-5" />
            <span>{{ resetError }}</span>
          </div>
        </div>
        <div class="modal-action">
          <button @click="showForgotPassword = false" class="btn btn-ghost">
            Cancelar
          </button>
          <button
            @click="handleForgotPassword"
            class="btn btn-primary"
            :class="{ 'loading': resetLoading }"
            :disabled="resetLoading || !resetEmail"
          >
            {{ resetLoading ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showForgotPassword = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules } from '@/composables/useValidation'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormProgress from '@/components/ui/FormProgress.vue'
import {
  ArrowRightOnRectangleIcon,
  AtSymbolIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@/icons'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    validationRules.required(t('auth.validation.required')),
    validationRules.email(t('auth.validation.email'))
  ],
  password: [
    validationRules.required(t('auth.validation.required')),
    validationRules.minLength(6, t('auth.validation.minLength', { min: 6 }))
  ]
}

const { errors, isValid, validate, validateAll, clearErrors } = useFormValidation(rules)

const loading = ref(false)
const generalError = ref('')

// Sistema de bloqueo por intentos fallidos
const STORAGE_KEY = 'login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutos en milisegundos

interface LoginAttempts {
  count: number
  lockedUntil: number | null
  lastAttempt: number
}

const loginAttempts = ref<LoginAttempts>(getLoginAttempts())
const isLocked = ref(false)
const remainingTime = ref(0)

// Recuperar contraseña
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetError = ref('')
const resetLoading = ref(false)

// Success toast
const showSuccessToast = ref(false)
const successMessage = ref('')

// Funciones para manejar intentos de login
function getLoginAttempts(): LoginAttempts {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    // Verificar si el bloqueo ya expiró
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
      return { count: 0, lockedUntil: null, lastAttempt: 0 }
    }
    return data
  }
  return { count: 0, lockedUntil: null, lastAttempt: 0 }
}

function saveLoginAttempts(attempts: LoginAttempts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  loginAttempts.value = attempts
}

function checkIfLocked() {
  const attempts = getLoginAttempts()
  
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    isLocked.value = true
    remainingTime.value = Math.ceil((attempts.lockedUntil - Date.now()) / 1000)
    
    // Actualizar contador cada segundo
    const interval = setInterval(() => {
      const remaining = Math.ceil((attempts.lockedUntil! - Date.now()) / 1000)
      if (remaining <= 0) {
        clearInterval(interval)
        isLocked.value = false
        remainingTime.value = 0
        saveLoginAttempts({ count: 0, lockedUntil: null, lastAttempt: 0 })
      } else {
        remainingTime.value = remaining
      }
    }, 1000)
    
    return true
  }
  
  isLocked.value = false
  return false
}

function recordFailedAttempt() {
  const attempts = getLoginAttempts()
  const newCount = attempts.count + 1
  
  if (newCount >= MAX_ATTEMPTS) {
    // Bloquear usuario
    const lockedUntil = Date.now() + LOCKOUT_DURATION
    saveLoginAttempts({
      count: newCount,
      lockedUntil,
      lastAttempt: Date.now()
    })
    checkIfLocked()
  } else {
    saveLoginAttempts({
      count: newCount,
      lockedUntil: null,
      lastAttempt: Date.now()
    })
  }
}

function resetAttempts() {
  saveLoginAttempts({ count: 0, lockedUntil: null, lastAttempt: 0 })
  isLocked.value = false
  remainingTime.value = 0
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Verificar bloqueo al montar el componente
checkIfLocked()

// Form Progress
const formProgress = computed(() => {
  let progress = 0
  const totalFields = 2
  
  if (form.email && !errors.value.email) progress += 50
  if (form.password && !errors.value.password) progress += 50
  
  return progress
})

const progressLabel = computed(() => {
  const locale = useI18n().locale.value
  if (formProgress.value === 100) {
    return locale === 'es' ? '¡Listo para iniciar sesión!' : 'Ready to sign in!'
  } else if (formProgress.value >= 50) {
    return locale === 'es' ? 'Casi listo...' : 'Almost there...'
  } else {
    return locale === 'es' ? 'Completa el formulario' : 'Complete the form'
  }
})

const validateField = (field: string, value: any) => {
  validate(field, value)
}

const handleLogin = async () => {
  clearErrors()
  generalError.value = ''

  // Verificar si está bloqueado
  if (checkIfLocked()) {
    const locale = useI18n().locale.value
    generalError.value = locale === 'es' 
      ? `Demasiados intentos fallidos. Cuenta bloqueada por ${formatTime(remainingTime.value)}.`
      : `Too many failed attempts. Account locked for ${formatTime(remainingTime.value)}.`
    return
  }

  if (!validateAll(form)) {
    return
  }

  loading.value = true

  try {
    const { error: loginError } = await authStore.signIn(form.email, form.password)

    if (loginError) {
      // Registrar intento fallido
      recordFailedAttempt()
      
      const locale = useI18n().locale.value
      const attemptsLeft = MAX_ATTEMPTS - loginAttempts.value.count
      
      if (attemptsLeft > 0) {
        generalError.value = locale === 'es'
          ? `${t('auth.validation.invalidCredentials')}. Te quedan ${attemptsLeft} intentos.`
          : `${t('auth.validation.invalidCredentials')}. ${attemptsLeft} attempts remaining.`
      } else {
        generalError.value = locale === 'es'
          ? `Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.`
          : `Too many failed attempts. Account locked for 15 minutes.`
        checkIfLocked()
      }
    } else {
      // Login exitoso - resetear intentos
      resetAttempts()
      
      // Mostrar mensaje de éxito
      showSuccess('Inicio de sesión exitoso')

      // Check for stored redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      localStorage.removeItem('redirectAfterLogin')

      // Redirect to stored path or home
      router.push(redirectPath || '/')
    }
  } catch (err) {
    generalError.value = t('auth.validation.error')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!resetEmail.value) {
    resetError.value = 'Por favor ingresa tu email'
    return
  }

  if (!/\S+@\S+\.\S+/.test(resetEmail.value)) {
    resetError.value = 'Por favor ingresa un email válido'
    return
  }

  resetLoading.value = true
  resetError.value = ''

  try {
    // Simular envío de email (aquí usarías supabase.auth.resetPasswordForEmail)
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simular delay

    showSuccess('Enlace de recuperación enviado a tu email')
    showForgotPassword.value = false
    resetEmail.value = ''
  } catch (error) {
    resetError.value = 'Error al enviar el enlace. Intenta nuevamente.'
  } finally {
    resetLoading.value = false
  }
}

const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}
</script>
