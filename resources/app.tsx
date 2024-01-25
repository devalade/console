import './css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React from 'react'

createInertiaApp({
  resolve: (name) => {
    const [firstPart, ...rest] = name.split('/')
    const pages = import.meta.glob('./**/pages/*.tsx', { eager: true })
    return pages[`./concerns/${firstPart}/pages/${rest.join('/')}.tsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
