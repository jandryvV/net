import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useUIStore } from './stores/ui'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Sincronizar el idioma guardado en localStorage con vue-i18n
const uiStore = useUIStore()
i18n.global.locale.value = uiStore.language

app.mount('#app')
