<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="loading loading-spinner loading-sm"></span>

    <!-- Left icon -->
    <component v-if="leftIcon && !loading" :is="leftIcon" :class="iconClasses" />

    <!-- Content -->
    <span v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>

    <!-- Right icon -->
    <component v-if="rightIcon && !loading" :is="rightIcon" :class="iconClasses" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'info' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  outline?: boolean
  glass?: boolean
  wide?: boolean
  block?: boolean
  disabled?: boolean
  loading?: boolean
  label?: string
  leftIcon?: any
  rightIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'btn transition-all duration-200'

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    link: 'btn-link',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error'
  }

  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }

  const shapeClasses = {
    square: 'btn-square',
    circle: 'btn-circle'
  }

  let classes = `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`

  if (props.shape) {
    classes += ` ${shapeClasses[props.shape]}`
  }

  if (props.outline) {
    classes += ' btn-outline'
  }

  if (props.glass) {
    classes += ' glass'
  }

  if (props.wide) {
    classes += ' btn-wide'
  }

  if (props.block) {
    classes += ' btn-block'
  }

  if (props.loading) {
    classes += ' btn-disabled'
  }

  return classes
})

const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return sizeMap[props.size]
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
