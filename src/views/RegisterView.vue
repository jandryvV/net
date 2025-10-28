<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-center mb-6">Registrarse</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre completo</span>
            </label>
            <input
              v-model="fullName"
              type="text"
              placeholder="Tu nombre completo"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Contraseña</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirmar contraseña</span>
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              class="input input-bordered"
              required
            />
          </div>

          <!-- Términos y Políticas -->
          <div class="form-control mt-4">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                v-model="acceptTerms"
                type="checkbox"
                class="checkbox checkbox-primary checkbox-sm"
                required
              />
              <span class="label-text text-sm">
                Acepto los
                <a @click="showTerms = true" class="link link-primary cursor-pointer">Términos de uso</a>
                y la
                <a @click="showPrivacy = true" class="link link-primary cursor-pointer">Política de privacidad</a>
              </span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :class="{ 'loading': loading }"
              :disabled="loading || !acceptTerms"
            >
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
          </div>
        </form>

        <div class="divider">O</div>

        <div class="text-center">
          <p class="text-sm">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="link link-primary">
              Inicia sesión aquí
            </router-link>
          </p>
        </div>

        <div v-if="error" class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div v-if="success" class="alert alert-success mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Cuenta creada exitosamente. Verifica tu email.</span>
        </div>

        <!-- Success Toast -->
        <div v-if="showSuccessToast" class="toast toast-top toast-end">
          <div class="alert alert-success">
            <span>{{ successMessage }}</span>
          </div>
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

// Términos y políticas
const acceptTerms = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

// Success toast
const showSuccessToast = ref(false)
const successMessage = ref('')

const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  if (!acceptTerms.value) {
    error.value = 'Debes aceptar los términos de uso y política de privacidad'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const result = await authStore.signUp(email.value, password.value, fullName.value)

    if (result.error) {
      error.value = (result.error as any)?.message || 'Error al crear la cuenta'
      console.error('Registration error:', result.error)
    } else {
      success.value = true
      showSuccess('Cuenta creada exitosamente. Verifica tu email.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err: any) {
    error.value = err.message || 'Error al registrarse'
    console.error('Registration error:', err)
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
