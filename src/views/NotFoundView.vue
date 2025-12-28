<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Error Illustration -->
        <div class="mb-8">
          <div
            class="bg-linear-to-br from-primary/20 to-secondary/20 rounded-full w-48 h-48 mx-auto flex items-center justify-center mb-8"
          >
            <div class="text-8xl font-bold text-primary/60">404</div>
          </div>

          <!-- Animated Icons -->
          <div class="flex justify-center gap-4 mb-8">
            <div class="animate-bounce" style="animation-delay: 0s">
              <ExclamationTriangleIcon class="h-8 w-8 text-warning" />
            </div>
            <div class="animate-bounce" style="animation-delay: 0.2s">
              <MagnifyingGlassIcon class="h-8 w-8 text-info" />
            </div>
            <div class="animate-bounce" style="animation-delay: 0.4s">
              <QuestionMarkCircleIcon class="h-8 w-8 text-secondary" />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-6 mb-12">
          <h1 class="text-4xl md:text-6xl font-bold">
            <span class="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              ¡Oops!
            </span>
          </h1>

          <p class="text-lg text-base-content/60 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida a otra ubicación.
          </p>
        </div>

        <!-- Additional Actions -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="goBack" class="btn btn-outline gap-2">
              <ArrowLeftIcon class="h-5 w-5" />
              Volver Atrás
            </button>

            <router-link to="/" class="btn btn-outline gap-2">
              <HomeIcon class="h-5 w-5" />
              Ir al Inicio
            </router-link>

            <router-link to="/my-projects" v-if="isAuthenticated" class="btn btn-outline gap-2">
              <UserIcon class="h-5 w-5" />
              Mis Proyectos
            </router-link>

            <router-link to="/login" v-else class="btn btn-outline gap-2">
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              Iniciar Sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
  FolderIcon,
  ArrowLeftIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isAuthenticated = computed(() => !!user.value)

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -8px, 0);
  }

  70% {
    transform: translate3d(0, -4px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
