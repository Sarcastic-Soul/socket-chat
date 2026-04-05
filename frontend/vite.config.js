import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
                    icons: ['react-icons'],
                    ui: ['emoji-picker-react'],
                    socket: ['socket.io-client']
                }
            },
        },
    },
});