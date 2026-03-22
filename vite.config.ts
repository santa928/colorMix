import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.VITE_BASE_PATH ?? (repoName ? `/${repoName}/` : '/');

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
