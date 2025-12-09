<template>
  <div class="min-h-screen bg-base-200">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
            <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-5xl font-bold mb-4">{{ locale === 'es' ? 'ProjectHub' : 'ProjectHub' }}</h1>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            {{ locale === 'es' 
              ? 'La plataforma colaborativa que conecta desarrolladores y proyectos innovadores'
              : 'The collaborative platform that connects developers and innovative projects'
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- ¿Qué es ProjectHub? -->
      <div class="card bg-base-100 shadow-xl border border-base-300 mb-8">
        <div class="card-body">
          <h2 class="card-title text-3xl mb-4">
            {{ locale === 'es' ? '¿Qué es ProjectHub?' : 'What is ProjectHub?' }}
          </h2>
          <p class="text-lg leading-relaxed">
            {{ locale === 'es'
              ? 'ProjectHub es una red social diseñada específicamente para desarrolladores y creadores de tecnología. Aquí puedes compartir tus proyectos, colaborar con otros desarrolladores, y descubrir ideas innovadoras de todo el mundo.'
              : 'ProjectHub is a social network designed specifically for developers and technology creators. Here you can share your projects, collaborate with other developers, and discover innovative ideas from around the world.'
            }}
          </p>
        </div>
      </div>

      <!-- Características principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-primary/10 rounded-lg">
                <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Gestiona Proyectos' : 'Manage Projects' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Crea, organiza y comparte tus proyectos con descripciones detalladas, etiquetas y estados de progreso.'
                : 'Create, organize and share your projects with detailed descriptions, tags and progress status.'
              }}
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-secondary/10 rounded-lg">
                <svg class="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Colabora en Equipo' : 'Team Collaboration' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Invita miembros a tus proyectos, trabaja en conjunto y construye algo increíble juntos.'
                : 'Invite members to your projects, work together and build something amazing together.'
              }}
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-accent/10 rounded-lg">
                <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Descubre Ideas' : 'Discover Ideas' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Explora proyectos de otros desarrolladores, encuentra inspiración y aprende nuevas tecnologías.'
                : 'Explore projects from other developers, find inspiration and learn new technologies.'
              }}
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-success/10 rounded-lg">
                <svg class="h-6 w-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Comparte Conocimiento' : 'Share Knowledge' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Documenta tus experiencias, comparte aprendizajes y ayuda a otros desarrolladores a crecer.'
                : 'Document your experiences, share learnings and help other developers grow.'
              }}
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-warning/10 rounded-lg">
                <svg class="h-6 w-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Personalización' : 'Customization' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Tema claro/oscuro, accesibilidad mejorada, lector de voz y más opciones para tu comodidad.'
                : 'Light/dark theme, improved accessibility, text-to-speech and more options for your comfort.'
              }}
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-error/10 rounded-lg">
                <svg class="h-6 w-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="card-title text-xl">
                {{ locale === 'es' ? 'Seguro y Confiable' : 'Secure & Reliable' }}
              </h3>
            </div>
            <p>
              {{ locale === 'es'
                ? 'Tu información está protegida con autenticación segura y cifrado de datos de punta.'
                : 'Your information is protected with secure authentication and state-of-the-art data encryption.'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cómo empezar -->
      <div class="card bg-base-100 shadow-xl border border-base-300 mb-8">
        <div class="card-body">
          <h2 class="card-title text-3xl mb-6">
            {{ locale === 'es' ? '¿Cómo empezar?' : 'How to start?' }}
          </h2>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-2">
                  {{ locale === 'es' ? 'Crea tu cuenta' : 'Create your account' }}
                </h3>
                <p class="text-base-content/70">
                  {{ locale === 'es'
                    ? 'Regístrate con tu email y crea tu perfil personalizado en segundos.'
                    : 'Sign up with your email and create your personalized profile in seconds.'
                  }}
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-secondary text-secondary-content rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-2">
                  {{ locale === 'es' ? 'Crea tu primer proyecto' : 'Create your first project' }}
                </h3>
                <p class="text-base-content/70">
                  {{ locale === 'es'
                    ? 'Describe tu proyecto, agrega etiquetas y compártelo con la comunidad.'
                    : 'Describe your project, add tags and share it with the community.'
                  }}
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-accent text-accent-content rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-2">
                  {{ locale === 'es' ? 'Explora y colabora' : 'Explore and collaborate' }}
                </h3>
                <p class="text-base-content/70">
                  {{ locale === 'es'
                    ? 'Descubre proyectos interesantes, conecta con otros desarrolladores y empieza a colaborar.'
                    : 'Discover interesting projects, connect with other developers and start collaborating.'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Final -->
      <div class="text-center py-8">
        <router-link
          v-if="!authStore.user"
          to="/register"
          class="btn btn-primary btn-lg gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ locale === 'es' ? '¡Comienza ahora gratis!' : 'Start now for free!' }}
        </router-link>
        <router-link
          v-else
          to="/my-projects"
          class="btn btn-primary btn-lg gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ locale === 'es' ? 'Ver mis proyectos' : 'View my projects' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { locale } = useI18n()
const authStore = useAuthStore()
</script>
