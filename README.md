# Permata Mall

Live storefront at [permatamall.shop](https://permatamall.shop) — one install of [AdsBookCMS](https://github.com/ongkipro/adsbookcms), a self-contained direct-response commerce CMS on Cloudflare Workers. Storefront, landing pages, checkout (COD + AutoLaris QRIS/VA), order and shipping management, Meta/Google ad-signal tracking, and an admin dashboard — one Worker, one D1 database, one store.

## Stack

Astro 7 (SSR) · React 19 · Cloudflare Workers + D1 + KV + R2 · Tailwind CSS v4 + shadcn/ui

## Local development

```bash
npm ci
npm run db:migrate:local   # apply migrations to a local D1
npm run cf:dev             # wrangler dev --local — closest to production
```

`npm run dev` is faster for pure UI work but runs without Worker bindings (D1/KV/R2), so anything touching data needs `cf:dev`.

## Commands

```bash
npm test               # node --test over src/lib/*.test.ts
npm run check           # astro check && tsc --noEmit
npm run build            # astro build
npm run deploy           # wrangler deploy — production
```

## Docs

This repo carries the product's own documentation conventions — `AGENTS.md` §2 says which file is authoritative for what. Store-specific state: `STATUS.md` (current), `TASKS.md` (backlog), `BUILD-LOG.md` (history).
