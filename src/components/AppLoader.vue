<template>
  <div class="fixed inset-0 bg-base-100 flex flex-col items-center justify-center z-50">
    <!-- Logo with pulsing animation -->
    <div class="relative mb-8">
      <!-- Outer rotating ring -->
      <div class="absolute inset-0 animate-spin-slow">
        <svg class="w-24 h-24" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="70 200"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
              <stop offset="50%" style="stop-color: #8b5cf6; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #ec4899; stop-opacity: 1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Logo in the center -->
      <div class="relative z-10 flex items-center justify-center w-24 h-24 animate-pulse-slow">
        <img src="/logo.png" alt="Colab Logo" class="w-16 h-16 object-contain" />
      </div>
    </div>
  </div>

  <!-- Brand name -->
  <div class="fixed bottom-8 left-0 right-0 flex flex-col items-center z-50">
    <span class="text-sm text-[#7489a0] mb-1 font-bold">by</span>
    <h2
      class="text-2xl font-bold bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none"
    >
      Colab
    </h2>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
