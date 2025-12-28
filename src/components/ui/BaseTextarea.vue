<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error ml-1">*</span>
      </span>
      <span v-if="hint" class="label-text-alt text-base-content/60">{{ hint }}</span>
    </label>

    <textarea
      :id="id"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      :class="textareaClasses"
    ></textarea>

    <!-- Error message -->
    <label v-if="error" class="label">
      <span class="label-text-alt text-error flex items-center gap-1">
        <ExclamationCircleIcon class="h-4 w-4" />
        {{ error }}
      </span>
    </label>

    <!-- Character count -->
    <label v-if="maxlength && showCount" class="label">
      <span
        class="label-text-alt"
        :class="{
          'text-warning': characterCount > maxlength * 0.8,
          'text-error': characterCount > maxlength,
        }"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  id?: string
  modelValue: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  showCount?: boolean
  rows?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'ghost'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'md',
  variant: 'default',
  showCount: false,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: Event]
  focus: [event: Event]
}>()

const characterCount = computed(() => {
  return (props.modelValue || '').length
})

const textareaClasses = computed(() => {
  const baseClasses = 'textarea w-full transition-colors duration-200'
  const sizeClasses = {
    sm: 'textarea-sm',
    md: 'textarea-md',
    lg: 'textarea-lg',
  }
  const variantClasses = {
    default: 'textarea-bordered',
    bordered: 'textarea-bordered border-2',
    ghost: 'textarea-ghost',
  }
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  }

  let classes = `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]} ${resizeClasses[props.resize]}`

  if (props.error) {
    classes += ' textarea-error border-error focus:border-error'
  } else {
    classes += ' focus:border-primary'
  }

  if (props.disabled) {
    classes += ' textarea-disabled'
  }

  return classes
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}
</script>
