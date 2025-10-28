<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error ml-1">*</span>
      </span>
      <span v-if="hint" class="label-text-alt text-base-content/60">{{ hint }}</span>
    </label>

    <select
      :id="id"
      :disabled="disabled"
      :value="modelValue"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
      :class="selectClasses"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>

    <!-- Error message -->
    <label v-if="error" class="label">
      <span class="label-text-alt text-error flex items-center gap-1">
        <ExclamationCircleIcon class="h-4 w-4" />
        {{ error }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  id?: string
  modelValue: string | number
  options: (Option | string | number)[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: Event]
  focus: [event: Event]
}>()

const selectClasses = computed(() => {
  const baseClasses = 'select w-full transition-colors duration-200'
  const sizeClasses = {
    sm: 'select-sm',
    md: 'select-md',
    lg: 'select-lg'
  }
  const variantClasses = {
    default: 'select-bordered',
    bordered: 'select-bordered border-2',
    ghost: 'select-ghost'
  }

  let classes = `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`

  if (props.error) {
    classes += ' select-error border-error focus:border-error'
  } else {
    classes += ' focus:border-primary'
  }

  if (props.disabled) {
    classes += ' select-disabled'
  }

  return classes
})

const getOptionValue = (option: Option | string | number): string | number => {
  if (typeof option === 'object') {
    return option.value
  }
  return option
}

const getOptionLabel = (option: Option | string | number): string => {
  if (typeof option === 'object') {
    return option.label
  }
  return String(option)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  let value: string | number = target.value

  // Try to convert to number if the original value was a number
  const originalOption = props.options.find(opt => getOptionValue(opt) == value)
  if (originalOption && typeof getOptionValue(originalOption) === 'number') {
    value = Number(value)
  }

  emit('update:modelValue', value)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}
</script>
