// @ts-check
import { defineConfig, envField } from 'astro/config';

import preact from '@astrojs/preact';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), icon()],

  vite: {
    plugins: [tailwindcss()]
  },

  output: 'server',

  env: {
    schema: {
      GROQ_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      EMBEDDING_PROVIDER: envField.enum({
        context: 'server',
        access: 'secret',
        values: ['local', 'remote'],
        optional: true,
      }),
      EMBEDDING_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMBEDDING_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMBEDDING_API_MODEL: envField.string({ context: 'server', access: 'secret', optional: true }),
      MILVUS_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  adapter: vercel(),

  devToolbar: { enabled: false },
});