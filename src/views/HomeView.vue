<template>
  <div class="min-h-screen bg-base-200">
    <!-- Bienvenida personalizada -->
    <div class="hero-background from-primary to-secondary text-primary-content">
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
                class="input input-lg w-full pl-12 pr-16 bg-base-100 text-base-content border-0 shadow-lg"
              />
              <svg
                class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-base-content/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  @click="showAdvancedFilters = true"
                  class="btn btn-sm btn-ghost gap-2"
                  :title="t('home.search.advancedFilter')"
                >
                  <FunnelIcon class="h-5 w-5" />
                </button>
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
                  <div
                    class="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                  >
                    <img
                      :src="
                        user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`
                      "
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
                    <div class="text-xs text-base-content/60">
                      {{ t('profile.stats.projects') }}
                    </div>
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
                      :src="
                        user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`
                      "
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
                <div
                  class="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/20"
                >
                  <div class="flex items-center gap-3 mb-6">
                    <div class="bg-primary/10 p-3 rounded-full">
                      <RocketLaunchIcon class="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-base-content">
                        {{ t('home.createProject.formTitle') }}
                      </h3>
                      <p class="text-sm text-base-content/60">
                        {{ t('home.createProject.formSubtitle') }}
                      </p>
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
                        <span
                          class="label-text font-semibold text-base-content flex items-center gap-2"
                        >
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
                          <span
                            class="label-text font-semibold text-base-content flex items-center gap-2"
                          >
                            <ClockIcon class="h-4 w-4" />
                            {{ t('home.createProject.statusLabel') }}
                          </span>
                        </label>
                        <select
                          v-model="newProjectStatus"
                          class="select select-bordered select-lg w-full focus:select-primary"
                        >
                          <option value="planning">{{ t('project.status.planning') }}</option>
                          <option value="in_progress">{{ t('project.status.in_progress') }}</option>
                          <option value="completed">{{ t('project.status.completed') }}</option>
                          <option value="on_hold">{{ t('project.status.on_hold') }}</option>
                        </select>
                      </div>

                      <!-- URL de imagen -->
                      <div class="form-control">
                        <label class="label">
                          <span
                            class="label-text font-semibold text-base-content flex items-center gap-2"
                          >
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
                      <div
                        class="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300"
                      >
                        <p class="text-sm font-medium text-base-content/60 mb-2">
                          {{ t('home.createProject.imagePreview') }}
                        </p>
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
                        <span
                          class="label-text font-semibold text-base-content flex items-center gap-2"
                        >
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
                        <span class="label-text-alt text-base-content/40">{{
                          t('home.createProject.charactersCount', {
                            count: newProjectDescription.length,
                          })
                        }}</span>
                      </label>
                    </div>

                    <!-- Etiquetas -->
                    <div class="form-control">
                      <label class="label">
                        <span
                          class="label-text font-semibold text-base-content flex items-center gap-2"
                        >
                          <TagIcon class="h-4 w-4" />
                          {{ t('home.createProject.tagsLabel') }}
                        </span>
                      </label>
                      <input
                        v-model="currentTagInput"
                        type="text"
                        placeholder="Escribe una etiqueta y presiona Enter"
                        class="input input-bordered input-lg w-full focus:input-primary"
                        @keydown.enter.prevent="addTag"
                      />
                      <label class="label">
                        <span class="label-text-alt text-base-content/40">
                          Presiona Enter para agregar cada etiqueta
                        </span>
                      </label>
                      <!-- Tags visuales -->
                      <div v-if="newProjectTags.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <div
                          v-for="(tag, index) in newProjectTags"
                          :key="index"
                          class="badge badge-primary badge-lg gap-2"
                        >
                          {{ tag }}
                          <button
                            @click="removeTag(index)"
                            class="btn btn-ghost btn-xs btn-circle"
                            type="button"
                          >
                            <XMarkIcon class="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex gap-3 justify-end pt-4 border-t border-base-300/50">
                      <button class="btn btn-ghost btn-lg" @click="resetCreateForm">
                        <XMarkIcon class="h-5 w-5" />
                        {{ t('home.createProject.cancel') }}
                      </button>
                      <button
                        class="btn btn-primary btn-lg"
                        :disabled="
                          !newProjectTitle.trim() || !newProjectDescription.trim() || isLoading
                        "
                        @click="createProject"
                      >
                        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                        <RocketLaunchIcon v-else class="h-5 w-5" />
                        {{
                          isLoading
                            ? t('home.createProject.creating')
                            : t('home.createProject.create')
                        }}
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
                <h3 class="text-xl font-semibold mb-2">{{ noProjectsMessage.title }}</h3>
                <p class="text-base-content/70">{{ noProjectsMessage.subtitle }}</p>
                <button
                  v-if="searchQuery || appliedFilters.status || appliedFilters.tags"
                  @click="clearAllFilters"
                  class="btn btn-primary btn-sm mt-4"
                >
                  {{ t('home.feed.clearFilters') }}
                </button>
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
                    <p class="text-sm text-base-content/60">
                      {{ formatTimeAgo(project.created_at) }}
                    </p>
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
                        :class="
                          isProjectLikedByUser(project)
                            ? 'fill-red-500 text-red-500'
                            : 'hover:text-red-400'
                        "
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
                      <span class="text-sm text-base-content/60">{{
                        project.team_members.length
                      }}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" @click="viewProject(project)">
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
          <!-- TOP 5 Proyectos Más Populares -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <StarIcon class="h-5 w-5 text-warning" />
                {{ t('home.trending.title') }}
              </h3>
              <div v-if="topLikedProjects.length > 0" class="space-y-3">
                <div
                  v-for="(project, index) in topLikedProjects"
                  :key="project.id"
                  class="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all cursor-pointer group"
                  :class="{
                    'bg-linear-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20':
                      index === 0,
                    'bg-linear-to-r from-slate-400/10 to-gray-500/10 border border-slate-400/20':
                      index === 1,
                    'bg-linear-to-r from-orange-700/10 to-amber-700/10 border border-orange-700/20':
                      index === 2,
                  }"
                  @click="viewProject(project)"
                >
                  <!-- Ranking Badge -->
                  <div class="shrink-0">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                      :class="{
                        'bg-linear-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-500/50':
                          index === 0,
                        'bg-linear-to-br from-slate-300 to-slate-500 text-slate-900 shadow-lg shadow-slate-500/50':
                          index === 1,
                        'bg-linear-to-br from-orange-600 to-orange-800 text-orange-100 shadow-lg shadow-orange-700/50':
                          index === 2,
                        'bg-linear-to-br from-primary/20 to-primary/40 text-primary': index >= 3,
                      }"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                  <!-- Project Info -->
                  <div class="flex-1 min-w-0">
                    <p
                      class="font-semibold text-sm truncate group-hover:text-primary transition-colors"
                      :class="{
                        'text-yellow-700 dark:text-yellow-400': index === 0,
                        'text-slate-700 dark:text-slate-300': index === 1,
                        'text-orange-700 dark:text-orange-400': index === 2,
                      }"
                    >
                      {{ project.title }}
                    </p>
                    <p class="text-xs text-base-content/60">{{ getProjectCreatorName(project) }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex items-center gap-1">
                        <HeartIcon class="h-3 w-3 text-error" />
                        <span class="text-xs font-medium">{{ project.likes_count || 0 }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <ChatBubbleLeftIcon class="h-3 w-3 text-info" />
                        <span class="text-xs font-medium">{{ project.comments_count || 0 }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Medal Icon for Top 3 -->
                  <div v-if="index < 3" class="shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      :class="{
                        'text-yellow-500': index === 0,
                        'text-slate-400': index === 1,
                        'text-orange-600': index === 2,
                      }"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-base-content/60 py-4">
                <StarIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">{{ t('home.trending.noProjects') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />

    <!-- Modal de Filtros Avanzados -->
    <div
      v-if="showAdvancedFilters"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-open"
    >
      <div
        class="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header del Modal -->
        <div
          class="bg-linear-to-r from-primary to-secondary text-primary-content p-6 filter-background"
        >
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
              <span class="label-text font-semibold text-base">{{
                t('home.search.filters.status.label')
              }}</span>
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
              <span class="label-text font-semibold text-base">{{
                t('home.search.filters.tags.label')
              }}</span>
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
              <span class="label-text font-semibold text-base">{{
                t('home.search.filters.sortBy.label')
              }}</span>
            </label>
            <select v-model="advancedFilters.sortBy" class="select select-bordered w-full">
              <option value="newest">{{ t('home.search.filters.sortBy.newest') }}</option>
              <option value="oldest">{{ t('home.search.filters.sortBy.oldest') }}</option>
              <option value="mostLiked">{{ t('home.search.filters.sortBy.mostLiked') }}</option>
              <option value="mostCommented">
                {{ t('home.search.filters.sortBy.mostCommented') }}
              </option>
              <option value="alphabetical">
                {{ t('home.search.filters.sortBy.alphabetical') }}
              </option>
              <option value="reverseAlphabetical">
                {{ t('home.search.filters.sortBy.reverseAlphabetical') }}
              </option>
            </select>
          </div>

          <!-- Fecha de creación -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-base">{{
                t('home.search.filters.dateRange.label')
              }}</span>
            </label>
            <select v-model="advancedFilters.dateRange" class="select select-bordered w-full">
              <option value="">{{ t('home.search.filters.dateRange.anytime') }}</option>
              <option value="lastWeek">{{ t('home.search.filters.dateRange.lastWeek') }}</option>
              <option value="lastMonth">{{ t('home.search.filters.dateRange.lastMonth') }}</option>
              <option value="last3Months">
                {{ t('home.search.filters.dateRange.last3Months') }}
              </option>
              <option value="lastYear">{{ t('home.search.filters.dateRange.lastYear') }}</option>
            </select>
          </div>

          <!-- Filtros numéricos -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Mínimo de likes -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">{{
                  t('home.search.filters.minLikes.label')
                }}</span>
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
                <span class="label-text font-semibold">{{
                  t('home.search.filters.minComments.label')
                }}</span>
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
              <span class="label-text font-semibold text-base">{{
                t('home.search.filters.creator.label')
              }}</span>
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
            <button @click="clearAdvancedFilters" class="btn btn-ghost flex-1">
              {{ t('home.search.filters.actions.clear') }}
            </button>
            <button @click="applyAdvancedFilters" class="btn btn-primary flex-1">
              {{ t('home.search.filters.actions.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas flotantes en esquina inferior derecha -->
    <div class="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
      <!-- Alerta de éxito -->
      <Transition name="slide-fade">
        <div v-if="showSuccessAlert" role="alert" class="alert alert-success shadow-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{{ successAlertMessage }}</span>
          <button @click="showSuccessAlert = false" class="btn btn-ghost btn-sm btn-circle">
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </Transition>
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
  FunnelIcon,
} from '@/icons'
import type AppFooterVue from '@/components/AppFooter.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()
const { t, locale } = useTranslation()

const { profile } = storeToRefs(authStore)
const { projects, loading } = storeToRefs(projectsStore)

// Estados para búsqueda
const searchQuery = ref('')

// Estados para alertas de notificación
const showSuccessAlert = ref(false)
const successAlertMessage = ref('')

// Estado del modal de filtros avanzados
const showAdvancedFilters = ref(false)
const advancedFilters = ref({
  status: '',
  tags: '',
  sortBy: 'newest',
  dateRange: '',
  minLikes: null as number | null,
  minComments: null as number | null,
  creator: '',
})
const appliedFilters = ref({ ...advancedFilters.value })

// Computed para el usuario actual
const user = computed(() => profile.value)

// Computed para mensaje dinámico cuando no hay proyectos
const noProjectsMessage = computed(() => {
  if (searchQuery.value.trim()) {
    return {
      title: t('home.feed.noResults.search.title', { query: searchQuery.value }),
      subtitle: t('home.feed.noResults.search.subtitle'),
    }
  }

  if (activeFilter.value !== 'todos') {
    const filterName = feedFilters.value.find((f) => f.key === activeFilter.value)?.label || ''
    return {
      title: t('home.feed.noResults.filter.title', { filter: filterName }),
      subtitle: t('home.feed.noResults.filter.subtitle'),
    }
  }

  // Si hay filtros avanzados aplicados
  if (
    appliedFilters.value.status ||
    appliedFilters.value.tags ||
    appliedFilters.value.dateRange ||
    appliedFilters.value.minLikes ||
    appliedFilters.value.minComments ||
    appliedFilters.value.creator
  ) {
    return {
      title: t('home.feed.noResults.advancedFilters.title'),
      subtitle: t('home.feed.noResults.advancedFilters.subtitle'),
    }
  }

  return {
    title: t('common.noProjects'),
    subtitle: t('common.beFirst'),
  }
})

const activeFilter = ref('todos')
const showCreateForm = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const newProjectTitle = ref('')
const newProjectDescription = ref('')
const newProjectStatus = ref<'planning' | 'in_progress' | 'completed' | 'on_hold'>('planning')
const newProjectImageUrl = ref('')
const newProjectTags = ref<string[]>([])
const currentTagInput = ref('')
const isLoading = ref(false)
let refreshInterval: number | null = null

// Filtros para el feed - computed para reactividad con traducciones
const feedFilters = computed(() => [
  { key: 'todos', label: t('home.feed.all') },
  { key: 'recientes', label: t('home.feed.recent') },
  { key: 'planificando', label: t('home.feed.planning') },
  { key: 'en-progreso', label: t('home.feed.inProgress') },
  { key: 'completados', label: t('home.feed.completed') },
])

// Computed properties
const myProjects = computed(() => {
  if (!profile.value) return []
  return projects.value.filter((p: Project) => p.created_by === profile.value?.id)
})

const myProjectsCount = computed(() => myProjects.value.length)

const totalLikes = computed(() => {
  return myProjects.value.reduce(
    (total: number, project: Project) => total + (project.likes_count || 0),
    0,
  )
})

const myInProgressProjects = computed(() => {
  if (!profile.value) return []
  return projects.value
    .filter(
      (p: Project) =>
        p.creator?.id === profile.value?.id &&
        (p.status === 'in_progress' || p.status === 'En Progreso'),
    )
    .slice(0, 3)
})

const topLikedProjects = computed(() => {
  return [...projects.value].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)).slice(0, 5)
})

