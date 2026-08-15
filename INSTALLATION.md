# CMSAds Installation and Tenant Onboarding

This document owns the portable installation path for maintainers and AI coding agents. It distinguishes local repository bootstrap, Cloudflare resource provisioning, storefront creation, data onboarding, and deployment. These are separate operations with separate evidence and approval boundaries.

## 1. Installation Outcomes

CMSAds supports two runtime shapes:

| Shape | Public owner | CMSAds ingress | Use when |
| --- | --- | --- | --- |
| Integrated | CMSAds Worker | `custom-domain` | One Worker renders storefront, forms, admin, and API. |
| Headless | Separate storefront Worker | `service-only` | The tenant needs a fully custom frontend while CMSAds remains the private commerce and operations backend. |

No active headless reference deployment is registered. Treat the headless shape as a supported architecture that still requires a separately reviewed storefront Worker, private `CMSADS` service binding, route contract, and independent deployment proof.

## 2. Non-Negotiable Isolation

A new tenant receives:

- one independently named CMSAds Worker;
- one D1 database for that tenant's catalog, orders, payments, shipping, ads configuration, access, and runtime content;
- one KV namespace for sessions and quotas;
- one R2 bucket for tenant media;
- one Workers AI binding;
- tenant-specific provider credentials and Cloudflare secrets;
- one explicit ingress mode.

Provisioning applies the repository schema and bootstraps only the new store row, one forced-rotation owner credential, and the canonical immutable sample described below. It does not copy content, media, customer records, orders, payment records, provider configuration, tracking credentials, sessions, secrets, or merchant products from Petani Sejahtera or another tenant.

The exact sample is product ID `10001`, slug `aussie`, and title `Aussie Sample`, with:

- variant `20001`: `500ml`, Rp150,000, `600g`;
- variant `20002`: `1 Liter`, Rp300,000, `1100g`.

The sample is an installer-owned invariant for exercising forms before merchant onboarding. Admin and API mutations reject attempts to edit or delete it; local UI/API proof observed `409` for mutation attempts. It is not merchant catalog content and must not be relabeled or copied into a storefront.

`PUBLIC_CONTENT_PACK=runtime-managed` is mandatory for a new merchant. Missing content fails closed; it must never fall back to Petani Sejahtera copy or assets.

## 3. Local Repository Bootstrap

Requirements:

- Node.js 22 or newer;
- npm 10 or newer;
- a POSIX shell;
- Git access to this private repository.

Run from the repository root:

```bash
./scripts/install.sh
```

The script:

1. verifies Node and npm;
2. runs the lockfile-pinned `npm ci`;
3. validates the committed tenant registry;
4. generates Cloudflare types from `petanisejahtera-preview`, or from `CMSADS_DEFAULT_TENANT` when explicitly set;
5. runs Astro and TypeScript checks.

It does not authenticate a Cloudflare account, create remote resources, migrate D1, deploy a Worker, configure DNS, set secrets, or import merchant data.

For a different registered development profile:

```bash
CMSADS_DEFAULT_TENANT=<registered-tenant> ./scripts/install.sh
```

The selected profile must already exist in `wrangler.jsonc`.

## 4. New Cloudflare Account Preparation

A repository copy does not grant access to the current operator's Cloudflare resources. D1, KV, R2, Workers, Custom Domains, service bindings, and secrets are account-scoped.

Before remote work:

1. authenticate Wrangler to the intended Cloudflare account through the operator-approved method;
2. confirm the account identity with `npx wrangler whoami` without printing tokens;
3. choose a globally unique tenant slug, Worker name, domain, D1 name, KV name, and R2 bucket name;
4. decide `custom-domain` versus `service-only` before provisioning;
5. review which committed registry environments belong to the new account.

A separately operated fleet should retain only environments owned by that fleet. Do not reuse another account's resource IDs, deploy its tenant names as placeholders, or treat a committed ID as proof that the resource exists in the current account.

## 5. No-Side-Effect Tenant Plan

Integrated tenant:

```bash
npm run tenant:install -- --plan \
  --slug merchant-b \
  --domain shop.example.com \
  --name "Merchant B" \
  --owner-name "Merchant Owner" \
  --owner-email owner@example.com \
  --template wide-catalog \
  --ingress custom-domain
```

Headless tenant:

```bash
npm run tenant:install -- --plan \
  --slug merchant-b \
  --domain shop.example.com \
  --name "Merchant B" \
  --owner-name "Merchant Owner" \
  --owner-email owner@example.com \
  --template compact-market \
  --ingress service-only
```

The plan prints:

- exact Worker and resource names;
- ingress mode and canonical domain;
- `runtime-managed` content ownership;
- the canonical immutable sample contract;
- `importsExistingTenantData: false`;
- whether deployment was requested.

A plan does not change the registry or Cloudflare.

