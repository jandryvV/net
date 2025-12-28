<template>
  <div
    class="min-h-screen bg-gradient-to from-primary/5 to-secondary/5 flex items-center justify-center p-4"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body p-8">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
          >
            <LockClosedIcon class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-2xl font-bold text-base-content">
            {{ $t('auth.resetPassword.title') || 'Restablecer Contraseña' }}
          </h2>
          <p class="text-base-content/60 mt-2">
            {{ $t('auth.resetPassword.subtitle') || 'Ingresa tu nueva contraseña' }}
          </p>
        </div>

        <!-- Progress Bar -->
        <FormProgress :progress="formProgress" :label="progressLabel" />

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <BaseInput
            v-model="form.password"
            type="password"
            :label="$t('auth.register.password') || 'Nueva Contraseña'"
            :placeholder="'••••••••'"
            :error="errors.password"
            :icon="LockClosedIcon"
            required
            autocomplete="new-password"
            @blur="validateField('password', form.password)"
          />

          <BaseInput
            v-model="form.confirmPassword"
            type="password"
            :label="$t('auth.register.confirmPassword') || 'Confirmar Contraseña'"
            :placeholder="'••••••••'"
            :error="errors.confirmPassword"
            :icon="LockClosedIcon"
            required
            autocomplete="new-password"
            @blur="validateField('confirmPassword', form.confirmPassword)"
          />

          <!-- Indicador de fortaleza de contraseña -->
          <div v-if="form.password" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-base-content/70">Fortaleza de la contraseña:</span>
              <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
            </div>
            <progress
              class="progress w-full"
              :class="passwordStrengthColor"
              :value="passwordStrength"
              max="100"
            ></progress>
          </div>

          <BaseButton
            type="submit"
            :loading="loading"
            :disabled="!isValid || loading"
            variant="primary"
            size="lg"
            block
            :label="loading ? 'Actualizando...' : 'Actualizar Contraseña'"
          />
        </form>

        <div class="text-center mt-6">
          <router-link to="/login" class="link link-primary text-sm">
            {{ $t('auth.resetPassword.backToLogin') || 'Volver al inicio de sesión' }}
          </router-link>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules } from '@/composables/useValidation'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormProgress from '@/components/ui/FormProgress.vue'
import { LockClosedIcon, ExclamationCircleIcon } from '@/icons'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  password: '',
  confirmPassword: '',
})

const rules = {
  password: [
    validationRules.required(t('auth.validation.required') || 'Campo requerido'),
    validationRules.minLength(
      6,
      t('auth.validation.minLength', { min: 6 }) || 'Mínimo 6 caracteres',
    ),
  ],
  confirmPassword: [
    validationRules.required(t('auth.validation.required') || 'Campo requerido'),
    {
      validator: (value: string) => value === form.password,
      message: locale.value === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match',
    },
  ],
}

const { errors, isValid, validate, validateAll, clearErrors } = useFormValidation(rules)

const loading = ref(false)
const generalError = ref('')
const showSuccessToast = ref(false)
const successMessage = ref('')

// Form Progress
const formProgress = computed(() => {
  let progress = 0

  if (form.password && !errors.value.password) progress += 50
  if (form.confirmPassword && !errors.value.confirmPassword) progress += 50

  return progress
})

const progressLabel = computed(() => {
  if (formProgress.value === 100) {
    return locale.value === 'es' ? '¡Listo para actualizar!' : 'Ready to update!'
  } else if (formProgress.value >= 50) {
    return locale.value === 'es' ? 'Casi listo...' : 'Almost there...'
  } else {
    return locale.value === 'es' ? 'Completa el formulario' : 'Complete the form'
  }
})

// Password strength indicator
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0

  let strength = 0

  // Length
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 15

  // Contains numbers
  if (/\d/.test(password)) strength += 20

  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 15

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 15

  // Contains special chars
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10

  return Math.min(strength, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value

  if (strength < 40) return locale.value === 'es' ? 'Débil' : 'Weak'
  if (strength < 70) return locale.value === 'es' ? 'Media' : 'Medium'
  return locale.value === 'es' ? 'Fuerte' : 'Strong'
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value

  if (strength < 40) return 'progress-error text-error'
  if (strength < 70) return 'progress-warning text-warning'
  return 'progress-success text-success'
})

const validateField = (field: string, value: string) => {
  validate(field, value)
}

const handleResetPassword = async () => {
  clearErrors()
  generalError.value = ''

  if (!validateAll(form)) {
    return
  }

  loading.value = true

  try {
    // Actualizar contraseña en Supabase
    const { error } = await supabase.auth.updateUser({
      password: form.password,
    })

    if (error) {
      console.error('Reset password error:', error)
      generalError.value =
        locale.value === 'es'
          ? 'Error al actualizar la contraseña. El enlace puede haber expirado.'
          : 'Error updating password. The link may have expired.'
      return
    }

    // Mostrar mensaje de éxito primero
    showSuccess(
      locale.value === 'es'
        ? '¡Contraseña actualizada exitosamente! Inicia sesión con tu nueva contraseña.'
        : 'Password updated successfully! Sign in with your new password.',
    )

    // Cerrar sesión completamente y redirigir
    await authStore.signOut()

    // Esperar un momento antes de redirigir para que vea el mensaje
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Redirigir al login sin sesión
    await router.push('/login')
  } catch (err) {
    console.error('Unexpected error:', err)
    generalError.value =
      locale.value === 'es'
        ? 'Error al actualizar la contraseña. Intenta nuevamente.'
        : 'Error updating password. Please try again.'
  } finally {
    loading.value = false
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
