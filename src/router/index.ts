import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-projects',
      name: 'my-projects',
      component: () => import('@/views/MyProjectsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: () => import('@/views/ProjectEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/tasks',
      name: 'project-tasks',
      component: () => import('@/views/ProjectTasksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/NotificationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
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
    await new Promise((resolve) => setTimeout(resolve, 100))
    waitCount++
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
  const isAuthenticated = !!authStore.user

  // Handle different route types
  if (requiresAuth && !isAuthenticated) {
    // Protected route but user not authenticated
    if (to.path !== '/login') {
      localStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Guest-only route but user is authenticated
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
