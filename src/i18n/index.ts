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
      news: 'Noticias y Novedades',
      about: 'Acerca de',
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
        success: 'Cuenta creada exitosamente. Verifica tu email.',
        acceptTerms: 'Acepto los',
        termsOfUse: 'Términos de uso',
        and: 'y la',
        privacyPolicy: 'Política de privacidad',
        welcome: {
          subtitle: 'Únete a miles de desarrolladores que ya están construyendo el futuro de la tecnología.',
          benefit1Title: 'Colabora con desarrolladores',
          benefit1Desc: 'Conecta con talento de todo el mundo',
          benefit2Title: 'Comparte tus proyectos',
          benefit2Desc: 'Muestra tu trabajo y recibe feedback',
          benefit3Title: 'Crece profesionalmente',
          benefit3Desc: 'Aprende de los mejores proyectos',
          minCharacters: 'Mínimo 6 caracteres'
        },
        errors: {
          allFields: 'Por favor completa todos los campos',
          acceptTermsRequired: 'Debes aceptar los términos de uso y política de privacidad',
          passwordMismatch: 'Las contraseñas no coinciden',
          passwordLength: 'La contraseña debe tener al menos 6 caracteres',
          createAccount: 'Error al crear la cuenta'
        }
      },
      resetPassword: {
        title: 'Restablecer Contraseña',
        subtitle: 'Ingresa tu nueva contraseña',
        backToLogin: 'Volver al inicio de sesión'
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
      loading: 'Cargando perfil...',
      edit: 'Editar Perfil',
      editTitle: 'Editar Perfil',
      editSubtitle: 'Actualiza tu información personal',
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      bio: 'Biografía',
      aboutMe: 'Acerca de mí',
      avatarUrl: 'URL del avatar',
      memberSince: 'Miembro desde',
      save: 'Guardar Cambios',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      updateSuccess: 'Perfil actualizado correctamente',
      updateError: 'Error al actualizar el perfil',
      placeholders: {
        fullName: 'Tu nombre completo...',
        bio: 'Cuéntanos sobre ti...',
        avatarUrl: 'https://ejemplo.com/avatar.jpg'
      },
      stats: {
        projects: 'Proyectos',
        likes: 'Likes',
        comments: 'Comentarios',
        completed: 'Completados',
        projectsCreated: 'Proyectos Creados',
        likesReceived: 'Likes Recibidos',
        totalLikes: 'En todos los proyectos',
        projectsFinished: 'Proyectos finalizados'
      },
      recentProjects: 'Proyectos Recientes',
      noProjects: 'No tienes proyectos aún',
      createFirst: '¡Crea tu primer proyecto!',
      quickActions: 'Acciones Rápidas',
      createProject: 'Crear Proyecto',
      viewProjects: 'Ver Mis Proyectos',
      settings: 'Configuración'
    },
    myProjects: {
      title: 'Mis Proyectos',
      subtitle: 'Gestiona y comparte tus proyectos con la comunidad',
      newProject: 'Nuevo Proyecto',
      stats: {
        total: 'Total',
        completed: 'Completados',
        inProgress: 'En Progreso',
        totalLikes: 'Likes Totales'
      },
      filters: {
        title: 'Filtrar y ordenar:',
        allStatus: 'Todos los estados',
        searchPlaceholder: 'Buscar en mis proyectos...',
        sortBy: {
          newest: 'Más recientes',
          lastUpdate: 'Última actualización',
          popular: 'Más populares',
          alphabetic: 'Alfabético'
        }
      },
      empty: {
        title: 'No tienes proyectos aún',
        titleFiltered: 'No hay proyectos con este estado',
        subtitle: '¡Crea tu primer proyecto y compártelo con la comunidad!',
        subtitleFiltered: 'Prueba con otro filtro',
        action: 'Crear Mi Primer Proyecto'
      },
      deleteConfirm: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar el proyecto "{title}"? Esta acción no se puede deshacer.',
        confirm: 'Eliminar',
        deleting: 'Eliminando...'
      }
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Personaliza tu experiencia y gestiona tu cuenta',
      tabs: {
        account: 'Cuenta',
        security: 'Seguridad',
        appearance: 'Apariencia',
        notifications: 'Notificaciones',
        privacy: 'Privacidad',
        about: 'Acerca de'
      },
      account: {
        title: 'Información de la Cuenta',
        fullName: 'Nombre completo',
        email: 'Correo electrónico',
        bio: 'Biografía',
        avatar: 'Avatar',
        avatarUrl: 'URL del avatar',
        saveChanges: 'Guardar Cambios',
        saving: 'Guardando...',
        deleteAccount: 'Eliminar Cuenta',
        deleteAccountWarning: 'Esta acción no se puede deshacer',
        deleteAccountConfirm: 'Eliminar mi cuenta',
        placeholders: {
          fullName: 'Tu nombre completo',
          bio: 'Cuéntanos sobre ti...',
          avatarUrl: 'https://ejemplo.com/avatar.jpg'
        }
      },
      security: {
        title: 'Cambiar Contraseña',
        currentPassword: 'Contraseña actual',
        newPassword: 'Nueva contraseña',
        confirmPassword: 'Confirmar nueva contraseña',
        changePassword: 'Cambiar Contraseña',
        changing: 'Cambiando...',
        resetTitle: 'Recuperar Contraseña',
        resetDescription: 'Envía un enlace de recuperación a tu email registrado',
        sendResetLink: 'Enviar enlace de recuperación',
        sending: 'Enviando...',
        passwordMismatch: 'Las contraseñas no coinciden',
        passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
        placeholders: {
          currentPassword: 'Tu contraseña actual',
          newPassword: 'Nueva contraseña',
          confirmPassword: 'Confirmar nueva contraseña'
        }
      },
      appearance: {
        title: 'Personalización',
        theme: 'Tema',
        themeDescription: 'Elige tu tema preferido',
        light: 'Claro',
        dark: 'Oscuro',
        auto: 'Automático',
        language: 'Idioma',
        languageDescription: 'Selecciona tu idioma preferido',
        spanish: 'Español',
        english: 'English'
      },
      notifications: {
        title: 'Preferencias de Notificaciones',
        email: 'Notificaciones por Email',
        emailDescription: 'Recibe actualizaciones por correo electrónico',
        newProjects: 'Nuevos proyectos',
        newProjectsDescription: 'Notificarme cuando se publiquen nuevos proyectos',
        comments: 'Comentarios',
        commentsDescription: 'Notificarme cuando alguien comente en mis proyectos',
        likes: 'Likes',
        likesDescription: 'Notificarme cuando alguien le dé like a mis proyectos',
        followers: 'Seguidores',
        followersDescription: 'Notificarme cuando alguien me siga',
        savePreferences: 'Guardar Preferencias'
      },
      privacy: {
        title: 'Configuración de Privacidad',
        profileVisibility: 'Visibilidad del perfil',
        profileVisibilityDescription: 'Controla quién puede ver tu perfil',
        public: 'Público',
        private: 'Privado',
        showEmail: 'Mostrar email',
        showEmailDescription: 'Permite que otros usuarios vean tu email',
        showProjects: 'Mostrar proyectos',
        showProjectsDescription: 'Permite que otros vean tus proyectos',
        allowComments: 'Permitir comentarios',
        allowCommentsDescription: 'Permite que otros comenten en tus proyectos'
      },
      about: {
        title: 'Acerca de ProjectHub',
        version: 'Versión',
        description: 'ProjectHub es una plataforma social para gestionar y compartir proyectos increíbles con la comunidad de desarrolladores.',
        features: 'Características',
        featuresList: {
          projects: 'Gestión de proyectos',
          collaboration: 'Colaboración en equipo',
          community: 'Comunidad activa',
          realtime: 'Actualizaciones en tiempo real'
        },
        links: 'Enlaces',
        documentation: 'Documentación',
        support: 'Soporte',
        github: 'GitHub',
        terms: 'Términos de Uso',
        privacy: 'Política de Privacidad'
      }
    },
    home: {
      hero: {
        title: 'ProjectHub',
        subtitle: 'La red social para gestionar y compartir proyectos increíbles',
        joinNow: 'Únete ahora'
      },
      welcome: '¡Bienvenido',
      welcomeMessage: 'Descubre proyectos increíbles y conecta con desarrolladores talentosos',
      search: {
        placeholder: 'Buscar proyectos, usuarios, tecnologías...',
        button: 'Buscar',
        projects: 'Proyectos',
        users: 'Usuarios'
      },
      createProject: {
        title: '¿Qué proyecto estás construyendo?',
        action: 'Crear Nuevo Proyecto',
        button: '¿En qué estás trabajando?',
        formTitle: 'Crear Nuevo Proyecto',
        formSubtitle: 'Comparte tu idea con la comunidad',
        titleLabel: 'Título del proyecto',
        titlePlaceholder: 'Dale un nombre increíble a tu proyecto...',
        statusLabel: 'Estado del proyecto',
        imageLabel: 'Imagen del proyecto',
        imagePlaceholder: 'https://ejemplo.com/imagen.jpg',
        imagePreview: 'Vista previa:',
        descriptionLabel: 'Descripción',
        descriptionPlaceholder: 'Cuéntanos sobre tu proyecto: objetivos, tecnologías, desafíos, lo que sea que te emocione compartir...',
        charactersCount: '{count}/500 caracteres',
        tagsLabel: 'Tecnologías y etiquetas',
        tagsPlaceholder: 'React, Node.js, TypeScript...',
        tagsSeparator: 'Separadas por comas',
        teamLabel: 'Miembros del equipo',
        teamPlaceholder: 'email1@ejemplo.com, email2@ejemplo.com',
        teamHelper: 'Invita colaboradores (separados por comas)',
        cancel: 'Cancelar',
        create: 'Crear Proyecto',
        creating: 'Creando proyecto...'
      },
      sidebar: {
        myStats: 'Mis Estadísticas',
        inProgress: 'En Progreso',
        noProjects: 'Aún no hay proyectos en progreso',
        viewProject: 'Ver proyecto'
      },
      feed: {
        title: 'Feed de Proyectos',
        all: 'Todos',
        recent: 'Recientes',
        planning: 'Planificando',
        inProgress: 'En Progreso',
        completed: 'Completados'
      },
      trending: {
        title: 'Tendencias',
        tags: 'Etiquetas Populares',
        activeUsers: 'Usuarios Activos',
        projects: 'proyectos'
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
      active: 'Activo',
      team: 'Equipo',
      imagePreview: 'Vista previa',
      imageError: 'No se pudo cargar la imagen',
      required: 'Obligatorio',
      or: 'O',
      more: 'más',
      member: 'Miembro',
      viewProject: 'Ver Proyecto',
      noProjects: 'No hay proyectos',
      beFirst: 'Sé el primero en compartir un proyecto',
      noRecentProjects: 'No hay proyectos recientes',
      dates: {
        yesterday: 'Ayer',
        daysAgo: 'Hace {days} días',
        weeksAgo: 'Hace {weeks} semanas',
        minutesAgo: 'Hace {minutes} min',
        hoursAgo: 'Hace {hours}h'
      }
    },
    keyboardShortcuts: {
      title: 'Atajos de Teclado',
      description: 'Usa estos atajos para navegar más rápido por ProjectHub',
      navigation: 'Navegación',
      actions: 'Acciones',
      settings: 'Configuración',
      tip: 'Consejo',
      tipText: 'Presiona Alt + ? en cualquier momento para ver esta ayuda',
      close: 'Cerrar',
      gotIt: '¡Entendido!',
      shortcuts: {
        home: 'Ir a Inicio',
        about: 'Acerca de ProjectHub',
        news: 'Ver Noticias',
        projects: 'Mis Proyectos',
        loginProfile: 'Login / Perfil',
        register: 'Registrarse',
        logout: 'Cerrar Sesión',
        settings: 'Configuración',
        theme: 'Cambiar Tema',
        language: 'Cambiar Idioma',
        help: 'Mostrar Ayuda'
      }
    },
    footer: {
      title: 'DevConnect Platform',
      description: 'La plataforma líder para desarrolladores que buscan colaborar, compartir proyectos y construir el futuro de la tecnología juntos.',
      support: {
        title: 'Soporte',
        helpCenter: 'Centro de Ayuda',
        contact: 'Contacto',
        liveChat: 'Chat en vivo',
        reportIssue: 'Reportar problema',
        email: 'support@devconnect.com'
      },
      legal: {
        title: 'Legal',
        terms: 'Términos de Uso',
        privacy: 'Política de Privacidad',
        cookies: 'Cookies',
        conduct: 'Código de Conducta',
        licenses: 'Licencias'
      },
      copyright: '© {year} DevConnect Platform. Todos los derechos reservados.',
      madeWith: 'Hecho con ❤️ para la comunidad de desarrolladores'
    },
    termsModal: {
      title: 'Términos de Uso',
      lastUpdated: 'Última actualización: 2 de noviembre de 2025',
      sections: {
        acceptance: {
          title: '1. Aceptación de los Términos',
          content: 'Al acceder y utilizar DevConnect Platform, usted acepta estar sujeto a estos Términos de Uso y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, está prohibido usar o acceder a este sitio.'
        },
        userAccount: {
          title: '2. Cuenta de Usuario',
          content: 'Para utilizar ciertas funciones de la plataforma, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta. Se compromete a notificarnos inmediatamente de cualquier uso no autorizado de su cuenta.'
        },
        content: {
          title: '3. Contenido del Usuario',
          content: 'Usted conserva todos los derechos sobre el contenido que publica en DevConnect. Al publicar contenido, nos otorga una licencia mundial, no exclusiva y libre de regalías para usar, modificar y mostrar dicho contenido en relación con la prestación de nuestros servicios.'
        },
        conduct: {
          title: '4. Código de Conducta',
          content: 'Los usuarios deben comportarse de manera respetuosa y profesional. Está prohibido publicar contenido ofensivo, difamatorio, ilegal o que viole los derechos de terceros. Nos reservamos el derecho de eliminar contenido y suspender cuentas que violen estas políticas.'
        },
        intellectual: {
          title: '5. Propiedad Intelectual',
          content: 'Todo el contenido de la plataforma, incluyendo pero no limitado a textos, gráficos, logotipos, iconos y software, es propiedad de DevConnect Platform o sus licenciantes y está protegido por las leyes de derechos de autor.'
        },
        termination: {
          title: '6. Terminación',
          content: 'Podemos terminar o suspender su acceso a la plataforma inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo sin limitación si incumple los Términos.'
        },
        changes: {
          title: '7. Modificaciones',
          content: 'Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigor los nuevos términos.'
        },
        contact: {
          title: '8. Contacto',
          content: 'Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en legal@devconnect.com'
        }
      }
    },
    privacyModal: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última actualización: 2 de noviembre de 2025',
      sections: {
        intro: {
          title: '1. Introducción',
          content: 'En DevConnect Platform valoramos su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información personal cuando utiliza nuestra plataforma.'
        },
        collection: {
          title: '2. Información que Recopilamos',
          content: 'Recopilamos información que usted nos proporciona directamente (nombre, correo electrónico, información de perfil), información sobre su uso de la plataforma (proyectos visitados, interacciones), e información técnica (dirección IP, tipo de navegador, dispositivo).'
        },
        usage: {
          title: '3. Uso de la Información',
          content: 'Utilizamos su información para: proporcionar y mejorar nuestros servicios, personalizar su experiencia, comunicarnos con usted, garantizar la seguridad de la plataforma, cumplir con obligaciones legales y analizar el uso de la plataforma.'
        },
        sharing: {
          title: '4. Compartir Información',
          content: 'No vendemos su información personal. Podemos compartir su información con proveedores de servicios que nos ayudan a operar la plataforma, cuando sea requerido por ley, o con su consentimiento explícito.'
        },
        security: {
          title: '5. Seguridad',
          content: 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos cifrado SSL/TLS y almacenamiento seguro en Supabase.'
        },
        cookies: {
          title: '6. Cookies y Tecnologías Similares',
          content: 'Utilizamos cookies y tecnologías similares para mejorar su experiencia, recordar sus preferencias y analizar el uso de la plataforma. Puede controlar las cookies a través de la configuración de su navegador.'
        },
        rights: {
          title: '7. Sus Derechos',
          content: 'Tiene derecho a acceder, corregir, eliminar o exportar su información personal. También puede oponerse al procesamiento de sus datos u optar por no recibir comunicaciones de marketing. Contáctenos en privacy@devconnect.com para ejercer estos derechos.'
        },
        children: {
          title: '8. Privacidad de Menores',
          content: 'Nuestra plataforma no está dirigida a menores de 13 años. No recopilamos intencionalmente información personal de niños menores de 13 años.'
        },
        international: {
          title: '9. Transferencias Internacionales',
          content: 'Su información puede ser transferida y mantenida en servidores ubicados fuera de su país de residencia, donde las leyes de protección de datos pueden ser diferentes.'
        },
        changes: {
          title: '10. Cambios a esta Política',
          content: 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios materiales publicando la nueva política en esta página y actualizando la fecha de "última actualización".'
        },
        contact: {
          title: '11. Contacto',
          content: 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos en privacy@devconnect.com o escriba a: DevConnect Platform, Av. Tecnología 123, Ciudad Tech, CP 12345.'
        }
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
    },
    accessibility: {
      title: 'Accesibilidad',
      highContrast: 'Alto Contraste',
      highContrastEnabled: 'Alto contraste activado',
      highContrastDisabled: 'Alto contraste desactivado',
      textToSpeech: 'Lector de Voz',
      textToSpeechEnabled: 'Lector de voz activado',
      textToSpeechDisabled: 'Lector de voz desactivado',
      readPage: 'Leer Página',
      readSelection: 'Leer Selección',
      stop: 'Detener',
      settings: 'Configuración de Voz',
      speed: 'Velocidad',
      pitch: 'Tono',
      volume: 'Volumen',
      notSupported: 'Tu navegador no soporta síntesis de voz'
    },
    news: {
      title: 'Noticias y Novedades',
      subtitle: 'Mantente al día con las últimas actualizaciones y mejoras de DevConnect',
      latestUpdates: 'Últimas Actualizaciones',
      categories: {
        all: 'Todas',
        features: 'Nuevas Funciones',
        improvements: 'Mejoras',
        fixes: 'Correcciones',
        announcements: 'Anuncios'
      },
      readMore: 'Leer más',
      readLess: 'Leer menos',
      postedOn: 'Publicado el',
      noNews: 'No hay noticias disponibles',
      comingSoon: 'Próximamente más actualizaciones'
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
      news: 'News & Updates',
      about: 'About',
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
        success: 'Account created successfully. Please verify your email.',
        acceptTerms: 'I accept the',
        termsOfUse: 'Terms of Use',
        and: 'and the',
        privacyPolicy: 'Privacy Policy',
        welcome: {
          subtitle: 'Join thousands of developers who are already building the future of technology.',
          benefit1Title: 'Collaborate with developers',
          benefit1Desc: 'Connect with talent from around the world',
          benefit2Title: 'Share your projects',
          benefit2Desc: 'Showcase your work and receive feedback',
          benefit3Title: 'Grow professionally',
          benefit3Desc: 'Learn from the best projects',
          minCharacters: 'Minimum 6 characters'
        },
        errors: {
          allFields: 'Please fill in all fields',
          acceptTermsRequired: 'You must accept the terms of use and privacy policy',
          passwordMismatch: 'Passwords do not match',
          passwordLength: 'Password must be at least 6 characters',
          createAccount: 'Error creating account'
        }
      },
      resetPassword: {
        title: 'Reset Password',
        subtitle: 'Enter your new password',
        backToLogin: 'Back to sign in'
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
      loading: 'Loading profile...',
      edit: 'Edit Profile',
      editTitle: 'Edit Profile',
      editSubtitle: 'Update your personal information',
      fullName: 'Full name',
      email: 'Email',
      bio: 'Bio',
      aboutMe: 'About me',
      avatarUrl: 'Avatar URL',
      memberSince: 'Member since',
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      updateSuccess: 'Profile updated successfully',
      updateError: 'Error updating profile',
      placeholders: {
        fullName: 'Your full name...',
        bio: 'Tell us about yourself...',
        avatarUrl: 'https://example.com/avatar.jpg'
      },
      stats: {
        projects: 'Projects',
        likes: 'Likes',
        comments: 'Comments',
        completed: 'Completed',
        projectsCreated: 'Projects Created',
        likesReceived: 'Likes Received',
        totalLikes: 'Across all projects',
        projectsFinished: 'Projects finished'
      },
      recentProjects: 'Recent Projects',
      noProjects: 'No projects yet',
      createFirst: 'Create your first project!',
      quickActions: 'Quick Actions',
      createProject: 'Create Project',
      viewProjects: 'View My Projects',
      settings: 'Settings'
    },
    myProjects: {
      title: 'My Projects',
      subtitle: 'Manage and share your projects with the community',
      newProject: 'New Project',
      stats: {
        total: 'Total',
        completed: 'Completed',
        inProgress: 'In Progress',
        totalLikes: 'Total Likes'
      },
      filters: {
        title: 'Filter and sort:',
        allStatus: 'All statuses',
        searchPlaceholder: 'Search in my projects...',
        sortBy: {
          newest: 'Newest',
          lastUpdate: 'Last updated',
          popular: 'Most popular',
          alphabetic: 'Alphabetic'
        }
      },
      empty: {
        title: 'No projects yet',
        titleFiltered: 'No projects with this status',
        subtitle: 'Create your first project and share it with the community!',
        subtitleFiltered: 'Try another filter',
        action: 'Create My First Project'
      },
      deleteConfirm: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete the project "{title}"? This action cannot be undone.',
        confirm: 'Delete',
        deleting: 'Deleting...'
      }
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize your experience and manage your account',
      tabs: {
        account: 'Account',
        security: 'Security',
        appearance: 'Appearance',
        notifications: 'Notifications',
        privacy: 'Privacy',
        about: 'About'
      },
      account: {
        title: 'Account Information',
        fullName: 'Full name',
        email: 'Email',
        bio: 'Bio',
        avatar: 'Avatar',
        avatarUrl: 'Avatar URL',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        deleteAccount: 'Delete Account',
        deleteAccountWarning: 'This action cannot be undone',
        deleteAccountConfirm: 'Delete my account',
        placeholders: {
          fullName: 'Your full name',
          bio: 'Tell us about yourself...',
          avatarUrl: 'https://example.com/avatar.jpg'
        }
      },
      security: {
        title: 'Change Password',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        changePassword: 'Change Password',
        changing: 'Changing...',
        resetTitle: 'Reset Password',
        resetDescription: 'Send a recovery link to your registered email',
        sendResetLink: 'Send recovery link',
        sending: 'Sending...',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        placeholders: {
          currentPassword: 'Your current password',
          newPassword: 'New password',
          confirmPassword: 'Confirm new password'
        }
      },
      appearance: {
        title: 'Personalization',
        theme: 'Theme',
        themeDescription: 'Choose your preferred theme',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        language: 'Language',
        languageDescription: 'Select your preferred language',
        spanish: 'Español',
        english: 'English'
      },
      notifications: {
        title: 'Notification Preferences',
        email: 'Email Notifications',
        emailDescription: 'Receive updates via email',
        newProjects: 'New projects',
        newProjectsDescription: 'Notify me when new projects are published',
        comments: 'Comments',
        commentsDescription: 'Notify me when someone comments on my projects',
        likes: 'Likes',
        likesDescription: 'Notify me when someone likes my projects',
        followers: 'Followers',
        followersDescription: 'Notify me when someone follows me',
        savePreferences: 'Save Preferences'
      },
      privacy: {
        title: 'Privacy Settings',
        profileVisibility: 'Profile visibility',
        profileVisibilityDescription: 'Control who can see your profile',
        public: 'Public',
        private: 'Private',
        showEmail: 'Show email',
        showEmailDescription: 'Allow other users to see your email',
        showProjects: 'Show projects',
        showProjectsDescription: 'Allow others to see your projects',
        allowComments: 'Allow comments',
        allowCommentsDescription: 'Allow others to comment on your projects'
      },
      about: {
        title: 'About ProjectHub',
        version: 'Version',
        description: 'ProjectHub is a social platform for managing and sharing amazing projects with the developer community.',
        features: 'Features',
        featuresList: {
          projects: 'Project management',
          collaboration: 'Team collaboration',
          community: 'Active community',
          realtime: 'Real-time updates'
        },
        links: 'Links',
        documentation: 'Documentation',
        support: 'Support',
        github: 'GitHub',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy'
      }
    },
    home: {
      hero: {
        title: 'ProjectHub',
        subtitle: 'The social network for managing and sharing amazing projects',
        joinNow: 'Join Now'
      },
      welcome: 'Welcome',
      welcomeMessage: 'Discover amazing projects and connect with talented developers',
      search: {
        placeholder: 'Search projects, users, technologies...',
        button: 'Search',
        projects: 'Projects',
        users: 'Users'
      },
      createProject: {
        title: 'What project are you building?',
        action: 'Create New Project',
        button: 'What are you working on?',
        formTitle: 'Create New Project',
        formSubtitle: 'Share your idea with the community',
        titleLabel: 'Project title',
        titlePlaceholder: 'Give your project an awesome name...',
        statusLabel: 'Project status',
        imageLabel: 'Project image',
        imagePlaceholder: 'https://example.com/image.jpg',
        imagePreview: 'Preview:',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Tell us about your project: goals, technologies, challenges, whatever excites you to share...',
        charactersCount: '{count}/500 characters',
        tagsLabel: 'Technologies and tags',
        tagsPlaceholder: 'React, Node.js, TypeScript...',
        tagsSeparator: 'Comma separated',
        teamLabel: 'Team members',
        teamPlaceholder: 'email1@example.com, email2@example.com',
        teamHelper: 'Invite collaborators (comma separated)',
        cancel: 'Cancel',
        create: 'Create Project',
        creating: 'Creating project...'
      },
      sidebar: {
        myStats: 'My Statistics',
        inProgress: 'In Progress',
        noProjects: 'No projects in progress yet',
        viewProject: 'View project'
      },
      feed: {
        title: 'Project Feed',
        all: 'All',
        recent: 'Recent',
        planning: 'Planning',
        inProgress: 'In Progress',
        completed: 'Completed'
      },
      trending: {
        title: 'Trending',
        tags: 'Popular Tags',
        activeUsers: 'Active Users',
        projects: 'projects'
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
      active: 'Active',
      team: 'Team',
      imagePreview: 'Preview',
      imageError: 'Could not load image',
      required: 'Required',
      or: 'Or',
      more: 'more',
      member: 'Member',
      viewProject: 'View Project',
      noProjects: 'No projects',
      beFirst: 'Be the first to share a project',
      noRecentProjects: 'No recent projects',
      dates: {
        yesterday: 'Yesterday',
        daysAgo: '{days} days ago',
        weeksAgo: '{weeks} weeks ago',
        minutesAgo: '{minutes} min ago',
        hoursAgo: '{hours}h ago'
      }
    },
    keyboardShortcuts: {
      title: 'Keyboard Shortcuts',
      description: 'Use these shortcuts to navigate faster through ProjectHub',
      navigation: 'Navigation',
      actions: 'Actions',
      settings: 'Settings',
      tip: 'Tip',
      tipText: 'Press Alt + ? anytime to see this help',
      close: 'Close',
      gotIt: 'Got it!',
      shortcuts: {
        home: 'Go to Home',
        about: 'About ProjectHub',
        news: 'View News',
        projects: 'My Projects',
        loginProfile: 'Login / Profile',
        register: 'Register',
        logout: 'Logout',
        settings: 'Settings',
        theme: 'Toggle Theme',
        language: 'Toggle Language',
        help: 'Show Help'
      }
    },
    footer: {
      title: 'DevConnect Platform',
      description: 'The leading platform for developers looking to collaborate, share projects and build the future of technology together.',
      support: {
        title: 'Support',
        helpCenter: 'Help Center',
        contact: 'Contact',
        liveChat: 'Live Chat',
        reportIssue: 'Report Issue',
        email: 'support@devconnect.com'
      },
      legal: {
        title: 'Legal',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        cookies: 'Cookies',
        conduct: 'Code of Conduct',
        licenses: 'Licenses'
      },
      copyright: '© {year} DevConnect Platform. All rights reserved.',
      madeWith: 'Made with ❤️ for the developer community'
    },
    termsModal: {
      title: 'Terms of Use',
      lastUpdated: 'Last updated: November 2, 2025',
      sections: {
        acceptance: {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using DevConnect Platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
        },
        userAccount: {
          title: '2. User Account',
          content: 'To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your password and all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.'
        },
        content: {
          title: '3. User Content',
          content: 'You retain all rights to the content you post on DevConnect. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, modify, and display such content in connection with providing our services.'
        },
        conduct: {
          title: '4. Code of Conduct',
          content: 'Users must behave respectfully and professionally. Posting offensive, defamatory, illegal content or content that violates third-party rights is prohibited. We reserve the right to remove content and suspend accounts that violate these policies.'
        },
        intellectual: {
          title: '5. Intellectual Property',
          content: 'All content on the platform, including but not limited to text, graphics, logos, icons, and software, is the property of DevConnect Platform or its licensors and is protected by copyright laws.'
        },
        termination: {
          title: '6. Termination',
          content: 'We may terminate or suspend your access to the platform immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.'
        },
        changes: {
          title: '7. Modifications',
          content: 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.'
        },
        contact: {
          title: '8. Contact',
          content: 'If you have any questions about these Terms, please contact us at legal@devconnect.com'
        }
      }
    },
    privacyModal: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: November 2, 2025',
      sections: {
        intro: {
          title: '1. Introduction',
          content: 'At DevConnect Platform we value your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform.'
        },
        collection: {
          title: '2. Information We Collect',
          content: 'We collect information you provide directly to us (name, email, profile information), information about your use of the platform (projects visited, interactions), and technical information (IP address, browser type, device).'
        },
        usage: {
          title: '3. Use of Information',
          content: 'We use your information to: provide and improve our services, personalize your experience, communicate with you, ensure platform security, comply with legal obligations, and analyze platform usage.'
        },
        sharing: {
          title: '4. Sharing Information',
          content: 'We do not sell your personal information. We may share your information with service providers who help us operate the platform, when required by law, or with your explicit consent.'
        },
        security: {
          title: '5. Security',
          content: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use SSL/TLS encryption and secure storage on Supabase.'
        },
        cookies: {
          title: '6. Cookies and Similar Technologies',
          content: 'We use cookies and similar technologies to improve your experience, remember your preferences, and analyze platform usage. You can control cookies through your browser settings.'
        },
        rights: {
          title: '7. Your Rights',
          content: 'You have the right to access, correct, delete, or export your personal information. You can also object to the processing of your data or opt out of marketing communications. Contact us at privacy@devconnect.com to exercise these rights.'
        },
        children: {
          title: '8. Children\'s Privacy',
          content: 'Our platform is not directed to children under 13. We do not knowingly collect personal information from children under 13.'
        },
        international: {
          title: '9. International Transfers',
          content: 'Your information may be transferred to and maintained on servers located outside your country of residence, where data protection laws may differ.'
        },
        changes: {
          title: '10. Changes to this Policy',
          content: 'We may update this Privacy Policy periodically. We will notify you of material changes by posting the new policy on this page and updating the "last updated" date.'
        },
        contact: {
          title: '11. Contact',
          content: 'If you have questions about this Privacy Policy, contact us at privacy@devconnect.com or write to: DevConnect Platform, Tech Avenue 123, Tech City, ZIP 12345.'
        }
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
    },
    accessibility: {
      title: 'Accessibility',
      highContrast: 'High Contrast',
      highContrastEnabled: 'High contrast enabled',
      highContrastDisabled: 'High contrast disabled',
      textToSpeech: 'Text to Speech',
      textToSpeechEnabled: 'Text to speech enabled',
      textToSpeechDisabled: 'Text to speech disabled',
      readPage: 'Read Page',
      readSelection: 'Read Selection',
      stop: 'Stop',
      settings: 'Voice Settings',
      speed: 'Speed',
      pitch: 'Pitch',
      volume: 'Volume',
      notSupported: 'Your browser does not support speech synthesis'
    },
    news: {
      title: 'News & Updates',
      subtitle: 'Stay up to date with the latest updates and improvements to DevConnect',
      latestUpdates: 'Latest Updates',
      categories: {
        all: 'All',
        features: 'New Features',
        improvements: 'Improvements',
        fixes: 'Bug Fixes',
        announcements: 'Announcements'
      },
      readMore: 'Read more',
      readLess: 'Read less',
      postedOn: 'Posted on',
      noNews: 'No news available',
      comingSoon: 'More updates coming soon'
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
