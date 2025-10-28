# 🚀 ProjectHub - Red Social para Gestión de Proyectos

Una moderna red social construida con Vue 3, Tailwind CSS, DaisyUI y Supabase para compartir y gestionar proyectos colaborativos con soporte completo de internacionalización y temas.

## ✨ Características Principales

- **🔐 Autenticación segura** - Sistema completo de registro e inicio de sesión con Supabase Auth
- **📝 Gestión avanzada de proyectos** - Crear, editar, eliminar y gestionar proyectos con estados
- **🏷️ Sistema de etiquetas** - Organización mediante tags personalizados
- **👥 Equipos colaborativos** - Invitación y gestión de miembros de equipo
- **❤️ Interacciones sociales** - Sistema de likes y comentarios
- **📊 Dashboard personalizado** - Estadísticas y métricas detalladas del usuario
- **🌍 Internacionalización** - Soporte completo para Español e Inglés con Vue I18n
- **🎨 Temas dinámicos** - Cambio entre modo claro, oscuro y automático
- **📱 Diseño responsive** - Interfaz optimizada para todos los dispositivos
- **✅ Validaciones avanzadas** - Sistema de validación en tiempo real para formularios
- **🎯 Iconografía moderna** - Uso de Heroicons para una interfaz consistente
- **⚡ Performance optimizada** - Cargado rápido con Vite y Vue 3 Composition API

## 🛠️ Stack Tecnológico

### Frontend
- **Vue 3** + **TypeScript** - Framework principal con tipado estático
- **Vite** - Build tool ultra-rápido
- **Vue Router 4** - Routing con navigation guards
- **Pinia** - State management reactivo
- **Vue I18n** - Internacionalización completa

### Styling & UI
- **Tailwind CSS 4** - Framework de utilidades CSS
- **DaisyUI** - Componentes de interfaz elegantes
- **Heroicons** - Iconografía SVG optimizada
- **CSS Custom Properties** - Temas dinámicos

### Backend & Services
- **Supabase** - Backend-as-a-Service completo
  - Auth con Row Level Security
  - Base de datos PostgreSQL
  - Real-time subscriptions
  - Storage para archivos

### Herramientas de Desarrollo
- **TypeScript** - Tipado estático
- **ESLint** + **Prettier** - Linting y formateo
- **Vue TSC** - Type checking para Vue

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 20.19.0 o superior
- NPM o Yarn
- Cuenta en Supabase

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd projecthub
npm install
```

### 2. Instalar dependencias adicionales

```bash
# Dependencias principales faltantes
npm install vue-i18n@9 @heroicons/vue @vueuse/core

# Dependencias de desarrollo opcionales
npm install -D @types/node
```

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Configura las variables en `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar Supabase

#### Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén la URL y clave anónima del dashboard

#### Ejecutar script de base de datos
Ejecuta el archivo `supabase-setup.sql` en el SQL Editor de Supabase:

```sql
-- El archivo contiene:
-- ✅ Tablas: profiles, projects, likes, comments, notifications
-- ✅ Funciones: increment/decrement likes
-- ✅ Triggers: auto-create profile, update timestamps
-- ✅ Row Level Security policies
-- ✅ Índices para performance
```

### 5. Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📱 Características de la Interfaz

### 🎨 Componentes UI Reutilizables
- **BaseInput** - Input con validación, iconos y estados
- **BaseTextarea** - Textarea con contador de caracteres
- **BaseSelect** - Select con opciones tipadas
- **BaseButton** - Botón con variantes, tamaños e iconos
- **NavBar** - Navegación responsiva con menús dropdown

### 🌍 Internacionalización (i18n)
```javascript
// Cambio de idioma programático
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()

// En template
{{ $t('nav.home') }}    // "Inicio" / "Home"
{{ $t('auth.login.title') }}  // "Iniciar Sesión" / "Sign In"
```

### 🎭 Sistema de Temas
```javascript
// Control de temas
import { useUIStore } from '@/stores/ui'
const uiStore = useUIStore()

// Cambiar tema
uiStore.setTheme('dark')    // 'light' | 'dark' | 'auto'
```

### ✅ Validación de Formularios
```javascript
import { useFormValidation, validationRules } from '@/composables/useValidation'

const rules = {
  email: [
    validationRules.required(),
    validationRules.email()
  ],
  password: [
    validationRules.required(),
    validationRules.minLength(8)
  ]
}

const { errors, isValid, validate } = useFormValidation(rules)
```

