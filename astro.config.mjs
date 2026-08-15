import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  server: {
    port: 4321,
    host: true,
  },
  adapter: cloudflare({
    configPath: process.env.CMSADS_TENANT_CONFIG,
    inspectorPort: process.env.CMSADS_INSPECTOR_PORT
      ? Number(process.env.CMSADS_INSPECTOR_PORT)
      : undefined,
    imageService: 'passthrough',
    sessionKVBindingName: 'SESSION',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: [
        'astro',
        '@astrojs/cloudflare',
        'astro-seo',
      ],
    },
    server: {
      host: true,
      watch: {
        ignored: ['**/.wrangler/**'],
      },
    },
  },
});
