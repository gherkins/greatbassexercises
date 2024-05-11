import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://datenkatze.de/greatbassexercises',
  base: '/greatbassexercises',
  integrations: [react(), mdx(), sitemap()],
})
