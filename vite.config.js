import { defineConfig } from 'vite';

export default defineConfig({
  base: '/clinica-aurora-landing/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/structural.spec.js'],
  },
});
