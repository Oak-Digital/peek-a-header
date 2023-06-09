import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'demo-dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demo: resolve(__dirname, 'demo', 'index.html'),
                'sticky-extra': resolve(__dirname, 'demo', 'sticky-extra', 'index.html'),
                'show-hide': resolve(__dirname, 'demo', 'show-hide', 'index.html'),
                'auto-snap': resolve(__dirname, 'demo', 'auto-snap', 'index.html'),
                'locking': resolve(__dirname, 'demo', 'locking', 'index.html'),
                'snap-wheel': resolve(__dirname, 'demo', 'snap-wheel', 'index.html'),
            },
        },
    },
});
