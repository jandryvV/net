<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error ml-1">*</span>
      </span>
      <span v-if="hint" class="label-text-alt text-base-content/60">{{ hint }}</span>
    </label>

    <div class="relative">
      <!-- Input Field -->
      <input
        :id="id"
        :type="computedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :class="inputClasses"
        :autocomplete="autocomplete"
      />

      <!-- Icon -->
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-base-content/40" />
      </div>

      <!-- Toggle password visibility -->
      <button
        v-if="type === 'password' && modelValue"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-base-content/80 transition-colors"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5 text-base-content/40" />
        <EyeSlashIcon v-else class="h-5 w-5 text-base-content/40" />
      </button>

      <!-- Clear button -->
      <button
        v-else-if="clearable && modelValue && !disabled && !readonly && type !== 'password'"
        type="button"
        @click="handleClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <XMarkIcon class="h-4 w-4 text-base-content/40 hover:text-base-content/60" />
      </button>

      <!-- Loading spinner -->
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <span class="loading loading-spinner loading-sm"></span>
      </div>
    </div>

    <!-- Error message -->
    <label v-if="error" class="label">
      <span class="label-text-alt text-error flex items-center gap-1">
        <ExclamationCircleIcon class="h-4 w-4" />
        {{ error }}
      </span>
    </label>

    <!-- Character count -->
    <label v-if="maxlength && showCount" class="label">
      <span class="label-text-alt" :class="{ 'text-warning': characterCount > maxlength * 0.8, 'text-error': characterCount > maxlength }">
        {{ characterCount }}/{{ maxlength }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { XMarkIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  id?: string
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'ghost'
  icon?: any
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  showCount: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: Event]
  focus: [event: Event]
  clear: []
}>()

const showPassword = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const inputClasses = computed(() => {
  const baseClasses = 'input w-full transition-colors duration-200'
  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg'
  }
  const variantClasses = {
    default: 'input-bordered',
    bordered: 'input-bordered border-2',
    ghost: 'input-ghost'
  }

  let classes = `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`

  if (props.error) {
    classes += ' input-error border-error focus:border-error'
  } else {
    classes += ' focus:border-primary'
  }

  if (props.disabled) {
    classes += ' input-disabled'
  }

  if (props.icon) {
    classes += ' pl-10'
  }

  if (props.clearable && props.modelValue && !props.disabled && !props.readonly) {
    classes += ' pr-10'
  }

  if (props.loading) {
    classes += ' pr-10'
  }

  return classes
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  if (props.type === 'number') {
    value = parseFloat(value) || 0
  }

  emit('update:modelValue', value)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
