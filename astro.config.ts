import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig, envField, passthroughImageService } from 'astro/config';

export default defineConfig({
  ...(process.env.SITE_URL !== undefined ? { site: process.env.SITE_URL } : {}),

  integrations: [preact(), icon()],

  image: {
    service: passthroughImageService(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  output: 'server',

  env: {
    schema: {
      GROQ_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      EMBEDDING_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMBEDDING_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMBEDDING_API_MODEL: envField.string({ context: 'server', access: 'secret', optional: true }),
      MILVUS_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      MILVUS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      MILVUS_COLLECTION_NAME: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  adapter: vercel(),

  devToolbar: { enabled: false },
});
