<template>
  <div class="min-h-screen bg-base-200">
    <!-- Bienvenida personalizada -->
    <div class="bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">
            ¡Bienvenido{{ user ? `, ${user.full_name.split(' ')[0]}` : '' }}!
          </h1>
          <p class="text-lg opacity-90 mb-6">
            Descubre proyectos increíbles y conecta con desarrolladores talentosos
          </p>

          <!-- Barra de búsqueda -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar proyectos, usuarios, tecnologías..."
                class="input input-lg w-full pl-12 pr-20 bg-base-100 text-base-content border-0 shadow-lg"
                @keyup.enter="performSearch"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button
                @click="performSearch"
                class="btn btn-primary btn-sm absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Buscar
              </button>
            </div>

            <!-- Sugerencias de búsqueda -->
            <div v-if="searchSuggestions.length > 0 && searchQuery" class="mt-2">
              <div class="bg-base-100 rounded-lg shadow-lg p-4 text-left">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="projectSuggestions.length > 0">
                    <h4 class="font-semibold text-sm text-base-content/70 mb-2">Proyectos</h4>
                    <div class="space-y-1">
                      <button
                        v-for="project in projectSuggestions.slice(0, 3)"
                        :key="project.id"
                        @click="selectProject(project)"
                        class="block w-full text-left hover:bg-base-200 p-2 rounded text-sm"
                      >
                        {{ project.title }}
                      </button>
                    </div>
                  </div>
                  <div v-if="userSuggestions.length > 0">
                    <h4 class="font-semibold text-sm text-base-content/70 mb-2">Usuarios</h4>
                    <div class="space-y-1">
                      <button
                        v-for="suggUser in userSuggestions.slice(0, 3)"
                        :key="suggUser.id"
                        @click="selectUser(suggUser)"
                        class="block w-full text-left hover:bg-base-200 p-2 rounded text-sm"
                      >
                        {{ suggUser.full_name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Layout - 3 columnas -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Sidebar Izquierdo - Perfil y Navegación -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Perfil del Usuario -->
          <div v-if="user" class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="flex flex-col items-center text-center">
                <div class="avatar mb-4">
                  <div class="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img
                      :src="user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`"
                      :alt="user.full_name"
                    />
                  </div>
                </div>
                <h3 class="text-xl font-bold mb-1">{{ user.full_name }}</h3>
                <p class="text-base-content/60 text-sm mb-4">{{ user.email }}</p>

                <!-- Estadísticas -->
                <div class="grid grid-cols-2 gap-4 w-full text-center">
                  <div>
                    <div class="text-lg font-bold text-primary">{{ myProjects.length }}</div>
                    <div class="text-xs text-base-content/60">Proyectos</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-warning">{{ totalLikes }}</div>
                    <div class="text-xs text-base-content/60">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        <!-- Contenido Principal - Feed -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Crear Proyecto -->
          <div v-if="user" class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img
                      :src="user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`"
                      :alt="user.full_name"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <button
                    class="btn btn-outline btn-primary w-full justify-start"
                    @click="showCreateForm = !showCreateForm"
                  >
                    <PlusIcon class="h-5 w-5" />
                    ¿En qué estás trabajando?
                  </button>
                </div>
              </div>

              <!-- Formulario de Crear Proyecto Mejorado -->
              <div v-if="showCreateForm" class="pt-6 border-t border-base-300">
                <div class="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/20">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="bg-primary/10 p-3 rounded-full">
                      <RocketLaunchIcon class="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-base-content">Crear Nuevo Proyecto</h3>
                      <p class="text-sm text-base-content/60">Comparte tu idea con la comunidad</p>
                    </div>
                  </div>

                  <div class="space-y-6">
                    <!-- Título -->
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold text-base-content flex items-center gap-2">
                          <DocumentIcon class="h-4 w-4" />
                          Título del proyecto *
                        </span>
                      </label>
                      <input
                        v-model="newProjectTitle"
                        type="text"
                        placeholder="Dale un nombre increíble a tu proyecto..."
                        class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Estado -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <ClockIcon class="h-4 w-4" />
                            Estado del proyecto
                          </span>
                        </label>
                        <select v-model="newProjectStatus" class="select select-bordered select-lg w-full focus:select-primary">
                          <option value="planning">Planificando</option>
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completado</option>
                          <option value="on_hold">En Pausa</option>
                        </select>
                      </div>

                      <!-- URL de imagen -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <PhotoIcon class="h-4 w-4" />
                            Imagen del proyecto
                          </span>
                        </label>
                        <input
                          v-model="newProjectImageUrl"
                          type="url"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                      </div>
                    </div>

                    <!-- Vista previa de imagen -->
                    <div v-if="newProjectImageUrl" class="form-control">
                      <div class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300">
                        <p class="text-sm font-medium text-base-content/60 mb-2">Vista previa:</p>
                        <img
                          :src="newProjectImageUrl"
                          alt="Vista previa"
                          class="w-full h-40 object-cover rounded-lg"
                          @error="newProjectImageUrl = ''"
                        />
                      </div>
                    </div>

                    <!-- Descripción -->
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold text-base-content flex items-center gap-2">
                          <ChatBubbleLeftIcon class="h-4 w-4" />
                          Descripción *
                        </span>
                      </label>
                      <textarea
                        v-model="newProjectDescription"
                        placeholder="Cuéntanos sobre tu proyecto: objetivos, tecnologías, desafíos, lo que sea que te emocione compartir..."
                        class="textarea textarea-bordered textarea-lg h-32 w-full focus:textarea-primary resize-none"
                      ></textarea>
                      <label class="label">
                        <span class="label-text-alt text-base-content/40">{{ newProjectDescription.length }}/500 caracteres</span>
                      </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Etiquetas -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <TagIcon class="h-4 w-4" />
                            Tecnologías y etiquetas
                          </span>
                        </label>
                        <input
                          v-model="newProjectTags"
                          type="text"
                          placeholder="React, Node.js, TypeScript..."
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                        <label class="label">
                          <span class="label-text-alt text-base-content/40">Separadas por comas</span>
                        </label>
                      </div>

                      <!-- Miembros del equipo -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <UsersIcon class="h-4 w-4" />
                            Colaboradores
                          </span>
                        </label>
                        <input
                          v-model="newProjectTeamMembers"
                          type="text"
                          placeholder="juan@email.com, maria@email.com..."
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                        <label class="label">
                          <span class="label-text-alt text-base-content/40">Emails separados por comas</span>
                        </label>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex gap-3 justify-end pt-4 border-t border-base-300/50">
                      <button
                        class="btn btn-ghost btn-lg"
                        @click="resetCreateForm"
                      >
                        <XMarkIcon class="h-5 w-5" />
                        Cancelar
                      </button>
                      <button
                        class="btn btn-primary btn-lg"
                        :disabled="!newProjectTitle.trim() || !newProjectDescription.trim() || isLoading"
                        @click="createProject"
                      >
                        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                        <RocketLaunchIcon v-else class="h-5 w-5" />
                        Crear Proyecto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-4">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in feedFilters"
                  :key="filter.key"
                  class="btn btn-sm"
                  :class="activeFilter === filter.key ? 'btn-primary' : 'btn-ghost'"
                  @click="setActiveFilter(filter.key)"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Feed de Proyectos -->
          <div v-if="loading" class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
            <div class="card bg-base-100 shadow-lg border border-base-300">
              <div class="card-body p-12">
                <FolderIcon class="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 class="text-xl font-semibold mb-2">No hay proyectos</h3>
                <p class="text-base-content/70">Sé el primero en compartir un proyecto</p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
            >
              <div class="card-body p-6">
                <!-- Header del Proyecto -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="avatar">
                    <div class="w-10 h-10 rounded-full">
                      <img
                        :src="getProjectCreatorAvatar(project)"
                        :alt="getProjectCreatorName(project)"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ getProjectCreatorName(project) }}</h4>
                    <p class="text-sm text-base-content/60">{{ formatTimeAgo(project.created_at) }}</p>
                  </div>
                  <div class="badge" :class="getStatusColor(project.status)">
                    {{ getProjectStatusText(project.status) }}
                  </div>
                </div>

                <!-- Contenido del Proyecto -->
                <div class="cursor-pointer" @click="viewProject(project)">
                  <h3 class="text-xl font-bold mb-2 hover:text-primary transition-colors">
                    {{ project.title }}
                  </h3>
                  <p class="text-base-content/80 mb-4 line-clamp-3">
                    {{ project.description }}
                  </p>

                  <!-- Imagen del Proyecto (si existe) -->
                  <div v-if="project.image_url" class="mb-4">
                    <img
                      :src="project.image_url"
                      :alt="project.title"
                      class="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <!-- Tags -->
                  <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-4">
                    <span
                      v-for="tag in project.tags"
                      :key="tag"
                      class="badge badge-outline badge-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Acciones -->
                <div class="flex items-center justify-between pt-4 border-t border-base-300">
                  <div class="flex items-center gap-4">
                    <button
                      class="btn btn-ghost btn-sm flex items-center gap-2 transition-all duration-300"
                      :class="isProjectLikedByUser(project) ? 'text-red-500' : ''"
                      @click="toggleLike(project)"
                    >
                      <HeartIcon
                        class="h-5 w-5 transition-all duration-300"
                        :class="isProjectLikedByUser(project) ? 'fill-red-500 text-red-500' : 'hover:text-red-400'"
                      />
                      <span class="font-medium">{{ project.likes_count || 0 }}</span>
                    </button>

                    <button
                      class="btn btn-ghost btn-sm flex items-center gap-2"
                      @click="openComments(project)"
                    >
                      <ChatBubbleLeftIcon class="h-5 w-5" />
                      <span>{{ project.comments_count || 0 }}</span>
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <div v-if="project.team_members?.length" class="flex items-center gap-1">
                      <UsersIcon class="h-4 w-4 text-base-content/60" />
                      <span class="text-sm text-base-content/60">{{ project.team_members.length }}</span>
                    </div>
                    <button
                      class="btn btn-primary btn-sm"
                      @click="viewProject(project)"
                    >
                      Ver Proyecto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Derecho - Contenido Adicional -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Proyectos Recientes -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <ClockIcon class="h-5 w-5 text-info" />
                Recientes
              </h3>
              <div v-if="recentProjects.length > 0" class="space-y-3">
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors cursor-pointer"
                  @click="viewProject(project)"
                >
                  <div class="avatar">
                    <div class="w-8 h-8 rounded-full">
                      <img
                        :src="getProjectCreatorAvatar(project)"
                        :alt="getProjectCreatorName(project)"
                      />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ project.title }}</p>
                    <p class="text-xs text-base-content/60">{{ getProjectCreatorName(project) }}</p>
                    <p class="text-xs text-base-content/40">{{ formatTimeAgo(project.created_at) }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-base-content/60 py-4">
                <ClockIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">No hay proyectos recientes</p>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>

    <!-- Pie de página -->
    <footer class="bg-base-100 border-t border-base-300 mt-12">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

          <!-- Información institucional -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-xl font-bold text-base-content mb-4">DevConnect Platform</h3>
            <p class="text-base-content/70 mb-4">
              La plataforma líder para desarrolladores que buscan colaborar, compartir proyectos
              y construir el futuro de la tecnología juntos.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-base-content/60 hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-base-content/60 hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="text-base-content/60 hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Soporte/Contacto -->
          <div>
            <h4 class="text-lg font-semibold text-base-content mb-4">Soporte</h4>
            <ul class="space-y-2 text-base-content/70">
              <li>
                <a href="#" class="hover:text-primary transition-colors">Centro de Ayuda</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Contacto</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Chat en vivo</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Reportar problema</a>
              </li>
              <li>
                <a href="mailto:support@devconnect.com" class="hover:text-primary transition-colors">
                  support@devconnect.com
                </a>
              </li>
            </ul>
          </div>

          <!-- Políticas/Términos -->
          <div>
            <h4 class="text-lg font-semibold text-base-content mb-4">Legal</h4>
            <ul class="space-y-2 text-base-content/70">
              <li>
                <a href="#" class="hover:text-primary transition-colors">Términos de Uso</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Política de Privacidad</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Cookies</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Código de Conducta</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Licencias</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-base-300 mt-8 pt-8 text-center">
          <p class="text-base-content/60">
            © {{ new Date().getFullYear() }} DevConnect Platform. Todos los derechos reservados.
          </p>
          <p class="text-base-content/50 text-sm mt-2">
            Hecho con ❤️ para la comunidad de desarrolladores
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import type { Project } from '@/types'
import {
  PlusIcon,
  ClockIcon,
  FolderIcon,
  StarIcon,
  HeartIcon,
  UsersIcon,
  ChatBubbleLeftIcon,
  RocketLaunchIcon,
  DocumentIcon,
  PhotoIcon,
  TagIcon,
  XMarkIcon
} from '@/icons'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()

const { profile } = storeToRefs(authStore)
const { projects, loading } = storeToRefs(projectsStore)

// Estados para búsqueda
const searchQuery = ref('')
const searchResults = ref<{ projects: Project[], users: any[] }>({ projects: [], users: [] })

// Computed para el usuario actual
const user = computed(() => profile.value)

const activeFilter = ref('todos')
const showCreateForm = ref(false)
const newProjectTitle = ref('')
const newProjectDescription = ref('')
const newProjectStatus = ref<'planning' | 'in_progress' | 'completed' | 'on_hold'>('planning')
const newProjectImageUrl = ref('')
const newProjectTags = ref('')
const newProjectTeamMembers = ref('')
const isLoading = ref(false)

// Filtros para el feed
const feedFilters = ref([
  { key: 'todos', label: 'Todos' },
  { key: 'recientes', label: 'Recientes' },
  { key: 'planificando', label: 'Planificando' },
  { key: 'en-progreso', label: 'En Progreso' },
  { key: 'completados', label: 'Completados' }
])

// Computed properties
const myProjects = computed(() => {
  if (!profile.value) return []
  return projects.value.filter((p: Project) => p.created_by === profile.value?.id)
})

const myProjectsCount = computed(() => myProjects.value.length)

const totalLikes = computed(() => {
  return myProjects.value.reduce((total: number, project: Project) => total + (project.likes_count || 0), 0)
})

const myInProgressProjects = computed(() => {
  if (!profile.value) return []
  return projects.value
    .filter((p: Project) => p.creator?.id === profile.value?.id && (p.status === 'in_progress' || p.status === 'En Progreso'))
    .slice(0, 3)
})

const recentProjects = computed(() => {
  return [...projects.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

// Computed properties para búsqueda
const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []

  const query = searchQuery.value.toLowerCase()
  const projectMatches = projects.value.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(query)))
  ).slice(0, 5)

  // Simular usuarios para el ejemplo
  const allUsers = [
    { id: 1, full_name: 'Ana García', email: 'ana@example.com' },
    { id: 2, full_name: 'Carlos Mendoza', email: 'carlos@example.com' },
    { id: 3, full_name: 'María López', email: 'maria@example.com' },
    { id: 4, full_name: 'Juan Pérez', email: 'juan@example.com' }
  ]

  const userMatches = allUsers.filter(u =>
    u.full_name.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  ).slice(0, 5)

  return [...projectMatches, ...userMatches]
})