const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  // Aplicar búsqueda por query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(query))) ||
        (p.creator?.full_name && p.creator.full_name.toLowerCase().includes(query)),
    )
  }

  // Aplicar filtro básico del feed
  switch (activeFilter.value) {
    case 'recientes':
      // Se ordenará después
      break
    case 'planificando':
      filtered = filtered.filter((p) => p.status === 'planning' || p.status === 'Planificando')
      break
    case 'en-progreso':
      filtered = filtered.filter((p) => p.status === 'En Progreso' || p.status === 'in_progress')
      break
    case 'completados':
      filtered = filtered.filter((p) => p.status === 'Completado' || p.status === 'completed')
      break
  }

  // Aplicar filtros avanzados
  if (appliedFilters.value.status) {
    filtered = filtered.filter(
      (p) =>
        p.status === appliedFilters.value.status ||
        (appliedFilters.value.status === 'planning' && p.status === 'Planificando') ||
        (appliedFilters.value.status === 'in_progress' && p.status === 'En Progreso') ||
        (appliedFilters.value.status === 'completed' && p.status === 'Completado') ||
        (appliedFilters.value.status === 'on_hold' && p.status === 'En Pausa'),
    )
  }

  // Filtrar por tecnologías/tags
  if (appliedFilters.value.tags) {
    const searchTags = appliedFilters.value.tags
      .toLowerCase()
      .split(',')
      .map((t) => t.trim())
    filtered = filtered.filter(
      (p) =>
        p.tags &&
        p.tags.some((tag) => searchTags.some((searchTag) => tag.toLowerCase().includes(searchTag))),
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

    filtered = filtered.filter((p) => new Date(p.created_at) >= cutoffDate)
  }

  // Filtrar por mínimo de likes
  if (appliedFilters.value.minLikes !== null && appliedFilters.value.minLikes > 0) {
    filtered = filtered.filter((p) => (p.likes_count || 0) >= appliedFilters.value.minLikes!)
  }

  // Filtrar por mínimo de comentarios
  if (appliedFilters.value.minComments !== null && appliedFilters.value.minComments > 0) {
    filtered = filtered.filter((p) => (p.comments_count || 0) >= appliedFilters.value.minComments!)
  }

  // Filtrar por creador
  if (appliedFilters.value.creator) {
    const searchCreator = appliedFilters.value.creator.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.creator?.full_name?.toLowerCase().includes(searchCreator) ||
        p.creator?.email?.toLowerCase().includes(searchCreator),
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
  if (newProjectTags.value.length > 0) optionalFields += 1
  progress += (optionalFields / 2) * 20

  return progress
})

