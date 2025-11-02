<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4">
    <!-- Partículas decorativas de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-5xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        <!-- Panel izquierdo - Información -->
        <div class="hidden lg:block space-y-8 p-8">
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-8">
              <div class="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl shadow-lg">
                <svg class="w-8 h-8 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ProjectHub
              </h1>
            </div>
            
            <h2 class="text-3xl font-bold text-base-content">
              {{ t('auth.register.title') }}
            </h2>
            <p class="text-lg text-base-content/70">
              {{ t('auth.register.welcome.subtitle') }}
            </p>
          </div>

          <!-- Beneficios -->
          <div class="space-y-4">
            <div class="flex items-start gap-4 p-4 bg-base-100/50 rounded-xl border border-base-300/50 backdrop-blur-sm">
              <div class="bg-primary/10 p-2 rounded-lg">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ t('auth.register.welcome.benefit1Title') }}</h3>
                <p class="text-sm text-base-content/60">{{ t('auth.register.welcome.benefit1Desc') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 bg-base-100/50 rounded-xl border border-base-300/50 backdrop-blur-sm">
              <div class="bg-secondary/10 p-2 rounded-lg">
                <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ t('auth.register.welcome.benefit2Title') }}</h3>
                <p class="text-sm text-base-content/60">{{ t('auth.register.welcome.benefit2Desc') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 bg-base-100/50 rounded-xl border border-base-300/50 backdrop-blur-sm">
              <div class="bg-accent/10 p-2 rounded-lg">
                <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-base-content">{{ t('auth.register.welcome.benefit3Title') }}</h3>
                <p class="text-sm text-base-content/60">{{ t('auth.register.welcome.benefit3Desc') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel derecho - Formulario -->
        <div class="card bg-base-100 shadow-2xl border border-base-300/50 backdrop-blur-sm">
          <div class="card-body p-8">
            <!-- Logo móvil -->
            <div class="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div class="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <svg class="w-6 h-6 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold">{{ t('auth.register.title') }}</h2>
            </div>

            <!-- Progress Bar -->
            <FormProgress
              :progress="formProgress"
              :label="progressLabel"
              :show-steps="true"
              :steps="4"
              :current-step="currentStep"
              :step-labels="stepLabels"
            />

            <form @submit.prevent="handleRegister" class="space-y-5">
              <!-- Nombre completo -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ t('auth.register.fullName') }}
                  </span>
                </label>
                <input
                  v-model="fullName"
                  type="text"
                  :placeholder="t('auth.register.fullName')"
                  class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                  required
                />
              </div>

              <!-- Email -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ t('auth.register.email') }}
                  </span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="tu@email.com"
                  class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                  required
                />
              </div>

              <!-- Contraseña -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {{ t('auth.register.password') }}
                  </span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="input input-bordered input-lg w-full pr-12 focus:input-primary transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                    tabindex="-1"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <label class="label">
                  <span class="label-text-alt text-base-content/60">{{ t('auth.register.welcome.minCharacters') }}</span>
                </label>
              </div>

              <!-- Confirmar contraseña -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {{ t('auth.register.confirmPassword') }}
                  </span>
                </label>
                <div class="relative">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="input input-bordered input-lg w-full pr-12 focus:input-primary transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                    tabindex="-1"
                  >
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Términos y Políticas -->
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-3 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                  <input
                    v-model="acceptTerms"
                    type="checkbox"
                    class="checkbox checkbox-primary"
                    required
                  />
                  <span class="label-text text-sm">
                    {{ t('auth.register.acceptTerms') }}
                    <a @click="showTerms = true" class="link link-primary font-semibold cursor-pointer">{{ t('auth.register.termsOfUse') }}</a>
                    {{ t('auth.register.and') }}
                    <a @click="showPrivacy = true" class="link link-primary font-semibold cursor-pointer">{{ t('auth.register.privacyPolicy') }}</a>
                  </span>
                </label>
              </div>

              <!-- Alertas -->
              <div v-if="error" class="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ error }}</span>
              </div>

              <div v-if="success" class="alert alert-success shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ t('auth.register.success') }}</span>
              </div>

              <!-- Botón de registro -->
              <button
                type="submit"
                class="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl transition-all duration-300"
                :class="{ 'loading': loading }"
                :disabled="loading || !acceptTerms"
              >
                <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {{ loading ? t('auth.register.loading') : t('auth.register.submit') }}
              </button>
            </form>

            <div class="divider text-base-content/50">{{ t('common.or') }}</div>

            <!-- Link a login -->
            <div class="text-center p-4 bg-base-200/50 rounded-xl">
              <p class="text-sm text-base-content/70">
                {{ t('auth.register.hasAccount') }}
                <router-link to="/login" class="link link-primary font-semibold hover:link-hover">
                  {{ t('auth.register.loginHere') }}
                </router-link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <!-- Modal Términos de uso -->
    <div v-if="showTerms" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Términos de Uso</h3>
        <div class="space-y-4 text-sm max-h-96 overflow-y-auto">
          <p><strong>1. Aceptación de términos</strong></p>
          <p>Al registrarte en nuestra plataforma, aceptas cumplir con estos términos de uso.</p>

          <p><strong>2. Uso permitido</strong></p>
          <p>Puedes usar nuestra plataforma para compartir y colaborar en proyectos de manera constructiva.</p>

          <p><strong>3. Contenido del usuario</strong></p>
          <p>Eres responsable del contenido que publiques. No se permite contenido ofensivo o ilegal.</p>

          <p><strong>4. Privacidad</strong></p>
          <p>Respetamos tu privacidad según nuestra política de privacidad.</p>
        </div>
        <div class="modal-action">
          <button @click="showTerms = false" class="btn btn-primary">Entendido</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showTerms = false"></div>
    </div>

    <!-- Modal Política de privacidad -->
    <div v-if="showPrivacy" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Política de Privacidad</h3>
        <div class="space-y-4 text-sm max-h-96 overflow-y-auto">
          <p><strong>1. Información que recopilamos</strong></p>
          <p>Recopilamos información básica de registro como nombre y email.</p>

          <p><strong>2. Uso de la información</strong></p>
          <p>Usamos tu información para proporcionarte nuestros servicios y mejorar la experiencia.</p>

          <p><strong>3. Compartir información</strong></p>
          <p>No compartimos tu información personal con terceros sin tu consentimiento.</p>

          <p><strong>4. Seguridad</strong></p>
          <p>Implementamos medidas de seguridad para proteger tu información.</p>
        </div>
        <div class="modal-action">
          <button @click="showPrivacy = false" class="btn btn-primary">Entendido</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showPrivacy = false"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/composables/useTranslation'
