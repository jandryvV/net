import { ref } from 'vue'

export interface ValidationRule {
  validator: (value: any) => boolean
  message: string
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export function useFormValidation(rules: ValidationRules) {
  const errors = ref<Record<string, string>>({})
  const isValid = ref(true)

  const validate = (field: string, value: any): boolean => {
    const fieldRules = rules[field] || []

    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors.value[field] = rule.message
        updateValidityStatus()
        return false
      }
    }

    delete errors.value[field]
    updateValidityStatus()
    return true
  }

  const validateAll = (formData: Record<string, any>): boolean => {
    let allValid = true

    Object.keys(rules).forEach(field => {
      const fieldValid = validate(field, formData[field])
      if (!fieldValid) allValid = false
    })

    return allValid
  }

  const clearErrors = () => {
    errors.value = {}
    isValid.value = true
  }

  const clearError = (field: string) => {
    delete errors.value[field]
    updateValidityStatus()
  }

  const updateValidityStatus = () => {
    isValid.value = Object.keys(errors.value).length === 0
  }

  return {
    errors,
    isValid,
    validate,
    validateAll,
    clearErrors,
    clearError
  }
}

// Common validation rules
export const validationRules = {
  required: (message = 'Este campo es obligatorio') => ({
    validator: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0
      return value !== null && value !== undefined && value !== ''
    },
    message
  }),

  email: (message = 'Debe ser un email válido') => ({
    validator: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !value || emailRegex.test(value)
    },
    message
  }),

  minLength: (min: number, message?: string) => ({
    validator: (value: string) => {
      return !value || value.length >= min
    },
    message: message || `Debe tener al menos ${min} caracteres`
  }),

  maxLength: (max: number, message?: string) => ({
    validator: (value: string) => {
      return !value || value.length <= max
    },
    message: message || `No puede tener más de ${max} caracteres`
  }),

  url: (message = 'Debe ser una URL válida') => ({
    validator: (value: string) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message
  }),

  match: (compareValue: any, message = 'Los valores no coinciden') => ({
    validator: (value: any) => {
      return value === compareValue
    },
    message
  })
}
