<template>
  <footer class="bg-base-100 border-t border-base-300 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Información institucional -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-xl font-bold text-base-content mb-4">{{ t('footer.title') }}</h3>
          <p class="text-base-content/70 mb-4">
            {{ t('footer.description') }}
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-base-content/60 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-base-content/60 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" class="text-base-content/60 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Soporte/Contacto -->
        <div>
          <h4 class="text-lg font-semibold text-base-content mb-4">{{ t('footer.support.title') }}</h4>
          <ul class="space-y-2 text-base-content/70">
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.support.helpCenter') }}</a>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.support.contact') }}</a>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.support.liveChat') }}</a>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.support.reportIssue') }}</a>
            </li>
            <li>
              <a href="mailto:support@devconnect.com" class="hover:text-primary transition-colors">
                {{ t('footer.support.email') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Políticas/Términos -->
        <div>
          <h4 class="text-lg font-semibold text-base-content mb-4">{{ t('footer.legal.title') }}</h4>
          <ul class="space-y-2 text-base-content/70">
            <li>
              <button @click="showTermsModal = true" class="hover:text-primary transition-colors text-left">
                {{ t('footer.legal.terms') }}
              </button>
            </li>
            <li>
              <button @click="showPrivacyModal = true" class="hover:text-primary transition-colors text-left">
                {{ t('footer.legal.privacy') }}
              </button>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.legal.cookies') }}</a>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.legal.conduct') }}</a>
            </li>
            <li>
              <a href="#" class="hover:text-primary transition-colors">{{ t('footer.legal.licenses') }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-base-300 mt-8 pt-8 text-center">
        <p class="text-base-content/60">
          {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <p class="text-base-content/50 text-sm mt-2">
          {{ t('footer.madeWith') }}
        </p>
      </div>
    </div>

    <!-- Modal de Términos de Uso -->
    <div v-if="showTermsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header del Modal -->
        <div class="bg-gradient-to-r from-primary to-secondary text-primary-content p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">{{ t('termsModal.title') }}</h2>
              <p class="text-sm opacity-90 mt-1">{{ t('termsModal.lastUpdated') }}</p>
            </div>
            <button
              @click="showTermsModal = false"
              class="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Sección 1: Aceptación -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <DocumentIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.acceptance.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.acceptance.content') }}
            </p>
          </div>

          <!-- Sección 2: Cuenta de Usuario -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <UsersIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.userAccount.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.userAccount.content') }}
            </p>
          </div>

          <!-- Sección 3: Contenido -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <PhotoIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.content.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.content.content') }}
            </p>
          </div>

          <!-- Sección 4: Código de Conducta -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <StarIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.conduct.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.conduct.content') }}
            </p>
          </div>

          <!-- Sección 5: Propiedad Intelectual -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <DocumentIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.intellectual.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.intellectual.content') }}
            </p>
          </div>

          <!-- Sección 6: Terminación -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <XMarkIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.termination.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.termination.content') }}
            </p>
          </div>

          <!-- Sección 7: Modificaciones -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.changes.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.changes.content') }}
            </p>
          </div>

          <!-- Sección 8: Contacto -->
          <div class="space-y-3 bg-base-200 p-4 rounded-lg">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <ChatBubbleLeftIcon class="h-5 w-5 text-primary" />
              {{ t('termsModal.sections.contact.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('termsModal.sections.contact.content') }}
            </p>
          </div>
        </div>

        <!-- Footer del Modal -->
        <div class="border-t border-base-300 p-6 bg-base-200">
          <button
            @click="showTermsModal = false"
            class="btn btn-primary w-full"
          >
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Política de Privacidad -->
    <div v-if="showPrivacyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header del Modal -->
        <div class="bg-gradient-to-r from-primary to-secondary text-primary-content p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">{{ t('privacyModal.title') }}</h2>
              <p class="text-sm opacity-90 mt-1">{{ t('privacyModal.lastUpdated') }}</p>
            </div>
            <button
              @click="showPrivacyModal = false"
              class="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Sección 1: Introducción -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <DocumentIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.intro.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.intro.content') }}
            </p>
          </div>

          <!-- Sección 2: Información que Recopilamos -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <FolderIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.collection.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.collection.content') }}
            </p>
          </div>

          <!-- Sección 3: Uso de la Información -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <StarIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.usage.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.usage.content') }}
            </p>
          </div>

          <!-- Sección 4: Compartir Información -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <UsersIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.sharing.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.sharing.content') }}
            </p>
          </div>

          <!-- Sección 5: Seguridad -->
          <div class="space-y-3 bg-success/10 p-4 rounded-lg border border-success/20">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <svg class="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              {{ t('privacyModal.sections.security.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.security.content') }}
            </p>
          </div>

          <!-- Sección 6: Cookies -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              {{ t('privacyModal.sections.cookies.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.cookies.content') }}
            </p>
          </div>

          <!-- Sección 7: Sus Derechos -->
          <div class="space-y-3 bg-info/10 p-4 rounded-lg border border-info/20">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <svg class="h-5 w-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ t('privacyModal.sections.rights.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.rights.content') }}
            </p>
          </div>

          <!-- Sección 8: Privacidad de Menores -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <UsersIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.children.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.children.content') }}
            </p>
          </div>

          <!-- Sección 9: Transferencias Internacionales -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ t('privacyModal.sections.international.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.international.content') }}
            </p>
          </div>

          <!-- Sección 10: Cambios -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.changes.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.changes.content') }}
            </p>
          </div>

          <!-- Sección 11: Contacto -->
          <div class="space-y-3 bg-base-200 p-4 rounded-lg">
            <h3 class="text-lg font-bold text-base-content flex items-center gap-2">
              <ChatBubbleLeftIcon class="h-5 w-5 text-primary" />
              {{ t('privacyModal.sections.contact.title') }}
            </h3>
            <p class="text-base-content/80 leading-relaxed">
              {{ t('privacyModal.sections.contact.content') }}
            </p>
          </div>
        </div>

        <!-- Footer del Modal -->
        <div class="border-t border-base-300 p-6 bg-base-200">
          <button
            @click="showPrivacyModal = false"
            class="btn btn-primary w-full"
          >
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import {
  XMarkIcon,
  DocumentIcon,
  UsersIcon,
  PhotoIcon,
  StarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  FolderIcon
} from '@/icons'

const { t } = useTranslation()

const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
</script>
