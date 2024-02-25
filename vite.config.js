import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      external: ["web3"], // Add 'web3' to the list of external dependencies
    },
  },
});
