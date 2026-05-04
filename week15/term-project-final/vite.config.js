/*
Name: Kendall Beam
Assignment: Term Project 3
Description: set proxies for vite to call local routes
Filename: vite config.js
Date: May 3 2026
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

