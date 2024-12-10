import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"

export default defineConfig({
    plugins: [react({
        jsxRuntime: 'automatic',
        fastRefresh: true
    })],
    build: {
        outDir: 'dist', // Default output directory
        // sourcemap: true, // Ensure sourcemaps are generated
        sourcemap: process.env.NODE_ENV !== 'production', // Disable sourcemaps in production
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
