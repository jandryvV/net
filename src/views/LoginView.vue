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
            :disabled="!isValid || loading"
            variant="primary"
            size="lg"
            block
            :label="loading ? $t('auth.login.loading') : $t('auth.login.submit')"
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules } from '@/composables/useValidation'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
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

// Recuperar contraseña
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetError = ref('')
const resetLoading = ref(false)

// Success toast
const showSuccessToast = ref(false)
const successMessage = ref('')

const validateField = (field: string, value: any) => {
  validate(field, value)
}

const handleLogin = async () => {
  clearErrors()
  generalError.value = ''

  if (!validateAll(form)) {
    return
  }

  loading.value = true

  try {
    const { error: loginError } = await authStore.signIn(form.email, form.password)

    if (loginError) {
      generalError.value = t('auth.validation.invalidCredentials')
    } else {
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
