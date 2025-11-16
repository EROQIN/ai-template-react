// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // 导入

export default defineConfig({
  plugins: [react(), tsconfigPaths()], // 使用插件
});