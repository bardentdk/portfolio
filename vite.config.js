import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Code splitting fonctionnel avec Vite 8 / rolldown
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-'))
              return 'vendor-charts';
            if (id.includes('framer-motion'))
              return 'vendor-motion';
            if (id.includes('@supabase') || id.includes('@tanstack'))
              return 'vendor-data';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/'))
              return 'vendor-react';
            if (id.includes('lenis'))
              return 'vendor-scroll';
            if (id.includes('lucide'))
              return 'vendor-icons';
            return 'vendor-misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react',
      'lenis',
    ],
  },

  envPrefix: 'VITE_',

  server: {
    port: 5173,
    open: false,
  },

  preview: {
    port: 4173,
  },
});