## 6. Remote Provisioning

Remote provisioning is a production mutation. It requires explicit approval naming the tenant and account. After approval:

```bash
npm run tenant:install -- --yes \
  --slug merchant-b \
  --domain shop.example.com \
  --name "Merchant B" \
  --owner-name "Merchant Owner" \
  --owner-email owner@example.com \
  --template wide-catalog \
  --ingress custom-domain
```

Without `--publish`, the installer:

1. writes the new environment into `wrangler.jsonc`;
2. creates isolated KV, D1, and R2 resources;
3. validates the generated tenant contract;
4. applies repository migrations to that new D1;
5. creates one owner credential with a temporary password and forced first-login rotation;
6. inserts and verifies only product `10001` and variants `20001`/`20002` as the immutable canonical sample;
7. stops before deployment.

The temporary password is shown once. Do not copy it into Git, documentation, prompts, screenshots, logs, or project memory.

`--publish` is an additional deployment request. Use it only when the same conversation explicitly approves provisioning and deployment. Prefer provisioning first, validating the generated tenant, then obtaining a separate deployment approval.

## 7. Headless Storefront Setup

A `service-only` CMSAds Worker is intentionally unreachable from the public Internet. Before the tenant can use it:

1. create a separate storefront repository and Worker;
2. attach the tenant's exact domain to the storefront Worker;
3. add a reviewed private service binding pointing to `cmsads-<tenant>`; use the name `CMSADS` only when that is the storefront's committed convention;
4. route only reviewed CMSAds path families through that binding;
5. keep public catalog and marketing routes inside the storefront Worker;
6. validate same-origin API behavior and the protected admin boundary;
7. deploy storefront and backend independently.

Canonical operational gateway paths are `/admin`, `/api`, `/hello`, `/thanks`, `/hybrid-form`, `/middle-form`, and `/full-form`. The clean route cutover has no `/form-hybrid`, `/form-middle`, or `/form-full` aliases. Local route proof is not proof that a separately owned storefront gateway was deployed or accepted by Cloudflare.

See [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) for the frontend, form, province-policy, and Meta Ads contract.

## 8. Merchant Data and Content Onboarding

Provisioning starts with only the protected canonical sample as commerce data. Complete onboarding per tenant:

1. replace the temporary owner credential at `/hello`;
2. configure store identity and support contact;
3. review the store-level `cod_disabled_province_codes` policy separately from courier/provider exclusions;
4. configure one warehouse and precise Mengantar origin;
5. create merchant products and variants through Product Management without modifying or deleting the canonical sample;
6. upload merchant-owned media to that tenant's R2;
7. configure courier and COD eligibility;
8. set provider keys through approved secret or masked dashboard paths;
9. configure Meta Pixel/CAPI and Google identifiers in Ads & Tracking;
10. store tenant-specific, non-secret AI instructions;
11. generate or save drafts, review factual claims, and publish explicitly;
12. integrate the storefront against canonical product, form, tracking, and order contracts;
13. verify the selected tenant locally before any release.

Never seed production claims, testimonials, customer data, credentials, orders, payment records, or another merchant's media from repository fixtures. The immutable sample is a system verification fixture, not publishable merchant content.

## 9. Release Gates

CMSAds backend:

```bash
npm test
npm run check
npm run tenant:validate
npm run tenant:build -- <tenant>
npm run tenant:dry-run -- <tenant>
```

Storefront frontend:

- run that repository's own tests, static checks, build, and Wrangler dry-run;
- exercise the affected public journey at desktop and mobile widths;
- verify the gateway route matrix;
- verify Meta browser events without exposing server credentials;
- verify the form and order flow without provider mutation unless separately approved.

Remote D1 migration and Worker deployment are separate approvals:

```bash
CF_D1_REMOTE=1 npm run tenant:migrate:remote -- <tenant>
CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- <tenant>
```

A CMSAds deploy does not deploy the standalone storefront. A storefront deploy does not migrate or deploy CMSAds. Neither operation imports another tenant's data.

## 10. AI Agent Onboarding Checklist

An AI agent adapting CMSAds for a new tenant must record:

- target Cloudflare account and exact tenant slug, without exposing credentials;
- integrated or headless topology;
- storefront repository owner and backend repository owner;
- public domain, Worker names, service binding, and route matrix;
- new isolated D1/KV/R2/AI resource identities;
- explicit confirmation that existing tenant data is not imported;
- merchant-provided catalog, claims, media, provider, and tracking inputs;
- form mode and journey chosen for each entry route;
- Meta event map, `event_id` ownership, canonical `content_ids`, and Purchase gate;
- exact local checks, browser scenarios, deployments, migrations, and non-actions.

Do not broaden remote approval, infer provider contracts, fabricate merchant content, or mark planned adapters as implemented.