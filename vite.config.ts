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
        manualChunks(id) {
          if (id.includes('node_modules/react') && !id.includes('react-dom')) return 'react-vendor';
          if (id.includes('node_modules/recharts')) return 'recharts';
          if (id.includes('node_modules/d3-')) return 'd3';
          if (id.includes('node_modules/lodash')) return 'lodash';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/zod')) return 'zod';
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts']
  }
});
