import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Replace 'YOUR_REPO_NAME' with your GitHub repo name
const repoName = "/luvix-smooth-start/";

export default defineConfig(({ mode }) => ({
  base: repoName, // ✅ ensures correct asset paths on GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