## 📂 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de interfaz
│   │   ├── BaseInput.vue
│   │   ├── BaseButton.vue
│   │   └── ...
│   ├── NavBar.vue       # Navegación principal
│   ├── ProjectCard.vue  # Tarjeta de proyecto
│   └── CreateProjectModal.vue
├── views/               # Páginas principales
│   ├── HomeView.vue     # Feed principal
│   ├── LoginView.vue    # Autenticación
│   ├── ProfileView.vue  # Perfil de usuario
│   └── MyProjectsView.vue
├── stores/              # Estado global con Pinia
│   ├── auth.ts         # Autenticación
│   ├── projects.ts     # Gestión de proyectos
│   └── ui.ts           # Estado de UI y temas
├── composables/         # Lógica reutilizable
│   └── useValidation.ts # Sistema de validación
├── i18n/               # Internacionalización
│   └── index.ts        # Configuración y traducciones
├── lib/                # Configuraciones externas
│   └── supabase.ts     # Cliente de Supabase
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces del dominio
└── assets/             # Recursos estáticos
    └── main.css        # Estilos globales
```

## 🔧 Funcionalidades Detalladas

### Autenticación
- Registro con validación de email
- Login con remember me
- Logout con limpieza de estado
- Creación automática de perfil
- Guards de navegación

### Gestión de Proyectos
- CRUD completo de proyectos
- Estados: Planificando, En Progreso, Completado, En Pausa
- Subida de imágenes (URL)
- Tags dinámicos
- Invitación de miembros por email
- Sistema de likes y comentarios

### Perfil de Usuario
- Edición de información personal
- Avatar personalizable
- Estadísticas de proyectos
- Historial de actividad

### Interfaz y UX
- Diseño mobile-first
- Transiciones suaves
- Loading states
- Estados de error
- Formularios con validación en tiempo real
- Feedback visual inmediato

## 🌐 Internacionalización

### Idiomas Soportados
- **Español (es)** - Idioma por defecto
- **English (en)** - Inglés completo

### Agregar Nuevo Idioma
1. Actualiza `src/i18n/index.ts`
2. Añade las traducciones al objeto `messages`
3. Actualiza el tipo `Language` en `src/stores/ui.ts`

## 🎨 Personalización de Temas

### Temas Disponibles
- **Light** - Tema claro por defecto
- **Dark** - Tema oscuro
- **Auto** - Sigue las preferencias del sistema

### Añadir Tema Personalizado
1. Actualiza `tailwind.config.js` con nuevos temas de DaisyUI
2. Modifica `useUIStore` para incluir el nuevo tema

## 📊 Base de Datos

### Estructura de Tablas
- **profiles** - Perfiles de usuario extendidos
- **projects** - Proyectos con metadatos
- **likes** - Sistema de reacciones
- **comments** - Comentarios en proyectos
- **notifications** - Sistema de notificaciones

### Seguridad
- Row Level Security (RLS) habilitado
- Políticas granulares por tabla
- Validación de permisos en tiempo real

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno para Producción
```env
VITE_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_de_produccion
```

### Plataformas Recomendadas
- **Vercel** - Deploy automático desde Git
- **Netlify** - Hosting con formularios
- **Firebase Hosting** - Google Cloud integration

## 🤝 Contribución

### Setup de Desarrollo
1. Fork el repositorio
2. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Instala dependencias: `npm install`
4. Configura variables de entorno
5. Ejecuta tests: `npm test` (cuando estén disponibles)

### Estándares de Código
- **TypeScript** obligatorio para nuevas funcionalidades
- **Composition API** para todos los componentes Vue
- **Props/Emits** tipados con interfaces
- **Comentarios JSDoc** para funciones complejas

### Pull Request Process
1. Actualiza README si añades funcionalidades
2. Asegúrate que pase el linting: `npm run lint`
3. Verifica el type checking: `npm run type-check`
4. Actualiza traducciones en ambos idiomas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

#### Error de Supabase Connection
```bash
# Verifica las variables de entorno
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### Error de Compilación TypeScript
```bash
# Limpia y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Problemas con i18n
```bash
# Verifica que vue-i18n esté instalado
npm list vue-i18n
```

### Contacto
- 📧 Email: soporte@projecthub.com
- 💬 Discord: ProjectHub Community
- 🐛 Issues: GitHub Issues

---

**Desarrollado con ❤️ usando Vue 3, TypeScript, Tailwind CSS y Supabase**

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
