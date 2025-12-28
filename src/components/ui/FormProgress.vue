<template>
  <div class="w-full mb-6">
    <!-- Progress Bar -->
    <div class="relative">
      <div class="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-base-300">
        <div
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out"
          :class="progressColor"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <!-- Progress Text -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-base-content/70 font-medium">
          {{ label }}
        </span>
        <span class="text-base-content/60 font-semibold"> {{ Math.round(progress) }}% </span>
      </div>
    </div>

    <!-- Steps Indicators (optional) -->
    <div v-if="showSteps && steps > 0" class="flex justify-between mt-3">
      <div v-for="step in steps" :key="step" class="flex flex-col items-center flex-1">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1"
          :class="getStepClass(step)"
        >
          <svg
            v-if="step <= currentStep"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span v-else class="text-xs font-bold">{{ step }}</span>
        </div>
        <span
          v-if="stepLabels && stepLabels[step - 1]"
          class="text-xs text-center transition-all duration-300"
          :class="step <= currentStep ? 'text-primary font-medium' : 'text-base-content/50'"
        >
          {{ stepLabels[step - 1] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress: number
  label?: string
  showSteps?: boolean
  steps?: number
  currentStep?: number
  stepLabels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  label: 'Progreso',
  showSteps: false,
  steps: 0,
  currentStep: 1,
  stepLabels: undefined,
})

const progressColor = computed(() => {
  if (props.progress >= 100) return 'bg-success'
  if (props.progress >= 75) return 'bg-info'
  if (props.progress >= 50) return 'bg-warning'
  if (props.progress >= 25) return 'bg-primary'
  return 'bg-error'
})

const getStepClass = (step: number) => {
  if (step < props.currentStep) {
    return 'bg-success text-success-content border-2 border-success'
  } else if (step === props.currentStep) {
    return 'bg-primary text-primary-content border-2 border-primary shadow-lg scale-110'
  } else {
    return 'bg-base-300 text-base-content/50 border-2 border-base-300'
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios en el futuro */
</style>
