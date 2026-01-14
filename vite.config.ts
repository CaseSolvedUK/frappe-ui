import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { lucideIcons } from './vite/lucideIcons'
import { visualizer } from 'rollup-plugin-visualizer'

const buildApp = process.env.BUILD_APP === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  root: buildApp ? path.resolve(__dirname, 'demo') : process.cwd(),
  plugins: [
    vue(),
    lucideIcons(),
    visualizer({
      open: false,
      template: 'raw-data',
      filename: 'dist/stats.json',
      //template: 'flamegraph',
      //filename: 'dist/stats.html',
    }),
  ],
  resolve: {
    alias: {
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: ['tailwind.config.js'],
  },
  build: buildApp
    ? {
        outDir: 'dist', // inside root: demo
        rollupOptions: {
          input: path.resolve(__dirname, 'demo/main.js'),
        },
      }
    : {
        lib: {
          entry: {
            index:  'src/index.ts',
            frappe: 'frappe/index.js',
            plugin: 'src/plugin.ts',
            resources: 'src/resources/index.js',
            'text-editor': 'src/text-editor.ts',
            vite: 'vite/index.js',
          },
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
          output: {
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            globals: {
              vue: 'Vue',
              echarts: 'echarts',
            },
            assetFileNames: (assetInfo) =>
              assetInfo.name === 'style.css' ? 'frappe-ui.min.css' : assetInfo.name,
          },
        },
        cssCodeSplit: false,
        outDir: 'dist',
        minify: 'terser',
        emptyOutDir: true,
      }
})