const createProjectCurrentStep = computed(() => {
  if (
    newProjectDescription.value.trim().length > 0 &&
    (newProjectTags.value.length > 0 || newProjectImageUrl.value)
  )
    return 3
  if (newProjectDescription.value.trim().length > 0) return 2
  if (newProjectTitle.value.trim().length > 0) return 1
  return 1
})

const createProjectStepLabels = computed(() => {
  const isSpanish = locale.value === 'es'
  return isSpanish ? ['Básico', 'Detalles', 'Extra'] : ['Basic', 'Details', 'Extra']
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
    planning: t('project.status.planning'),
    Planificando: t('project.status.planning'),
    in_progress: t('project.status.in_progress'),
    'En Progreso': t('project.status.in_progress'),
    completed: t('project.status.completed'),
    Completado: t('project.status.completed'),
    on_hold: t('project.status.on_hold'),
    'En Pausa': t('project.status.on_hold'),
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    planning: 'badge-info',
    in_progress: 'badge-warning',
    completed: 'badge-success',
    on_hold: 'badge-ghost',
    Planificando: 'badge-info',
    'En Progreso': 'badge-warning',
    Completado: 'badge-success',
    'En Pausa': 'badge-ghost',
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
  newProjectTags.value = []
  currentTagInput.value = ''
  showCreateForm.value = false
}

// Métodos para manejar etiquetas
const addTag = () => {
  const tag = currentTagInput.value.trim()
  if (tag && !newProjectTags.value.includes(tag)) {
    newProjectTags.value.push(tag)
    currentTagInput.value = ''
  }
}

const removeTag = (index: number) => {
  newProjectTags.value.splice(index, 1)
}

// Método para mostrar alerta de éxito
const showSuccessNotification = (message: string) => {
  successAlertMessage.value = message
  showSuccessAlert.value = true
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 5000)
}

