// vite.config.ts
import { defineConfig } from "file:///Users/sg/Documents/workspace/svylabs/handycraft/src/microcraft/microcraft-lite/node_modules/vite/dist/node/index.js";
import react from "file:///Users/sg/Documents/workspace/svylabs/handycraft/src/microcraft/microcraft-lite/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/sg/Documents/workspace/svylabs/handycraft/src/microcraft/microcraft-lite";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "src"),
      //Node.js built-in modules
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify",
      url: "url"
    }
  },
  optimizeDeps: {
    include: ["buffer"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"]
          // Example for React
        }
      }
    },
    chunkSizeWarningLimit: 1500
    // Optional: Adjust the warning threshold
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 5173
    },
    port: 5173,
    watch: {
      usePolling: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2cvRG9jdW1lbnRzL3dvcmtzcGFjZS9zdnlsYWJzL2hhbmR5Y3JhZnQvc3JjL21pY3JvY3JhZnQvbWljcm9jcmFmdC1saXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2cvRG9jdW1lbnRzL3dvcmtzcGFjZS9zdnlsYWJzL2hhbmR5Y3JhZnQvc3JjL21pY3JvY3JhZnQvbWljcm9jcmFmdC1saXRlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zZy9Eb2N1bWVudHMvd29ya3NwYWNlL3N2eWxhYnMvaGFuZHljcmFmdC9zcmMvbWljcm9jcmFmdC9taWNyb2NyYWZ0LWxpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgIC8vTm9kZS5qcyBidWlsdC1pbiBtb2R1bGVzXG4gICAgICBjcnlwdG86ICdjcnlwdG8tYnJvd3NlcmlmeScsXG4gICAgICBzdHJlYW06ICdzdHJlYW0tYnJvd3NlcmlmeScsXG4gICAgICBhc3NlcnQ6ICdhc3NlcnQnLFxuICAgICAgaHR0cDogJ3N0cmVhbS1odHRwJyxcbiAgICAgIGh0dHBzOiAnaHR0cHMtYnJvd3NlcmlmeScsXG4gICAgICBvczogJ29zLWJyb3dzZXJpZnknLFxuICAgICAgdXJsOiAndXJsJ1xuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnYnVmZmVyJ10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSwgLy8gRXhhbXBsZSBmb3IgUmVhY3RcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDE1MDAsIC8vIE9wdGlvbmFsOiBBZGp1c3QgdGhlIHdhcm5pbmcgdGhyZXNob2xkXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIGhtcjoge1xuICAgICAgY2xpZW50UG9ydDogNTE3MyxcbiAgICB9LFxuICAgIHBvcnQ6IDUxNzMsIFxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1osU0FBUyxvQkFBb0I7QUFDNWIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBO0FBQUEsTUFFbEMsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osS0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsUUFBUTtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUE7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
