import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import { resolve } from 'node:path'
import { getDirname } from '@adonisjs/core/helpers'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/app.tsx'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/**/*.{edge,tsx,ts}'],

    }),
  ],
  resolve: {
    alias: {
      '@/': `${resolve(getDirname(import.meta.url), 'resources')}/`,
      '~/': `${resolve(getDirname(import.meta.url), '.')}/`,
    },
  },
})
