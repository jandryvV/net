<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 animate-pulse">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Cover Section Skeleton -->
      <div class="relative mb-8">
        <div class="h-48 bg-base-300 rounded-2xl shadow-xl"></div>
        <div class="absolute -bottom-16 left-8">
          <div
            class="w-32 h-32 rounded-full bg-base-300 ring ring-base-100 ring-offset-base-100 ring-offset-2 shadow-2xl"
          ></div>
        </div>
      </div>

      <!-- Profile Info Section Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <!-- Left Column - Profile Details Skeleton -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info Card Skeleton -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <!-- Name -->
                  <div class="h-10 bg-base-300 rounded w-2/3 mb-3"></div>
                  <!-- Email -->
                  <div class="h-5 bg-base-300 rounded w-1/2 mb-3"></div>
                  <!-- Member since -->
                  <div class="h-4 bg-base-300 rounded w-1/3"></div>
                </div>
                <!-- Edit button -->
                <div class="h-12 w-32 bg-base-300 rounded-lg"></div>
              </div>

              <!-- Bio skeleton -->
              <div class="bg-base-200 rounded-xl p-4 mt-4">
                <div class="h-5 bg-base-300 rounded w-24 mb-3"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-base-300 rounded w-full"></div>
                  <div class="h-4 bg-base-300 rounded w-full"></div>
                  <div class="h-4 bg-base-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Projects Card Skeleton -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <div class="h-7 bg-base-300 rounded w-48 mb-4"></div>
              <div class="space-y-3">
                <!-- Project items -->
                <div
                  v-for="i in 3"
                  :key="i"
                  class="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                >
                  <div class="w-10 h-10 rounded-lg bg-base-300"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-base-300 rounded w-1/2"></div>
                  </div>
                  <div class="h-4 bg-base-300 rounded w-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Stats & Quick Actions Skeleton -->
        <div class="space-y-6">
          <!-- Stats Cards Skeleton -->
          <div class="grid grid-cols-1 gap-4">
            <div v-for="i in 3" :key="i" class="card bg-base-200 shadow-lg">
              <div class="card-body text-center">
                <div class="h-12 w-12 bg-base-300 rounded-full mx-auto mb-2"></div>
                <div class="h-8 bg-base-300 rounded w-16 mx-auto mb-2"></div>
                <div class="h-4 bg-base-300 rounded w-24 mx-auto"></div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card Skeleton -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50">
            <div class="card-body">
              <div class="h-6 bg-base-300 rounded w-32 mb-4"></div>
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" class="h-12 bg-base-300 rounded-lg"></div>
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