const projectSuggestions = computed(() =>
  searchSuggestions.value.filter(item => 'title' in item)
)

const userSuggestions = computed(() =>
  searchSuggestions.value.filter(item => 'full_name' in item)
)

const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  switch (activeFilter.value) {
    case 'recientes':
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'planificando':
      filtered = filtered.filter(p => p.status === 'planning' || p.status === 'Planificando')
      break
    case 'en-progreso':
      filtered = filtered.filter(p => p.status === 'En Progreso' || p.status === 'in_progress')
      break
    case 'completados':
      filtered = filtered.filter(p => p.status === 'Completado' || p.status === 'completed')
      break
    default:
      // 'todos' - no filtering, just sort by created date
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return filtered
})

// Methods
const setActiveFilter = (filterKey: string) => {
  activeFilter.value = filterKey
}



const viewProject = (project: Project) => {
  router.push(`/projects/${project.id}`)
}

const getProjectStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'planning': 'Planificando',
    'in_progress': 'En Progreso',
    'completed': 'Completado',
    'on_hold': 'En Pausa'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'planning': 'badge-info',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'on_hold': 'badge-ghost',
    'Planificando': 'badge-info',
    'En Progreso': 'badge-warning',
    'Completado': 'badge-success',
    'En Pausa': 'badge-ghost'
  }
  return colorMap[status] || 'badge-ghost'
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `hace ${minutes} min`
  } else if (hours < 24) {
    return `hace ${hours}h`
  } else {
    return `hace ${days}d`
  }
}

