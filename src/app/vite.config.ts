import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  // resolve: {
  //   alias: {
  //     '~': path.resolve(__dirname, 'src'),
  //   },
  // },
  plugins: [
    react(),
    stdLibBrowser(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      util: 'node-stdlib-browser/util',
      sys: 'node-stdlib-browser/util',
      events: 'node-stdlib-browser/events',
      stream: 'node-stdlib-browser/stream',
      path: 'node-stdlib-browser/path',
      querystring: 'node-stdlib-browser/querystring',
      punycode: 'node-stdlib-browser/punycode',
      url: 'node-stdlib-browser/url',
      string_decoder: 'node-stdlib-browser/string_decoder',
      http: 'node-stdlib-browser/http',
      https: 'node-stdlib-browser/https',
      os: 'node-stdlib-browser/os',
      assert: 'node-stdlib-browser/assert',
      constants: 'node-stdlib-browser/constants',
      _stream_duplex: 'node-stdlib-browser/_stream_duplex',
      _stream_passthrough: 'node-stdlib-browser/_stream_passthrough',
      _stream_readable: 'node-stdlib-browser/_stream_readable',
      _stream_writable: 'node-stdlib-browser/_stream_writable',
      _stream_transform: 'node-stdlib-browser/_stream_transform',
      timers: 'node-stdlib-browser/timers',
      console: 'node-stdlib-browser/console',
      vm: 'node-stdlib-browser/vm',
      zlib: 'node-stdlib-browser/zlib',
      tty: 'node-stdlib-browser/tty',
      domain: 'node-stdlib-browser/domain',
      crypto: 'node-stdlib-browser/crypto',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
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
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});
