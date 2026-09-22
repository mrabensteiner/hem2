import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process';
import pkg from '../package.json' assert { type: 'json' };

let commit: any = {};
let version = pkg.version;
let repository = pkg.repository.replace(/^git\+/, '');

try {
  commit.hash = execSync('git log -1 --format=%h').toString().trim();
  commit.timestamp = execSync('git log -1 --format=%cI').toString().trim();
} catch (e) {
  console.log(e);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __COMMIT__: JSON.stringify(commit),
    __VERSION__: JSON.stringify(version),
    __REPOSITORY__: JSON.stringify(repository)
  }
})
