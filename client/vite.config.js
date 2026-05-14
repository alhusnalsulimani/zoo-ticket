import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', //simulates a browser DOM inside Node.js
    setupFiles: './src/setupTests.js',
    assets: ['**/*.{jpg,jpeg,png,gif,svg}'], // ← handles image imports
  }

})
