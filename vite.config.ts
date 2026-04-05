import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/drank.wtf/',
    plugins: [react()],
    server: {
        port: Number(process.env.WEB_PORT ?? 5173),
    },
});
