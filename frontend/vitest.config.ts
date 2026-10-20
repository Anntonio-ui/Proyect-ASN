import { defineConfig } from 'vitest/config'

// Configuración aparte de vite.config.ts para no tocar la del proyecto.
export default defineConfig({
  test: {
    environment: 'jsdom',
    // Dirección ficticia solo para pruebas: ninguna prueba llama a la API real.
    env: { VITE_API_BASE_URL: 'http://localhost:7071/api' },
  },
})
