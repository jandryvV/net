<template>
  <div class="min-h-screen bg-base-200 animate-pulse">
    <!-- Hero Background Skeleton -->
    <div class="h-48 bg-base-300">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center space-y-4">
          <!-- Title -->
          <div class="h-10 bg-base-100/20 rounded w-2/3 mx-auto"></div>
          <!-- Subtitle -->
          <div class="h-6 bg-base-100/20 rounded w-1/2 mx-auto mb-6"></div>
          <!-- Search bar -->
          <div class="max-w-2xl mx-auto">
            <div class="h-14 bg-base-100/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Layout -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar Izquierdo -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Profile Card Skeleton -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="flex flex-col items-center text-center">
                <!-- Avatar -->
                <div class="w-16 h-16 rounded-full bg-base-300 mb-4"></div>
                <!-- Name -->
                <div class="h-6 bg-base-300 rounded w-32 mb-2"></div>
                <!-- Email -->
                <div class="h-4 bg-base-300 rounded w-40 mb-4"></div>
                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 w-full">
                  <div class="text-center">
                    <div class="h-8 bg-base-300 rounded mb-2"></div>
                    <div class="h-3 bg-base-300 rounded"></div>
                  </div>
                  <div class="text-center">
                    <div class="h-8 bg-base-300 rounded mb-2"></div>
                    <div class="h-3 bg-base-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Create Project Card Skeleton -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-base-300"></div>
                <div class="flex-1">
                  <div class="h-12 bg-base-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Skeleton -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-4">
              <div class="flex gap-2">
                <div v-for="i in 5" :key="i" class="h-9 bg-base-300 rounded-full w-24"></div>
              </div>
            </div>
          </div>

          <!-- Project Cards Skeleton -->
          <div v-for="i in 3" :key="i" class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <!-- Header -->
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-base-300"></div>
                <div class="flex-1">
                  <div class="h-4 bg-base-300 rounded w-32 mb-2"></div>
                  <div class="h-3 bg-base-300 rounded w-20"></div>
                </div>
                <div class="h-6 bg-base-300 rounded-full w-24"></div>
              </div>
              <!-- Content -->
              <div class="space-y-3">
                <div class="h-6 bg-base-300 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-base-300 rounded w-full"></div>
                  <div class="h-4 bg-base-300 rounded w-full"></div>
                  <div class="h-4 bg-base-300 rounded w-2/3"></div>
                </div>
                <!-- Image placeholder -->
                <div class="h-48 bg-base-300 rounded-xl"></div>
                <!-- Tags -->
                <div class="flex gap-2">
                  <div class="h-6 bg-base-300 rounded-full w-16"></div>
                  <div class="h-6 bg-base-300 rounded-full w-20"></div>
                  <div class="h-6 bg-base-300 rounded-full w-24"></div>
                </div>
              </div>
              <!-- Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-base-300 mt-4">
                <div class="flex gap-4">
                  <div class="h-8 bg-base-300 rounded w-16"></div>
                  <div class="h-8 bg-base-300 rounded w-16"></div>
                </div>
                <div class="h-8 bg-base-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Derecho -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Trending Card Skeleton -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="h-6 bg-base-300 rounded w-32 mb-4"></div>
              <div class="space-y-3">
                <div v-for="i in 5" :key="i" class="flex gap-3 p-3 rounded-lg bg-base-200">
                  <div class="w-8 h-8 rounded-full bg-base-300"></div>
                  <div class="w-12 h-12 rounded-lg bg-base-300"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-base-300 rounded w-1/2 mb-2"></div>
                    <div class="flex gap-3">
                      <div class="h-3 bg-base-300 rounded w-12"></div>
                      <div class="h-3 bg-base-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
