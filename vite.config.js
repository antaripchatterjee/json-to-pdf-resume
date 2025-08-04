import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        theme: {
          extend: {
            colors: {
              themeBlue: '#102fdd',
            },
            animation: {
              'spin-slow': 'spin 2s linear infinite',
              'spin-normal': 'spin 1s linear infinite',
              'spin-fast': 'spin 0.5s linear infinite',
            }
          },
        },
      },
    }),
  ],
})
