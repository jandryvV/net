import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    app: {
      name: 'ProjectHub',
      tagline: 'La red social para gestionar y compartir proyectos increíbles'
    },
    nav: {
      home: 'Inicio',
      myProjects: 'Mis Proyectos',
      profile: 'Perfil',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      settings: 'Configuración'
    },
    auth: {
      login: {
        title: 'Iniciar Sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        submit: 'Iniciar Sesión',
        loading: 'Iniciando...',
        noAccount: '¿No tienes cuenta?',
        registerHere: 'Regístrate aquí',
        forgotPassword: '¿Olvidaste tu contraseña?'
      },
      register: {
        title: 'Crear Cuenta',
        fullName: 'Nombre completo',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar contraseña',
        submit: 'Crear Cuenta',
        loading: 'Registrando...',
        hasAccount: '¿Ya tienes cuenta?',
        loginHere: 'Inicia sesión aquí',
        success: 'Cuenta creada exitosamente. Verifica tu email.'
      },
      validation: {
        required: 'Este campo es obligatorio',
        email: 'Debe ser un email válido',
        minLength: 'Debe tener al menos {min} caracteres',
        passwordMatch: 'Las contraseñas no coinciden',
        invalidCredentials: 'Credenciales incorrectas',
        error: 'Error al procesar la solicitud'
      }
    },
    project: {
      create: {
        title: 'Crear Nuevo Proyecto',
        projectTitle: 'Título del proyecto',
        description: 'Descripción',
        status: 'Estado del proyecto',
        tags: 'Etiquetas',
        imageUrl: 'URL de imagen (opcional)',
        teamMembers: 'Miembros del equipo (emails)',
        submit: 'Crear Proyecto',
        loading: 'Creando...',
        cancel: 'Cancelar',
        placeholders: {
          title: 'Nombre de tu proyecto',
          description: 'Describe tu proyecto, objetivos, tecnologías...',
          tags: 'react, nodejs, api (separadas por comas)',
          imageUrl: 'https://ejemplo.com/imagen.jpg',
          teamMembers: 'usuario@email.com, otro@email.com'
        }
      },
      status: {
        planning: 'Planificando',
        in_progress: 'En Progreso',
        completed: 'Completado',
        on_hold: 'En Pausa'
      },
      actions: {
        view: 'Ver Proyecto',
        edit: 'Editar',
        delete: 'Eliminar',
        share: 'Compartir',
        report: 'Reportar',
        like: 'Me gusta',
        comment: 'Comentar'
      }
    },
    profile: {
      title: 'Mi Perfil',
      edit: 'Editar Perfil',
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      bio: 'Biografía',
      avatarUrl: 'URL del avatar',
      memberSince: 'Miembro desde',
      save: 'Guardar',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      placeholders: {
        bio: 'Cuéntanos sobre ti...',
        avatarUrl: 'https://ejemplo.com/avatar.jpg'
      },
      stats: {
        projects: 'Proyectos',
        likes: 'Likes',
        completed: 'Completados',
        projectsCreated: 'Proyectos creados',
        totalLikes: 'En todos los proyectos',
        projectsFinished: 'Proyectos finalizados'
      }
    },
    myProjects: {
      title: 'Mis Proyectos',
      newProject: 'Nuevo Proyecto',
      stats: {
        total: 'Total',
        completed: 'Completados',
        inProgress: 'En Progreso',
        totalLikes: 'Likes Totales'
      },
      filters: {
        allStatus: 'Todos los estados',
        sortBy: {
          newest: 'Más recientes',
          lastUpdate: 'Última actualización',
          popular: 'Más populares',
          alphabetic: 'Alfabético'
        }
      },
      empty: {
        title: 'No tienes proyectos aún',
        subtitle: '¡Crea tu primer proyecto y compártelo con la comunidad!',
        action: 'Crear Mi Primer Proyecto'
      },
      deleteConfirm: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar el proyecto "{title}"? Esta acción no se puede deshacer.',
        confirm: 'Eliminar',
        deleting: 'Eliminando...'
      }
    },
    home: {
      hero: {
        title: 'ProjectHub',
        subtitle: 'La red social para gestionar y compartir proyectos increíbles',
        joinNow: 'Únete ahora'
      },
      createProject: {
        title: '¿Qué proyecto estás construyendo?',
        action: 'Crear Nuevo Proyecto'
      },
      recentProjects: 'Proyectos Recientes',
      empty: {
        title: 'No hay proyectos aún',
        subtitle: '¡Sé el primero en compartir un proyecto!'
      }
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      viewAll: 'Ver todos',
      team: 'Equipo',
      imagePreview: 'Vista previa',
      imageError: 'No se pudo cargar la imagen',
      required: 'Obligatorio',
      or: 'O',
      more: 'más',
      member: 'Miembro',
      dates: {
        yesterday: 'Ayer',
        daysAgo: 'Hace {days} días',
        weeksAgo: 'Hace {weeks} semanas'
      }
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Automático'
    },
    language: {
      spanish: 'Español',
      english: 'English'
    }
  },
  en: {
    app: {
      name: 'ProjectHub',
      tagline: 'The social network for managing and sharing amazing projects'
    },
    nav: {
      home: 'Home',
      myProjects: 'My Projects',
      profile: 'Profile',
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Sign Out',
      settings: 'Settings'
    },
    auth: {
      login: {
        title: 'Sign In',
        email: 'Email',
        password: 'Password',
        submit: 'Sign In',
        loading: 'Signing in...',
        noAccount: "Don't have an account?",
        registerHere: 'Sign up here',
        forgotPassword: 'Forgot your password?'
      },
      register: {
        title: 'Create Account',
        fullName: 'Full name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        submit: 'Create Account',
        loading: 'Creating account...',
        hasAccount: 'Already have an account?',
        loginHere: 'Sign in here',
        success: 'Account created successfully. Please verify your email.'
      },
      validation: {
        required: 'This field is required',
        email: 'Must be a valid email',
        minLength: 'Must be at least {min} characters',
        passwordMatch: 'Passwords do not match',
        invalidCredentials: 'Invalid credentials',
        error: 'Error processing request'
      }
    },
    project: {
      create: {
        title: 'Create New Project',
        projectTitle: 'Project title',
        description: 'Description',
        status: 'Project status',
        tags: 'Tags',
        imageUrl: 'Image URL (optional)',
        teamMembers: 'Team members (emails)',
        submit: 'Create Project',
        loading: 'Creating...',
        cancel: 'Cancel',
        placeholders: {
          title: 'Your project name',
          description: 'Describe your project, goals, technologies...',
          tags: 'react, nodejs, api (comma separated)',
          imageUrl: 'https://example.com/image.jpg',
          teamMembers: 'user@email.com, another@email.com'
        }
      },
      status: {
        planning: 'Planning',
        in_progress: 'In Progress',
        completed: 'Completed',
        on_hold: 'On Hold'
      },
      actions: {
        view: 'View Project',
        edit: 'Edit',
        delete: 'Delete',
        share: 'Share',
        report: 'Report',
        like: 'Like',
        comment: 'Comment'
      }
    },
    profile: {
      title: 'My Profile',
      edit: 'Edit Profile',
      fullName: 'Full name',
      email: 'Email',
      bio: 'Bio',
      avatarUrl: 'Avatar URL',
      memberSince: 'Member since',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      placeholders: {
        bio: 'Tell us about yourself...',
        avatarUrl: 'https://example.com/avatar.jpg'
      },
      stats: {
        projects: 'Projects',
        likes: 'Likes',
        completed: 'Completed',
        projectsCreated: 'Projects created',
        totalLikes: 'Across all projects',
        projectsFinished: 'Projects finished'
      }
    },
    myProjects: {
      title: 'My Projects',
      newProject: 'New Project',
      stats: {
        total: 'Total',
        completed: 'Completed',
        inProgress: 'In Progress',
        totalLikes: 'Total Likes'
      },
      filters: {
        allStatus: 'All statuses',
        sortBy: {
          newest: 'Newest',
          lastUpdate: 'Last updated',
          popular: 'Most popular',
          alphabetic: 'Alphabetic'
        }
      },
      empty: {
        title: 'No projects yet',
        subtitle: 'Create your first project and share it with the community!',
        action: 'Create My First Project'
      },
      deleteConfirm: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete the project "{title}"? This action cannot be undone.',
        confirm: 'Delete',
        deleting: 'Deleting...'
      }
    },
    home: {
      hero: {
        title: 'ProjectHub',
        subtitle: 'The social network for managing and sharing amazing projects',
        joinNow: 'Join Now'
      },
      createProject: {
        title: 'What project are you building?',
        action: 'Create New Project'
      },
      recentProjects: 'Recent Projects',
      empty: {
        title: 'No projects yet',
        subtitle: 'Be the first to share a project!'
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      viewAll: 'View all',
      team: 'Team',
      imagePreview: 'Preview',
      imageError: 'Could not load image',
      required: 'Required',
      or: 'Or',
      more: 'more',
      member: 'Member',
      dates: {
        yesterday: 'Yesterday',
        daysAgo: '{days} days ago',
        weeksAgo: '{weeks} weeks ago'
      }
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto'
    },
    language: {
      spanish: 'Español',
      english: 'English'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages
})

export default i18n
