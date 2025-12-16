<template>
  <div class="min-h-screen bg-base-200">
    <!-- Bienvenida personalizada -->
    <div class="bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">
            {{ t('home.welcome') }}{{ user ? `, ${user.full_name.split(' ')[0]}` : '' }}!
          </h1>
          <p class="text-lg opacity-90 mb-6">
            {{ t('home.welcomeMessage') }}
          </p>

          <!-- Barra de búsqueda -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('home.search.placeholder')"
                class="input input-lg w-full pl-12 pr-32 bg-base-100 text-base-content border-0 shadow-lg"
                @keyup.enter="performSearch"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button
                  @click="showAdvancedFilters = true"
                  class="btn btn-sm btn-ghost gap-2"
                  :title="t('home.search.advancedFilter')"
                >
                  <FunnelIcon class="h-5 w-5" />
                </button>
                <button
                  @click="performSearch"
                  class="btn btn-primary btn-sm"
                >
                  {{ t('home.search.button') }}
                </button>
              </div>
            </div>

            <!-- Sugerencias de búsqueda -->
            <div v-if="searchSuggestions.length > 0 && searchQuery" class="mt-2">
              <div class="bg-base-100 rounded-lg shadow-lg p-4 text-left">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="projectSuggestions.length > 0">
                    <h4 class="font-semibold text-sm text-base-content/70 mb-2">{{ t('home.search.projects') }}</h4>
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
                    <h4 class="font-semibold text-sm text-base-content/70 mb-2">{{ t('home.search.users') }}</h4>
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
                    <div class="text-xs text-base-content/60">{{ t('profile.stats.projects') }}</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-warning">{{ totalLikes }}</div>
                    <div class="text-xs text-base-content/60">{{ t('profile.stats.likes') }}</div>
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
                    {{ t('home.createProject.button') }}
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
                      <h3 class="text-xl font-bold text-base-content">{{ t('home.createProject.formTitle') }}</h3>
                      <p class="text-sm text-base-content/60">{{ t('home.createProject.formSubtitle') }}</p>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <FormProgress
                    :progress="createProjectProgress"
                    :label="createProjectProgressLabel"
                    :show-steps="true"
                    :steps="3"
                    :current-step="createProjectCurrentStep"
                    :step-labels="createProjectStepLabels"
                  />

                  <div class="space-y-6">
                    <!-- Título -->
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold text-base-content flex items-center gap-2">
                          <DocumentIcon class="h-4 w-4" />
                          {{ t('home.createProject.titleLabel') }} *
                        </span>
                      </label>
                      <input
                        v-model="newProjectTitle"
                        type="text"
                        :placeholder="t('home.createProject.titlePlaceholder')"
                        class="input input-bordered input-lg w-full focus:input-primary transition-all duration-300"
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Estado -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <ClockIcon class="h-4 w-4" />
                            {{ t('home.createProject.statusLabel') }}
                          </span>
                        </label>
                        <select v-model="newProjectStatus" class="select select-bordered select-lg w-full focus:select-primary">
                          <option value="planning">{{ t('project.status.planning') }}</option>
                          <option value="in_progress">{{ t('project.status.in_progress') }}</option>
                          <option value="completed">{{ t('project.status.completed') }}</option>
                          <option value="on_hold">{{ t('project.status.on_hold') }}</option>
                        </select>
                      </div>

                      <!-- URL de imagen -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <PhotoIcon class="h-4 w-4" />
                            {{ t('home.createProject.imageLabel') }}
                          </span>
                        </label>
                        <input
                          v-model="newProjectImageUrl"
                          type="url"
                          :placeholder="t('home.createProject.imagePlaceholder')"
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                      </div>
                    </div>

                    <!-- Vista previa de imagen -->
                    <div v-if="newProjectImageUrl" class="form-control">
                      <div class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300">
                        <p class="text-sm font-medium text-base-content/60 mb-2">{{ t('home.createProject.imagePreview') }}</p>
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
                          {{ t('home.createProject.descriptionLabel') }} *
                        </span>
                      </label>
                      <textarea
                        v-model="newProjectDescription"
                        :placeholder="t('home.createProject.descriptionPlaceholder')"
                        class="textarea textarea-bordered textarea-lg h-32 w-full focus:textarea-primary resize-none"
                      ></textarea>
                      <label class="label">
                        <span class="label-text-alt text-base-content/40">{{ t('home.createProject.charactersCount', { count: newProjectDescription.length }) }}</span>
                      </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Etiquetas -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <TagIcon class="h-4 w-4" />
                            {{ t('home.createProject.tagsLabel') }}
                          </span>
                        </label>
                        <input
                          v-model="newProjectTags"
                          type="text"
                          :placeholder="t('home.createProject.tagsPlaceholder')"
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                        <label class="label">
                          <span class="label-text-alt text-base-content/40">{{ t('home.createProject.tagsSeparator') }}</span>
                        </label>
                      </div>

                      <!-- Miembros del equipo -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold text-base-content flex items-center gap-2">
                            <UsersIcon class="h-4 w-4" />
                            {{ t('home.createProject.teamLabel') }}
                          </span>
                        </label>
                        <input
                          v-model="newProjectTeamMembers"
                          type="text"
                          :placeholder="t('home.createProject.teamPlaceholder')"
                          class="input input-bordered input-lg w-full focus:input-primary"
                        />
                        <label class="label">
                          <span class="label-text-alt text-base-content/40">{{ t('home.createProject.teamHelper') }}</span>
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
                        {{ t('home.createProject.cancel') }}
                      </button>
                      <button
                        class="btn btn-primary btn-lg"
                        :disabled="!newProjectTitle.trim() || !newProjectDescription.trim() || isLoading"
                        @click="createProject"
                      >
                        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                        <RocketLaunchIcon v-else class="h-5 w-5" />
                        {{ isLoading ? t('home.createProject.creating') : t('home.createProject.create') }}
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
                <h3 class="text-xl font-semibold mb-2">{{ t('common.noProjects') }}</h3>
                <p class="text-base-content/70">{{ t('common.beFirst') }}</p>
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
                      {{ t('common.viewProject') }}
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
                {{ t('home.trending.title') }}
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
                <p class="text-sm">{{ t('common.noRecentProjects') }}</p>
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
            <h3 class="text-xl font-bold text-base-content mb-4">{{ t('footer.title') }}</h3>
            <p class="text-base-content/70 mb-4">
              {{ t('footer.description') }}
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
                <button @click="showTermsModal = true" class="hover:text-primary transition-colors">{{ t('footer.legal.terms') }}</button>
              </li>
              <li>
                <button @click="showPrivacyModal = true" class="hover:text-primary transition-colors">{{ t('footer.legal.privacy') }}</button>
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
    </footer>

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

    <!-- Modal de Filtros Avanzados -->
    <div v-if="showAdvancedFilters" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header del Modal -->
        <div class="bg-gradient-to-r from-primary to-secondary text-primary-content p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <FunnelIcon class="h-6 w-6" />
                {{ t('home.search.filters.title') }}
              </h2>
              <p class="text-sm opacity-90 mt-1">{{ t('home.search.filters.subtitle') }}</p>
            </div>
            <button
              @click="showAdvancedFilters = false"
              class="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Contenido del Modal -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Estado del proyecto -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{ t('home.search.filters.status.label') }}</span>
            </label>
            <select v-model="advancedFilters.status" class="select select-bordered w-full">
              <option value="">{{ t('home.search.filters.status.all') }}</option>
              <option value="planning">{{ t('home.search.filters.status.planning') }}</option>
              <option value="in_progress">{{ t('home.search.filters.status.inProgress') }}</option>
              <option value="completed">{{ t('home.search.filters.status.completed') }}</option>
              <option value="on_hold">{{ t('home.search.filters.status.onHold') }}</option>
            </select>
          </div>

          <!-- Tecnologías -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{ t('home.search.filters.tags.label') }}</span>
            </label>
            <input
              v-model="advancedFilters.tags"
              type="text"
              :placeholder="t('home.search.filters.tags.placeholder')"
              class="input input-bordered w-full"
            />
          </div>

          <!-- Ordenar por -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{ t('home.search.filters.sortBy.label') }}</span>
            </label>
            <select v-model="advancedFilters.sortBy" class="select select-bordered w-full">
              <option value="newest">{{ t('home.search.filters.sortBy.newest') }}</option>
              <option value="oldest">{{ t('home.search.filters.sortBy.oldest') }}</option>
              <option value="mostLiked">{{ t('home.search.filters.sortBy.mostLiked') }}</option>
              <option value="mostCommented">{{ t('home.search.filters.sortBy.mostCommented') }}</option>
              <option value="alphabetical">{{ t('home.search.filters.sortBy.alphabetical') }}</option>
              <option value="reverseAlphabetical">{{ t('home.search.filters.sortBy.reverseAlphabetical') }}</option>
            </select>
          </div>

          <!-- Fecha de creación -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{ t('home.search.filters.dateRange.label') }}</span>
            </label>
            <select v-model="advancedFilters.dateRange" class="select select-bordered w-full">
              <option value="">{{ t('home.search.filters.dateRange.anytime') }}</option>
              <option value="lastWeek">{{ t('home.search.filters.dateRange.lastWeek') }}</option>
              <option value="lastMonth">{{ t('home.search.filters.dateRange.lastMonth') }}</option>
              <option value="last3Months">{{ t('home.search.filters.dateRange.last3Months') }}</option>
              <option value="lastYear">{{ t('home.search.filters.dateRange.lastYear') }}</option>
            </select>
          </div>

          <!-- Filtros numéricos -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Mínimo de likes -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">{{ t('home.search.filters.minLikes.label') }}</span>
              </label>
              <input
                v-model.number="advancedFilters.minLikes"
                type="number"
                min="0"
                :placeholder="t('home.search.filters.minLikes.placeholder')"
                class="input input-bordered w-full"
              />
            </div>

            <!-- Mínimo de comentarios -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">{{ t('home.search.filters.minComments.label') }}</span>
              </label>
              <input
                v-model.number="advancedFilters.minComments"
                type="number"
                min="0"
                :placeholder="t('home.search.filters.minComments.placeholder')"
                class="input input-bordered w-full"
              />
            </div>
          </div>

          <!-- Creador del proyecto -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{ t('home.search.filters.creator.label') }}</span>
            </label>
            <input
              v-model="advancedFilters.creator"
              type="text"
              :placeholder="t('home.search.filters.creator.placeholder')"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <!-- Footer del Modal -->
        <div class="border-t border-base-300 p-6 bg-base-200">
          <div class="flex gap-3">
            <button
              @click="clearAdvancedFilters"
              class="btn btn-ghost flex-1"
            >
              {{ t('home.search.filters.actions.clear') }}
            </button>
            <button
              @click="applyAdvancedFilters"
              class="btn btn-primary flex-1"
            >
              {{ t('home.search.filters.actions.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import FormProgress from '@/components/ui/FormProgress.vue'
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
  XMarkIcon,
  FunnelIcon
} from '@/icons'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()
const { t, locale } = useTranslation()

const { profile } = storeToRefs(authStore)
const { projects, loading } = storeToRefs(projectsStore)

// Estados para búsqueda
const searchQuery = ref('')
const searchResults = ref<{ projects: Project[], users: any[] }>({ projects: [], users: [] })

// Estado del modal de filtros avanzados
const showAdvancedFilters = ref(false)
const advancedFilters = ref({
  status: '',
  tags: '',
  sortBy: 'newest',
  dateRange: '',
  minLikes: null as number | null,
  minComments: null as number | null,
  creator: ''
})
const appliedFilters = ref({ ...advancedFilters.value })

// Computed para el usuario actual
const user = computed(() => profile.value)

const activeFilter = ref('todos')
const showCreateForm = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const newProjectTitle = ref('')
const newProjectDescription = ref('')
const newProjectStatus = ref<'planning' | 'in_progress' | 'completed' | 'on_hold'>('planning')
const newProjectImageUrl = ref('')
const newProjectTags = ref('')
const newProjectTeamMembers = ref('')
const isLoading = ref(false)
let refreshInterval: number | null = null

// Filtros para el feed - computed para reactividad con traducciones
const feedFilters = computed(() => [
  { key: 'todos', label: t('home.feed.all') },
  { key: 'recientes', label: t('home.feed.recent') },
  { key: 'planificando', label: t('home.feed.planning') },
  { key: 'en-progreso', label: t('home.feed.inProgress') },
  { key: 'completados', label: t('home.feed.completed') }
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

  // Aplicar filtro básico del feed
  switch (activeFilter.value) {
    case 'recientes':
      // Se ordenará después
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
  }

  // Aplicar filtros avanzados
  if (appliedFilters.value.status) {
    filtered = filtered.filter(p =>
      p.status === appliedFilters.value.status ||
      (appliedFilters.value.status === 'planning' && p.status === 'Planificando') ||
      (appliedFilters.value.status === 'in_progress' && p.status === 'En Progreso') ||
      (appliedFilters.value.status === 'completed' && p.status === 'Completado') ||
      (appliedFilters.value.status === 'on_hold' && p.status === 'En Pausa')
    )
  }

  // Filtrar por tecnologías/tags
  if (appliedFilters.value.tags) {
    const searchTags = appliedFilters.value.tags.toLowerCase().split(',').map(t => t.trim())
    filtered = filtered.filter(p =>
      p.tags && p.tags.some(tag =>
        searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
      )
    )
  }

  // Filtrar por fecha de creación
  if (appliedFilters.value.dateRange) {
    const now = new Date()
    const cutoffDate = new Date()

    switch (appliedFilters.value.dateRange) {
      case 'lastWeek':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'lastMonth':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case 'last3Months':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case 'lastYear':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter(p => new Date(p.created_at) >= cutoffDate)
  }

  // Filtrar por mínimo de likes
  if (appliedFilters.value.minLikes !== null && appliedFilters.value.minLikes > 0) {
    filtered = filtered.filter(p => (p.likes_count || 0) >= appliedFilters.value.minLikes!)
  }

  // Filtrar por mínimo de comentarios
  if (appliedFilters.value.minComments !== null && appliedFilters.value.minComments > 0) {
    filtered = filtered.filter(p => (p.comments_count || 0) >= appliedFilters.value.minComments!)
  }

  // Filtrar por creador
  if (appliedFilters.value.creator) {
    const searchCreator = appliedFilters.value.creator.toLowerCase()
    filtered = filtered.filter(p =>
      (p.creator?.full_name?.toLowerCase().includes(searchCreator)) ||
      (p.creator?.email?.toLowerCase().includes(searchCreator))
    )
  }

  // Ordenar proyectos según filtro avanzado
  switch (appliedFilters.value.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case 'mostLiked':
      filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
      break
    case 'mostCommented':
      filtered.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0))
      break
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'reverseAlphabetical':
      filtered.sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return filtered
})

// Create Project Form Progress
const createProjectProgress = computed(() => {
  let progress = 0

  // Título (obligatorio) - 40%
  if (newProjectTitle.value.trim().length > 0) progress += 40

  // Descripción (obligatoria) - 40%
  if (newProjectDescription.value.trim().length > 0) progress += 40

  // Campos opcionales - 20%
  let optionalFields = 0
  if (newProjectImageUrl.value.trim().length > 0) optionalFields += 1
  if (newProjectTags.value.trim().length > 0) optionalFields += 1
  if (newProjectTeamMembers.value.trim().length > 0) optionalFields += 1
  progress += (optionalFields / 3) * 20

  return progress
})

const createProjectCurrentStep = computed(() => {
  if (newProjectDescription.value.trim().length > 0 &&
      (newProjectTags.value || newProjectImageUrl.value || newProjectTeamMembers.value)) return 3
  if (newProjectDescription.value.trim().length > 0) return 2
  if (newProjectTitle.value.trim().length > 0) return 1
  return 1
})

const createProjectStepLabels = computed(() => {
  const isSpanish = locale.value === 'es'
  return isSpanish
    ? ['Básico', 'Detalles', 'Extra']
    : ['Basic', 'Details', 'Extra']
})

const createProjectProgressLabel = computed(() => {
  const isSpanish = locale.value === 'es'
  if (createProjectProgress.value >= 80) {
    return isSpanish ? '¡Listo para crear!' : 'Ready to create!'
  } else if (createProjectProgress.value >= 50) {
    return isSpanish ? 'Casi listo...' : 'Almost there...'
  } else {
    return isSpanish ? 'Completa el proyecto' : 'Complete the project'
  }
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
    'planning': t('project.status.planning'),
    'Planificando': t('project.status.planning'),
    'in_progress': t('project.status.in_progress'),
    'En Progreso': t('project.status.in_progress'),
    'completed': t('project.status.completed'),
    'Completado': t('project.status.completed'),
    'on_hold': t('project.status.on_hold'),
    'En Pausa': t('project.status.on_hold')
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
  const weeks = Math.floor(days / 7)

  if (minutes < 60) {
    return `${minutes} min`
  } else if (hours < 24) {
    return `${hours}h`
  } else if (days === 1) {
    return t('common.dates.yesterday')
  } else if (days < 7) {
    return t('common.dates.daysAgo', { days })
  } else {
    return t('common.dates.weeksAgo', { weeks })
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

// Métodos para filtros avanzados
const applyAdvancedFilters = () => {
  appliedFilters.value = { ...advancedFilters.value }
  showAdvancedFilters.value = false
}

const clearAdvancedFilters = () => {
  advancedFilters.value = {
    status: '',
    tags: '',
    sortBy: 'newest',
    dateRange: '',
    minLikes: null,
    minComments: null,
    creator: ''
  }
  appliedFilters.value = { ...advancedFilters.value }
  showAdvancedFilters.value = false
}

onMounted(() => {
  projectsStore.fetchProjects()

  // Refrescar proyectos cada 30 segundos para obtener contadores actualizados
  refreshInterval = setInterval(() => {
    projectsStore.fetchProjects()
  }, 30000)
})

onBeforeUnmount(() => {
  // Limpiar el intervalo cuando el componente se desmonta
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
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
