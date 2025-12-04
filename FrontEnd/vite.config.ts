import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
    port: 3000,
    open: true, 
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
});
