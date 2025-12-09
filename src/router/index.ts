import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import AboutView from '@/views/AboutView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MyProjectsView from '@/views/MyProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import ProjectEditView from '@/views/ProjectEditView.vue'
import SettingsView from '@/views/SettingsView.vue'
import NewsView from '@/views/NewsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView
      // No requiere guest ni auth - permite acceso directo desde email
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/my-projects',
      name: 'my-projects',
      component: MyProjectsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: ProjectEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/404',
      name: 'not-found',
      component: NotFoundView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Ensure auth is initialized
  if (!authStore.user && !authStore.loading) {
    await authStore.initAuth()
  }

  // Wait a bit if still loading (max 3 seconds)
  let waitCount = 0
  while (authStore.loading && waitCount < 30) {
    await new Promise(resolve => setTimeout(resolve, 100))
    waitCount++
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = !!authStore.user

  // Debug log for development
  console.log('🚦 Router Guard:', {
    path: to.path,
    requiresAuth,
    requiresGuest,
    isAuthenticated,
    userEmail: authStore.user?.email || 'not logged in'
  })

  // Handle different route types
  if (requiresAuth && !isAuthenticated) {
    // Protected route but user not authenticated
    if (to.path !== '/login') {
      localStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Guest-only route but user is authenticated
    console.log('🚫 BLOCKED: Authenticated user trying to access guest-only page:', to.path, '-> redirecting to /')
    next('/')
  } else {
    // Normal navigation - clear stored redirect if not going to auth pages
    if (!['login', 'register'].includes(to.name as string)) {
      localStorage.removeItem('redirectAfterLogin')
    }
    next()
  }
})

// Handle redirects after login
router.afterEach((to) => {
  if (to.name === 'home') {
    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath && redirectPath !== '/login' && redirectPath !== '/register') {
      localStorage.removeItem('redirectAfterLogin')
      router.replace(redirectPath)
    }
  }
})

export default router
