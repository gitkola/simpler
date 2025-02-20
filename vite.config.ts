import { defineConfig } from "vite";
import { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"

function markdownRawPlugin(): Plugin {
  return {
    name: "vite-plugin-markdown-raw",
    transform(code, id) {
      if (id.endsWith(".md")) {
        const json = JSON.stringify(code);
        return { code: `export default ${json};`, map: null };
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), markdownRawPlugin()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1430,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