import FormProgress from '@/components/ui/FormProgress.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useTranslation()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

// Visibilidad de contraseñas
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Términos y políticas
const acceptTerms = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

// Success toast
const showSuccessToast = ref(false)
const successMessage = ref('')

// Form Progress
const formProgress = computed(() => {
  let progress = 0
  const totalSteps = 5
  
  if (fullName.value.trim().length > 0) progress += 20
  if (email.value.trim().length > 0 && email.value.includes('@')) progress += 20
  if (password.value.length >= 6) progress += 20
  if (confirmPassword.value.length >= 6 && password.value === confirmPassword.value) progress += 20
  if (acceptTerms.value) progress += 20
  
  return progress
})

const currentStep = computed(() => {
  if (acceptTerms.value && confirmPassword.value && password.value === confirmPassword.value) return 5
  if (confirmPassword.value && password.value === confirmPassword.value) return 4
  if (password.value.length >= 6) return 3
  if (email.value.includes('@')) return 2
  if (fullName.value) return 1
  return 1
})

const stepLabels = computed(() => {
  const isSpanish = locale.value === 'es'
  return isSpanish
    ? ['Nombre', 'Email', 'Contraseña', 'Confirmar', 'Términos']
    : ['Name', 'Email', 'Password', 'Confirm', 'Terms']
})

const progressLabel = computed(() => {
  const isSpanish = locale.value === 'es'
  if (formProgress.value === 100) {
    return isSpanish ? '¡Listo para registrarte!' : 'Ready to register!'
  } else if (formProgress.value >= 80) {
    return isSpanish ? 'Casi completo...' : 'Almost done...'
  } else if (formProgress.value >= 50) {
    return isSpanish ? 'Vas por buen camino' : 'You\'re doing great'
  } else {
    return isSpanish ? 'Completa tu registro' : 'Complete your registration'
  }
})

const validateForm = () => {
  error.value = ''

  if (!fullName.value.trim()) {
    error.value = t('auth.validation.required')
    return false
  }

  if (!email.value.trim()) {
    error.value = t('auth.validation.required')
    return false
  }

  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = t('auth.validation.email')
    return false
  }

  if (password.value.length < 6) {
    error.value = t('auth.validation.minLength', { min: 6 })
    return false
  }

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.validation.passwordMismatch')
    return false
  }

  if (!acceptTerms.value) {
    error.value = t('auth.validation.terms')
    return false
  }

  return true
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const result = await authStore.signUp(email.value, password.value, fullName.value)

    if (result.error) {
      error.value = result.error.message || 'Error al registrar usuario'
      return
    }

    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.message || 'Error al registrar usuario'
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
