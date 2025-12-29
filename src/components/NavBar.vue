<template>
  <div class="navbar bg-base-100 shadow-lg border-b border-base-300 sticky top-0 z-50">
    <div class="navbar-start">
      <!-- Mobile menu button -->
      <div class="lg:hidden">
        <button @click="toggleSidebar" class="btn btn-ghost btn-circle">
          <Bars3Icon class="h-5 w-5" />
        </button>
      </div>

      <!-- Logo -->
      <router-link to="/" class="hidden sm:inline ml-1 text-lg lg:text-xl font-bold">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" class="h-8 w-8 sm:h-8 sm:w-8" />
          <span>{{ $t('app.name') }}</span>
        </div>
      </router-link>
    </div>

    <!-- Desktop Navigation -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-1">
        <li>
          <router-link to="/" class="btn btn-ghost btn-sm" :class="{ 'btn-active': $route.path === '/' }">
            <HomeIcon class="h-4 w-4" />
            {{ $t('nav.home') }}
          </router-link>
        </li>
        <li v-if="profile">
          <router-link to="/my-projects" class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': $route.path === '/my-projects' }">
            <FolderIcon class="h-4 w-4" />
            {{ $t('nav.myProjects') }}
          </router-link>
        </li>
        <!-- <li>
          <router-link to="/news" class="btn btn-ghost btn-sm" :class="{ 'btn-active': $route.path === '/news' }">
            <NewspaperIcon class="h-4 w-4" />
            {{ $t('nav.news') }}
          </router-link>
        </li>
        <li>
          <router-link to="/about" class="btn btn-ghost btn-sm" :class="{ 'btn-active': $route.path === '/about' }">
            <InformationCircleIcon class="h-4 w-4" />
            {{ $t('nav.about') }}
          </router-link>
        </li> -->
      </ul>
    </div>

    <div class="navbar-end flex items-center gap-1">
      <!-- Theme Toggle - Hidden on very small screens -->
      <div class="dropdown dropdown-end hidden sm:block">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm">
          <SunIcon v-if="theme === 'light'" class="h-4 w-4" />
          <MoonIcon v-else-if="theme === 'dark'" class="h-4 w-4" />
          <ComputerDesktopIcon v-else class="h-4 w-4" />
        </div>
        <ul tabindex="0"
          class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 z-50">
          <li>
            <a @click="setTheme('light')" :class="{ active: theme === 'light' }">
              <SunIcon class="h-4 w-4" />
              {{ $t('theme.light') }}
            </a>
          </li>
          <li>
            <a @click="setTheme('dark')" :class="{ active: theme === 'dark' }">
              <MoonIcon class="h-4 w-4" />
              {{ $t('theme.dark') }}
            </a>
          </li>
          <li>
            <a @click="setTheme('auto')" :class="{ active: theme === 'auto' }">
              <ComputerDesktopIcon class="h-4 w-4" />
              {{ $t('theme.auto') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Language Toggle - Hidden on very small screens -->
      <div class="dropdown dropdown-end hidden sm:block">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm">
          <LanguageIcon class="h-4 w-4" />
        </div>
        <ul tabindex="0"
          class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 z-50">
          <li>
            <a @click="changeLanguage('es')" :class="{ active: locale === 'es' }">
              🇪🇸 {{ $t('language.spanish') }}
            </a>
          </li>
          <li>
            <a @click="changeLanguage('en')" :class="{ active: locale === 'en' }">
              🇺🇸 {{ $t('language.english') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Keyboard Shortcuts Help Button -->
      <!-- <button @click="toggleKeyboardShortcutsHelp" class="btn btn-ghost btn-circle btn-sm hidden sm:flex"
        :title="$t('keyboardShortcuts.title')">
        <CommandLineIcon class="h-4 w-4" />
      </button> -->

      <!-- Accessibility Menu - Hidden on very small screens -->
      <div class="dropdown dropdown-end hidden sm:block">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm"
          :class="{ 'btn-primary': highContrast || ttsEnabled }">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <ul tabindex="0"
          class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-300 z-50">
          <li class="menu-title">
            <span>{{ $t('accessibility.title') }}</span>
          </li>
          <li>
            <a @click="toggleHighContrast" :class="{ active: highContrast }">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {{ $t('accessibility.highContrast') }}
              <span v-if="highContrast" class="badge badge-primary badge-sm">{{
                $t('common.active')
                }}</span>
            </a>
          </li>
          <li>
            <a @click="handleToggleTTS" :class="{ active: ttsEnabled }">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586a2 2 0 001.414.586h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 012.828 0l.814.814A2 2 0 0017.414 16h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 000-2.828l-.814-.814a2 2 0 01-.586-1.414V8a2 2 0 00-.586-1.414L19 5.172a2 2 0 00-2.828 0L15 6" />
              </svg>
              {{ $t('accessibility.textToSpeech') }}
              <span v-if="ttsEnabled" class="badge badge-primary badge-sm">{{
                $t('common.active')
                }}</span>
            </a>
          </li>
          <div class="divider my-1"></div>
          <li class="menu-title">
            <span>{{ $t('accessibility.zoom') }}</span>
          </li>
          <li>
            <div class="flex items-center justify-between p-2">
              <div class="flex gap-1">
                <button @click="handleDecreaseZoom" class="btn btn-xs btn-circle" :title="$t('accessibility.zoomOut')">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <button @click="handleResetZoom" class="btn btn-xs" :title="$t('accessibility.resetZoom')">
                  {{ zoomLevel }}%
                </button>
                <button @click="handleIncreaseZoom" class="btn btn-xs btn-circle" :title="$t('accessibility.zoomIn')">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
          <div v-if="ttsEnabled" class="divider my-1"></div>
          <li v-if="ttsEnabled">
            <a @click="handleReadPage" :disabled="isSpeaking">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {{ $t('accessibility.readPage') }}
            </a>
          </li>
          <li v-if="ttsEnabled && isSpeaking">
            <a @click="handleStopTTS" class="text-error">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              {{ $t('accessibility.stop') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Notifications (only for authenticated users) -->
      <NotificationDropdown v-if="profile" />

      <!-- User Menu -->
      <div v-if="profile" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm avatar">
          <div class="w-8 rounded-full ring-1 ring-primary ring-offset-1 ring-offset-base-100">
            <img :src="profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`
              " :alt="profile.full_name" class="rounded-full" />
          </div>
        </div>
        <ul tabindex="0"
          class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-300 z-50">
          <li class="menu-title">
            <span class="truncate">{{ profile.full_name }}</span>
          </li>
          <li>
            <router-link to="/profile">
              <UserCircleIcon class="h-4 w-4" />
              {{ $t('nav.profile') }}
            </router-link>
          </li>
          <li>
            <router-link to="/settings">
              <Cog6ToothIcon class="h-4 w-4" />
              {{ $t('nav.settings') }}
            </router-link>
          </li>
          <!-- Mobile-only options -->
          <div class="sm:hidden">
            <div class="divider my-1"></div>
            <li>
              <a @click="setTheme(theme === 'light' ? 'dark' : 'light')">
                <SunIcon v-if="theme === 'dark'" class="h-4 w-4" />
                <MoonIcon v-else class="h-4 w-4" />
                Cambiar tema
              </a>
            </li>
            <li>
              <a @click="changeLanguage(locale === 'es' ? 'en' : 'es')">
                <LanguageIcon class="h-4 w-4" />
                {{ locale === 'es' ? '🇺🇸 English' : '🇪🇸 Español' }}
              </a>
            </li>
          </div>
          <div class="divider my-1"></div>
          <li>
            <a @click="handleSignOut" class="text-error">
              <ArrowRightOnRectangleIcon class="h-4 w-4" />
              {{ $t('nav.logout') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Auth Buttons -->
      <div v-else class="flex items-center gap-1">
        <router-link to="/login" class="btn btn-ghost btn-sm">
          <ArrowRightOnRectangleIcon class="h-4 w-4" />
          <span class="hidden md:inline ml-1">{{ $t('nav.login') }}</span>
        </router-link>
        <router-link to="/register" class="btn btn-primary btn-sm">
          <UserPlusIcon class="h-4 w-4" />
          <span class="hidden md:inline ml-1">{{ $t('nav.register') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 modal modal-open bg-opacity-50 z-40 lg:hidden" @click="closeSidebar">
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 w-72 bg-base-100 shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }">
      <div class="p-4 h-full overflow-y-auto">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
          <div class="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" class="h-8 w-8" />
            <h2 class="text-lg font-bold">{{ $t('app.name') }}</h2>
          </div>
          <button @click="closeSidebar" class="btn btn-ghost btn-sm btn-circle">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Navigation Menu -->
        <ul class="menu w-full space-y-1">
          <li>
            <router-link to="/" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <HomeIcon class="h-5 w-5" />
              {{ $t('nav.home') }}
            </router-link>
          </li>
          <li v-if="profile">
            <router-link to="/my-projects" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <FolderIcon class="h-5 w-5" />
              {{ $t('nav.myProjects') }}
            </router-link>
          </li>
          <!-- <li>
            <router-link to="/news" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <NewspaperIcon class="h-5 w-5" />
              {{ $t('nav.news') }}
            </router-link>
          </li>
          <li>
            <router-link to="/about" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <InformationCircleIcon class="h-5 w-5" />
              {{ $t('nav.about') }}
            </router-link>
          </li>
          <li v-if="profile">
            <router-link to="/profile" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <UserCircleIcon class="h-5 w-5" />
              {{ $t('nav.profile') }}
            </router-link>
          </li>
          <li v-if="profile">
            <router-link to="/settings" @click="closeSidebar" class="flex items-center gap-3 p-3 rounded-lg">
              <Cog6ToothIcon class="h-5 w-5" />
              Configuración
            </router-link>
          </li> -->
        </ul>

        <!-- Mobile Accessibility -->
        <div class="mt-6 pt-6 border-t border-base-300">
          <h3 class="text-sm font-semibold text-base-content/70 mb-3">{{ $t('nav.accessibility') }}</h3>

          <!-- High Contrast Toggle -->
          <button @click="toggleHighContrast" class="flex items-center gap-3 p-3 rounded-lg w-full"
            :class="highContrast ? 'bg-primary text-primary-content' : 'hover:bg-base-200'">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {{ $t('accessibility.highContrast') }}
            <span v-if="highContrast" class="badge badge-primary badge-sm">{{
              $t('common.active')
              }}</span>
          </button>
          <!-- Text to Speech Toggle -->
          <button @click="handleToggleTTS" class="flex items-center gap-3 p-3 rounded-lg w-full mt-2"
            :class="ttsEnabled ? 'bg-primary text-primary-content' : 'hover:bg-base-200'">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586a2 2 0 001.414.586h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 012.828 0l.814.814A2 2 0 0017.414 16h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 000-2.828l-.814-.814a2 2 0 01-.586-1.414V8a2 2 0 00-.586-1.414L19 5.172a2 2 0 00-2.828 0L15 6" />
            </svg>
            {{ $t('accessibility.textToSpeech') }}
            <span v-if="ttsEnabled" class="badge badge-primary badge-sm">{{
              $t('common.active')
              }}</span>
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="mt-6 pt-6 border-t border-base-300">
          <h3 class="text-sm font-semibold text-base-content/70 mb-3">{{ $t('accessibility.zoom') }}</h3>
          <div class="flex items-center gap-2">
            <button @click="handleDecreaseZoom" class="btn btn-xs btn-circle" :title="$t('accessibility.zoomOut')">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <button @click="handleResetZoom" class="btn btn-xs" :title="$t('accessibility.resetZoom')">
              {{ zoomLevel }}%
            </button>
            <button @click="handleIncreaseZoom" class="btn btn-xs btn-circle" :title="$t('accessibility.zoomIn')">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>



        <!-- Auth Actions for Mobile -->
        <div v-if="!profile" class="mt-6 pt-6 border-t border-base-300 space-y-2">
          <router-link to="/login" @click="closeSidebar" class="btn btn-ghost w-full justify-start gap-3">
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            {{ $t('nav.login') }}
          </router-link>
          <router-link to="/register" @click="closeSidebar" class="btn btn-primary w-full justify-start gap-3">
            <UserPlusIcon class="h-5 w-5" />
            {{ $t('nav.register') }}
          </router-link>
        </div>

        <!-- Logout for Mobile -->
        <div v-if="profile" class="mt-6 pt-6 border-t border-base-300">
          <button @click="handleSignOut" class="btn btn-error btn-ghost w-full justify-start gap-3">
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            {{ $t('nav.logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import { useTextToSpeech } from '@/composables/useTextToSpeech'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import NotificationDropdown from './NotificationDropdown.vue'
import {
  RocketLaunchIcon,
  HomeIcon,
  FolderIcon,
  UserCircleIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  CommandLineIcon,
  InformationCircleIcon,
} from '@/icons'

const router = useRouter()
const { t, locale, changeLanguage } = useTranslation()
const authStore = useAuthStore()
const uiStore = useUIStore()

// Text to Speech
const {
  isEnabled: ttsEnabled,
  isSpeaking,
  toggleEnabled: toggleTTS,
  speak,
  stop: stopTTS,
} = useTextToSpeech()

const { profile } = storeToRefs(authStore)
const { theme, sidebarOpen, highContrast, zoomLevel } = storeToRefs(uiStore)
const {
  setTheme,
  toggleSidebar,
  closeSidebar,
  toggleHighContrast,
  toggleKeyboardShortcutsHelp,
  increaseZoom,
  decreaseZoom,
  resetZoom,
} = uiStore

const handleSignOut = async () => {
  await authStore.signOut()
  router.push('/login')
}

const handleThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setTheme(target.value as 'light' | 'dark' | 'auto')
}

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  changeLanguage(target.value as 'es' | 'en')
}

// Text to Speech handlers
const handleToggleTTS = () => {
  toggleTTS()
}

const handleReadPage = () => {
  const mainContent = document.querySelector('main') || document.body
  const text = mainContent.textContent || ''
  speak(text)
}

const handleStopTTS = () => {
  stopTTS()
}

// Zoom handlers
const handleIncreaseZoom = () => {
  increaseZoom()
}

const handleDecreaseZoom = () => {
  decreaseZoom()
}

const handleResetZoom = () => {
  resetZoom()
}
</script>