// Métodos para obtener información del creador del proyecto
const getProjectCreatorName = (project: Project): string => {
  if (project.creator?.full_name) {
    return project.creator.full_name
  }
  // Si es mi proyecto, usar mi información
  if (project.created_by === user.value?.id) {
    return user.value?.full_name || 'Usuario'
  }
  return 'Usuario'
}

const getProjectCreatorAvatar = (project: Project): string => {
  if (project.creator?.avatar_url) {
    return project.creator.avatar_url
  }
  // Si es mi proyecto, usar mi avatar
  if (project.created_by === user.value?.id && user.value?.avatar_url) {
    return user.value.avatar_url
  }
  const creatorName = getProjectCreatorName(project)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random`
}

// Método para resetear el formulario
const resetCreateForm = () => {
  newProjectTitle.value = ''
  newProjectDescription.value = ''
  newProjectStatus.value = 'planning'
  newProjectImageUrl.value = ''
  newProjectTags.value = ''
  newProjectTeamMembers.value = ''
  showCreateForm.value = false
}

// Método para crear proyecto
const createProject = async () => {
  if (!newProjectTitle.value.trim() || !newProjectDescription.value.trim() || !user.value) return

  isLoading.value = true
  try {
    // Procesar tags
    const tags = newProjectTags.value
      ? newProjectTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : []

    // Procesar miembros del equipo
    const teamMembers = newProjectTeamMembers.value
      ? newProjectTeamMembers.value.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : []

    await projectsStore.createProject({
      title: newProjectTitle.value,
      description: newProjectDescription.value,
      status: newProjectStatus.value,
      image_url: newProjectImageUrl.value || undefined,
      tags,
      team_members: teamMembers,
      created_by: user.value.id
    })

    resetCreateForm()
    // Refrescar proyectos
    await projectsStore.fetchProjects()
  } catch (error) {
    console.error('Error creating project:', error)
  } finally {
    isLoading.value = false
  }
}

// Método para verificar si el usuario actual ha dado like al proyecto
const isProjectLikedByUser = (project: Project): boolean => {
  return project.liked_by_user || false
}

// Método mejorado para toggle like
const toggleLike = async (project: Project) => {
  if (!user.value) return

  try {
    await projectsStore.toggleLike(project.id, user.value.id)
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const openComments = (project: Project) => {
  router.push(`/projects/${project.id}#comments`)
}

// Métodos de búsqueda
const performSearch = () => {
  if (!searchQuery.value.trim()) return

  // Aquí podrías hacer una búsqueda más avanzada o redirigir a una página de resultados
  console.log('Buscando:', searchQuery.value)

  // Por ahora, simplemente filtrar los proyectos existentes
  const query = searchQuery.value.toLowerCase()
  const results = projects.value.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(query)))
  )

  // Podrías mostrar los resultados en un modal o redirigir a una página de búsqueda
  alert(`Se encontraron ${results.length} proyectos que coinciden con "${searchQuery.value}"`)
}

const selectProject = (project: Project) => {
  router.push(`/projects/${project.id}`)
  searchQuery.value = ''
}

const selectUser = (user: any) => {
  // Redirigir al perfil del usuario (cuando esté implementado)
  console.log('Ver perfil de:', user.full_name)
  searchQuery.value = ''
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
