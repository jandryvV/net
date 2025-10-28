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
      <router-link to="/" class="btn btn-ghost text-lg lg:text-xl font-bold flex-nowrap">
        <RocketLaunchIcon class="h-5 w-5 lg:h-6 lg:w-6 text-primary shrink-0" />
        <span class="hidden sm:inline ml-1">{{ $t('app.name') }}</span>
      </router-link>
    </div>

    <!-- Desktop Navigation -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-1">
        <li>
          <router-link
            to="/"
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': $route.path === '/' }"
          >
            <HomeIcon class="h-4 w-4" />
            {{ $t('nav.home') }}
          </router-link>
        </li>
        <li v-if="profile">
          <router-link
            to="/my-projects"
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': $route.path === '/my-projects' }"
          >
            <FolderIcon class="h-4 w-4" />
            {{ $t('nav.myProjects') }}
          </router-link>
        </li>
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
        <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 z-50">
          <li>
            <a @click="setTheme('light')" :class="{ 'active': theme === 'light' }">
              <SunIcon class="h-4 w-4" />
              {{ $t('theme.light') }}
            </a>
          </li>
          <li>
            <a @click="setTheme('dark')" :class="{ 'active': theme === 'dark' }">
              <MoonIcon class="h-4 w-4" />
              {{ $t('theme.dark') }}
            </a>
          </li>
          <li>
            <a @click="setTheme('auto')" :class="{ 'active': theme === 'auto' }">
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
        <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 z-50">
          <li>
            <a @click="changeLanguage('es')" :class="{ 'active': locale === 'es' }">
              🇪🇸 {{ $t('language.spanish') }}
            </a>
          </li>
          <li>
            <a @click="changeLanguage('en')" :class="{ 'active': locale === 'en' }">
              🇺🇸 {{ $t('language.english') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- User Menu -->
      <div v-if="profile" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm avatar">
          <div class="w-8 rounded-full ring-1 ring-primary ring-offset-1 ring-offset-base-100">
            <img
              :src="profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`"
              :alt="profile.full_name"
              class="rounded-full"
            />
          </div>
        </div>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-300 z-50">
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
              Configuración
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
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Mobile Sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 w-72 bg-base-100 shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
    >
      <div class="p-4 h-full overflow-y-auto">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
          <div class="flex items-center gap-2">
            <RocketLaunchIcon class="h-6 w-6 text-primary" />
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
          </li>
        </ul>

        <!-- Mobile Settings -->
        <div class="mt-6 pt-6 border-t border-base-300">
          <h3 class="text-sm font-semibold text-base-content/70 mb-3">Configuración</h3>

          <!-- Theme Toggle -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-base-200 mb-2">
            <div class="flex items-center gap-3">
              <SunIcon v-if="theme === 'light'" class="h-5 w-5" />
              <MoonIcon v-else-if="theme === 'dark'" class="h-5 w-5" />
              <ComputerDesktopIcon v-else class="h-5 w-5" />
              <span>Tema</span>
            </div>
            <select @change="handleThemeChange" :value="theme" class="select select-sm">
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <!-- Language Toggle -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-base-200">
            <div class="flex items-center gap-3">
              <LanguageIcon class="h-5 w-5" />
              <span>Idioma</span>
            </div>
            <select @change="handleLanguageChange" :value="locale" class="select select-sm">
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
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
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
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
  Cog6ToothIcon
} from '@/icons'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const uiStore = useUIStore()

const { profile } = storeToRefs(authStore)
const { theme, sidebarOpen } = storeToRefs(uiStore)
const { setTheme, toggleSidebar, closeSidebar, setLanguage } = uiStore

const handleSignOut = async () => {
  await authStore.signOut()
  router.push('/login')
}

const changeLanguage = (lang: 'es' | 'en') => {
  locale.value = lang
  setLanguage(lang)
}

const handleThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setTheme(target.value as 'light' | 'dark' | 'auto')
}

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  changeLanguage(target.value as 'es' | 'en')
}
</script>