// Método para crear proyecto
const createProject = async () => {
  if (!newProjectTitle.value.trim() || !newProjectDescription.value.trim() || !user.value) return

  isLoading.value = true
  try {
    await projectsStore.createProject({
      title: newProjectTitle.value,
      description: newProjectDescription.value,
      status: newProjectStatus.value,
      image_url: newProjectImageUrl.value || undefined,
      tags: newProjectTags.value,
      team_members: [],
      created_by: user.value.id,
    })

    resetCreateForm()
    // Refrescar proyectos
    await projectsStore.fetchProjects()

    // Mostrar alerta de éxito
    showSuccessNotification(t('home.createProject.successMessage'))
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

// Método para limpiar todos los filtros
const clearAllFilters = () => {
  searchQuery.value = ''
  activeFilter.value = 'todos'
  advancedFilters.value = {
    status: '',
    tags: '',
    sortBy: 'newest',
    dateRange: '',
    minLikes: null,
    minComments: null,
    creator: '',
  }
  appliedFilters.value = { ...advancedFilters.value }
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
    creator: '',
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

.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/src/assets/banner1.jpg');
  background-repeat: no-repeat;
}

.filter-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/src/assets/banner3.jpg');
  background-repeat: no-repeat;
}

/* Animaciones para alertas */
.slide-fade-enter-active {
  animation: slide-fade-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-fade-leave-active {
  animation: slide-fade-out 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slide-fade-in {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }

  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slide-fade-out {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}
</style>
