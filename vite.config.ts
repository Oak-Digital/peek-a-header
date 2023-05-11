import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    /* root: 'demo', */
    build: {
        outDir: 'demo-dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demo: resolve(__dirname, 'demo', 'index.html'),
                'sticky-extra': resolve(__dirname, 'demo', 'sticky-extra', 'index.html'),
                'show-hide': resolve(__dirname, 'demo', 'show-hide', 'index.html'),
            }
        },
    },
})
