<template>
  <div v-if="isSupported && isEnabled" class="fixed bottom-6 right-6 z-50">
    <!-- Floating Action Button -->
    <div class="relative">
      <!-- Main Button -->
      <button
        @click="toggleMenu"
        class="btn btn-circle btn-lg shadow-2xl"
        :class="isSpeaking ? 'btn-error' : 'btn-primary'"
        :title="$t('accessibility.textToSpeech')"
      >
        <svg
          v-if="!isSpeaking"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586a2 2 0 001.414.586h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 012.828 0l.814.814A2 2 0 0017.414 16h2.172a2 2 0 001.414-.586l.814-.814a2 2 0 000-2.828l-.814-.814a2 2 0 01-.586-1.414V8a2 2 0 00-.586-1.414L19 5.172a2 2 0 00-2.828 0L15 6"
          />
        </svg>
        <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
      </button>

      <!-- Action Menu -->
      <div
        v-show="menuOpen"
        class="absolute bottom-20 right-0 bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-4 w-72 space-y-3"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-lg">{{ $t('accessibility.textToSpeech') }}</h3>
          <button @click="menuOpen = false" class="btn btn-ghost btn-sm btn-circle">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <button
            @click="readPageContent"
            class="btn btn-primary btn-block justify-start gap-2"
            :disabled="isSpeaking"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {{ $t('accessibility.readPage') }}
          </button>

          <button
            @click="readSelectedText"
            class="btn btn-outline btn-block justify-start gap-2"
            :disabled="isSpeaking"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ $t('accessibility.readSelection') }}
          </button>

          <button
            v-if="isSpeaking"
            @click="stopReading"
            class="btn btn-error btn-block justify-start gap-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            {{ $t('accessibility.stop') }}
          </button>
        </div>

        <div class="divider my-2"></div>

        <!-- Voice Settings -->
        <div class="space-y-3">
          <div>
            <label class="label">
              <span class="label-text">{{ $t('accessibility.speed') }}</span>
              <span class="label-text-alt">{{ rate.toFixed(1) }}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              v-model.number="rate"
              class="range range-primary range-sm"
            />
          </div>

          <div>
            <label class="label">
              <span class="label-text">{{ $t('accessibility.volume') }}</span>
              <span class="label-text-alt">{{ Math.round(volume * 100) }}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model.number="volume"
              class="range range-primary range-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTextToSpeech } from '@/composables/useTextToSpeech'

const {
  isSupported,
  isEnabled,
  isSpeaking,
  rate,
  volume,
  speak,
  stop,
  readSelection,
  setRate,
  setVolume,
} = useTextToSpeech()

const menuOpen = ref(false)

const toggleMenu = () => {
  if (isSpeaking.value) {
    stop()
  } else {
    menuOpen.value = !menuOpen.value
  }
}

const readPageContent = () => {
  const mainContent = document.querySelector('main') || document.body
  const text = mainContent.textContent || ''
  speak(text)
  menuOpen.value = false
}

const readSelectedText = () => {
  readSelection()
  menuOpen.value = false
}

const stopReading = () => {
  stop()
  menuOpen.value = false
}

// Watch rate and volume changes
watch(rate, (newRate) => {
  setRate(newRate)
})

watch(volume, (newVolume) => {
  setVolume(newVolume)
})

// Close menu when speaking starts
watch(isSpeaking, (speaking) => {
  if (!speaking && menuOpen.value) {
    // Keep menu open when speech ends
  }
})
</script>

<style scoped>
/* Add smooth transitions */
.btn {
  transition: all 0.3s ease;
}

/* Pulse animation when speaking */
.btn-error {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}
</style>
