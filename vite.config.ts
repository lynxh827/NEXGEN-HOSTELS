
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // This allows connections from all IPs, not just localhost
    port: 8080,
    strictPort: true, // This ensures Vite will only use port 8080
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add base path configuration for production
  base: '/',
  // Optimize build output
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'esnext'
  }
}));
