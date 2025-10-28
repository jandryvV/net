<template>
  <div class="navbar bg-base-100 shadow-sm border-b border-base-300 sticky top-0 z-50">
    <div class="navbar-start">
      <!-- Mobile menu button -->
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle" @click="toggleSidebar">
          <Bars3Icon class="h-5 w-5" />
        </div>
      </div>

      <!-- Logo -->
      <router-link to="/" class="btn btn-ghost text-lg lg:text-xl font-bold">
        <RocketLaunchIcon class="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
        <span class="hidden sm:inline">{{ $t('app.name') }}</span>
      </router-link>
    </div>

    <!-- Desktop Navigation -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <router-link
            to="/"
            class="btn btn-ghost"
            :class="{ 'btn-active': $route.path === '/' }"
          >
            <HomeIcon class="h-4 w-4" />
            {{ $t('nav.home') }}
          </router-link>
        </li>
        <li v-if="profile">
          <router-link
            to="/my-projects"
            class="btn btn-ghost"
            :class="{ 'btn-active': $route.path === '/my-projects' }"
          >
            <FolderIcon class="h-4 w-4" />
            {{ $t('nav.myProjects') }}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navbar-end">
      <!-- Theme Toggle -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <SunIcon v-if="theme === 'light'" class="h-5 w-5" />
          <MoonIcon v-else-if="theme === 'dark'" class="h-5 w-5" />
          <ComputerDesktopIcon v-else class="h-5 w-5" />
        </div>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
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

      <!-- Language Toggle -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <LanguageIcon class="h-5 w-5" />
        </div>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a @click="changeLanguage('es')" :class="{ 'active': locale === 'es' }">
              {{ $t('language.spanish') }}
            </a>
          </li>
          <li>
            <a @click="changeLanguage('en')" :class="{ 'active': locale === 'en' }">
              {{ $t('language.english') }}
            </a>
          </li>
        </ul>
      </div>

      <!-- User Menu -->
      <div v-if="profile" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
            <img
              :src="profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`"
              :alt="profile.full_name"
              class="rounded-full"
            />
          </div>
        </div>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li class="menu-title">
            <span>{{ profile.full_name }}</span>
          </li>
          <li>
            <router-link to="/profile" class="justify-between">
              <div class="flex items-center gap-2">
                <UserCircleIcon class="h-4 w-4" />
                {{ $t('nav.profile') }}
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="justify-between">
              <div class="flex items-center gap-2">
                <Cog6ToothIcon class="h-4 w-4" />
                Configuración
              </div>
            </router-link>
          </li>
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
      <div v-else class="flex items-center space-x-1 lg:space-x-2">
        <!-- Mobile: Solo iconos -->
        <router-link to="/login" class="btn btn-ghost btn-sm lg:btn-md">
          <ArrowRightOnRectangleIcon class="h-4 w-4" />
          <span class="hidden md:inline">{{ $t('nav.login') }}</span>
        </router-link>
        <router-link to="/register" class="btn btn-primary btn-sm lg:btn-md">
          <UserPlusIcon class="h-4 w-4" />
          <span class="hidden md:inline">{{ $t('nav.register') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click="closeSidebar"
    >
      <div class="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-lg">
        <div class="p-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold">{{ $t('app.name') }}</h2>
            <button @click="closeSidebar" class="btn btn-ghost btn-sm btn-circle">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <ul class="menu w-full">
            <li>
              <router-link to="/" @click="closeSidebar">
                <HomeIcon class="h-5 w-5" />
                {{ $t('nav.home') }}
              </router-link>
            </li>
            <li v-if="profile">
              <router-link to="/my-projects" @click="closeSidebar">
                <FolderIcon class="h-5 w-5" />
                {{ $t('nav.myProjects') }}
              </router-link>
            </li>
            <li v-if="profile">
              <router-link to="/profile" @click="closeSidebar">
                <UserCircleIcon class="h-5 w-5" />
                {{ $t('nav.profile') }}
              </router-link>
            </li>
          </ul>
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
</script>
