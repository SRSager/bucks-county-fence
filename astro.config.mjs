// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwind()],
  },
  adapter: netlify(),
  integrations: [
    svelte(),
    mdx(),
    sitemap(),
    icon({
      include: {
        lucide: ['home', 'menu', 'x', 'phone', 'mail', 'map-pin', 'clock', 'star', 'shield-check', 'award', 'heart', 'check', 'arrow-right', 'facebook', 'grid', 'navigation', 'quote', 'image', 'search', 'users', 'map', 'external-link', 'hard-hat', 'arrow-up-right', 'chevron-down', 'help-circle', 'thumbs-up', 'globe', 'fence', 'message-circle', 'message-square-quote'],
        mdi: ['facebook', 'instagram', 'yelp', 'star'],
        mdi: ['facebook', 'instagram', 'yelp'],
      }
    })
  ]
});