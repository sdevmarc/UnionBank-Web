import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // host: '192.168.10.14',
        // port: '80'
        // host: '192.168.68.112',
        // port: '80'
        // host: 'localhost',
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
