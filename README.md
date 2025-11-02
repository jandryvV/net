# Red Social - Proyecto Web

Este proyecto es una red social desarrollada con Vue 3, Vite y TypeScript. Permite a los usuarios registrarse, iniciar sesión, crear y gestionar proyectos, así como interactuar con diferentes funcionalidades sociales.

## Tecnologías principales

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Backend as a Service)
- [Pinia](https://pinia.vuejs.org/) (Gestión de estado)
- [Vue Router](https://router.vuejs.org/)

## Estructura del proyecto

```
net/
├── public/                  # Archivos públicos y estáticos
├── scripts/                 # Scripts de base de datos (ej: supabase-setup.sql)
├── src/
│   ├── assets/              # Archivos estáticos y CSS
│   ├── components/          # Componentes Vue reutilizables
│   ├── composables/         # Funciones reutilizables (composables)
│   ├── i18n/                # Internacionalización
│   ├── icons/               # Iconos personalizados
│   ├── lib/                 # Librerías y utilidades (ej: supabase)
│   ├── router/              # Configuración de rutas
│   ├── stores/              # Pinia stores (auth, projects, ui)
│   ├── types/               # Definiciones de tipos TypeScript
│   └── views/               # Vistas principales de la aplicación
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
└── ...otros archivos de configuración
```

## Instalación y uso

1. **Clona el repositorio:**
	```sh
	git clone <url-del-repositorio>
	cd net
	```

2. **Instala las dependencias:**
	```sh
	npm install
	```

3. **Configura las variables de entorno:**
	- Renombra `.env.example` a `.env` y completa los valores necesarios (por ejemplo, claves de Supabase).

4. **Ejecuta el proyecto en desarrollo:**
	```sh
	npm run dev
	```
	La aplicación estará disponible en `http://localhost:5173` (o el puerto configurado).

## Scripts útiles

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Genera la build de producción
- `npm run lint` — Ejecuta el linter

## Estructura de carpetas clave

- `src/components/` — Componentes reutilizables y UI
- `src/views/` — Vistas principales (Home, Login, Registro, Perfil, etc.)
- `src/stores/` — Gestión de estado con Pinia
- `src/lib/supabase.ts` — Configuración de Supabase

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
