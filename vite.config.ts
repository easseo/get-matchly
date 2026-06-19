import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime",
      "@tanstack/react-query", "@tanstack/query-core",
    ],
  },
  build: {
    // Warn only above 400KB (per chunk)
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks: {
          // UI framework — loaded once, cached long-term
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-query":  ["@tanstack/react-query"],
          "vendor-ui":     ["@radix-ui/react-dialog", "@radix-ui/react-select",
                            "@radix-ui/react-popover", "@radix-ui/react-tooltip",
                            "@radix-ui/react-dropdown-menu", "@radix-ui/react-tabs"],
          "vendor-motion": ["framer-motion"],
          "vendor-forms":  ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-date":   ["date-fns"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
}));
