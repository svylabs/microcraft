import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      //Node.js built-in modules
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url'
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Example for React
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Optional: Adjust the warning threshold
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 5173,
    },
    port: 5173, 
    watch: {
      usePolling: true,
    },
  },
});
