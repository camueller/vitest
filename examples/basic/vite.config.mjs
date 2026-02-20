import path from "node:path";
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  build: {
    emptyOutDir: true,
  }
}));
