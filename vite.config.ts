import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const securityHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: securityHeaders,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  preview: {
    headers: securityHeaders
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
