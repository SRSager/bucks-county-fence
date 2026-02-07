# Optimal Vibe-Coding Infrastructure for Astro Local Business Directories

The ideal stack for building repeatable Astro-based local business directories combines **MCP servers for AI-assisted development**, **Sveltia CMS for content management**, **DaisyUI with selective Svelte islands** for UI, and **Turborepo for multi-site scaling**. This infrastructure enables a solo developer to deploy professional SEO-optimized directory sites in hours rather than days, with full automation for content updates from external sources like N8N workflows.

## MCP servers enable true vibe-coding workflows

The Model Context Protocol ecosystem now includes essential servers specifically relevant to this stack. The **Astro Docs MCP Server** (`https://mcp.docs.astro.build/mcp`) provides real-time access to current Astro documentation, eliminating outdated code suggestions. For deployment automation, the **official Netlify MCP** (`@netlify/mcp`) enables prompt-to-production workflows directly from Claude Code or Cursor.

**Recommended MCP configuration for your stack:**

```json
{
  "mcpServers": {
    "astro-docs": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.docs.astro.build/mcp"]
    },
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token" }
    }
  }
}
```

The **GitHub MCP Server** is critical for Git-based CMS workflows, enabling programmatic content commits via its `push_files` tool. For SEO analysis during development, the **seo-mcp** package (`github.com/cnych/seo-mcp`) provides free Ahrefs-based backlink analysis and keyword research, while **mcp-gsc** connects Google Search Console data directly to Claude.

For project-specific intelligence, the **astro-mcp integration** (`github.com/morinokami/astro-mcp`) adds an MCP server to your Astro project that exposes your config, routes, and dev server address—enabling AI tools to understand your specific project structure.

## Astro SEO requires a layered integration approach

Local business directories demand comprehensive SEO implementation. The core package stack includes **astro-seo** for meta tags and Open Graph, **@astrojs/sitemap** for XML sitemaps, **astro-robots-txt** for crawler directives, and **astro-seo-schema** for JSON-LD structured data.

**Essential SEO packages:**
- `astro-seo` (~136k weekly downloads) — meta tags, Open Graph, Twitter cards
- `@astrojs/sitemap` — XML sitemap generation with per-page customization
- `astro-robots-txt` — robots.txt with crawler-specific rules
- `astro-seo-schema` + `schema-dts` — type-safe JSON-LD generation
- `astro-compress` — HTML/CSS/JS/image compression (must be last integration)

For local business schema, create a reusable component using astro-seo-schema:

```astro
---
import { Schema } from 'astro-seo-schema';
const { business } = Astro.props;
---
<Schema item={{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": business.name,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": business.address.street,
    "addressLocality": business.address.city,
    "addressRegion": business.address.state
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": business.geo.lat,
    "longitude": business.geo.lng
  },
  "openingHoursSpecification": business.hours
}} />
```

Core Web Vitals optimization in Astro relies on its islands architecture. Use `client:visible` for below-fold interactive components and `client:idle` for non-critical interactivity. Always specify image dimensions to prevent CLS, and preload hero images with `fetchpriority="high"`.

## Sveltia CMS offers dramatic performance gains over Decap

Sveltia CMS is a ground-up rewrite that delivers **5x smaller bundle size** (~300KB vs 1.5MB) and instant content loading via GitHub's GraphQL API. The migration from Decap CMS requires changing a single script tag:

```html
<!-- Replace Decap with Sveltia - single line change -->
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
```

Your existing `config.yml` works as-is. For Astro SSR sites, the `astro-sveltia-cms` integration handles OAuth routing automatically when you set `output: "server"` in your Astro config.

**External data integration is fully supported** through multiple methods. The GitHub GraphQL API's `createCommitOnBranch` mutation provides the cleanest approach for programmatic content updates:

```javascript
// N8N or external service commits via GitHub API
const variables = {
  input: {
    branch: { repositoryNameWithOwner: "user/repo", branchName: "main" },
    message: { headline: `Add business: ${business.name}` },
    fileChanges: {
      additions: [{
        path: `src/content/businesses/${business.slug}.md`,
        contents: btoa(markdownContent)
      }]
    },
    expectedHeadOid: currentHeadSha
  }
};
```

N8N's built-in GitHub node supports file creation directly. Alternatively, GitHub Actions can run scheduled syncs from external APIs using a simple workflow that fetches data, generates markdown with frontmatter, and commits changes.

**Content schema for directories** should include business name, category (as a relation), address object, coordinates, hours array, price range enum, social links, featured/verified booleans, and a status workflow (draft → published → archived). Define these in both Astro's content collections (`src/content/config.ts` with Zod) and Sveltia's `config.yml` for synchronized validation.

## DaisyUI with selective Svelte islands outperforms full shadcn

For content-heavy directory sites, **DaisyUI is the optimal primary UI library**. It's purely CSS-based (zero JavaScript overhead), provides **35+ themes** including professional dark modes, and aligns perfectly with Astro's zero-JS philosophy. Bundle impact: **0 KB runtime**.

For interactive components like search filters and modals, use **shadcn-svelte** rather than React shadcn/ui. The bundle size difference is dramatic: **Svelte adds ~1.6KB per island type** versus **React's ~42KB runtime overhead**. This matters significantly when multiple interactive components exist across directory pages.

**Recommended hybrid approach:**

```astro
---
import SearchFilter from "./SearchFilter.svelte";
---
<!-- Static content: DaisyUI classes, zero JS -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">{business.name}</h2>
    <div class="badge badge-primary">{business.category}</div>
  </div>
</div>

<!-- Interactive search: Svelte island, hydrates on visibility -->
<SearchFilter client:visible />
```

**Critical limitation with React shadcn/ui in Astro:** Compound components (Dialog, Dropdown, Popover) fail when used directly in `.astro` files because React context isn't shared between islands. You must wrap compound components in dedicated `.tsx` files. This complexity doesn't exist with shadcn-svelte.

Setup for shadcn-svelte:
```bash
npx astro add svelte tailwind
npx shadcn-svelte@next init
npx shadcn-svelte@next add button dialog dropdown-menu
```

## SVG icon libraries for static and interactive contexts

Icons require a dual-library approach in Astro: one for static rendering at build time, another for reactive use inside hydrated islands.

**Primary: `astro-icon` with Iconify**

This is the Astro-native solution providing access to 200k+ icons across all major sets (Lucide, Heroicons, Material Design, Tabler, etc.) with automatic tree-shaking—only icons actually used get bundled.

```bash
npx astro add astro-icon
```

```astro
---
import { Icon } from 'astro-icon/components';
---
<!-- Local business directory essentials -->
<Icon name="lucide:map-pin" class="w-5 h-5 text-primary" />
<Icon name="lucide:phone" />
<Icon name="lucide:clock" />
<Icon name="lucide:star" />
<Icon name="lucide:navigation" />

<!-- Social icons -->
<Icon name="lucide:facebook" />
<Icon name="mdi:instagram" />
<Icon name="mdi:yelp" />
```

Configure icon sets in `astro.config.mjs`:

```javascript
import icon from 'astro-icon';

export default defineConfig({
  integrations: [
    icon({
      include: {
        lucide: ['map-pin', 'phone', 'clock', 'star', 'navigation', 'search', 'filter', 'x'],
        mdi: ['instagram', 'facebook', 'yelp', 'google-maps'],
      }
    }),
    // ... other integrations
  ],
});
```

**For Svelte islands: `lucide-svelte`**

Interactive components that need reactive icon states (loading spinners, toggle icons, animated transitions) require a Svelte-compatible library:

```bash
npm install lucide-svelte
```

```svelte
<script>
  import { Search, Filter, X, Loader2 } from 'lucide-svelte';
  let isLoading = false;
</script>

<button on:click={handleSearch}>
  {#if isLoading}
    <Loader2 class="w-4 h-4 animate-spin" />
  {:else}
    <Search class="w-4 h-4" />
  {/if}
</button>
```

**Why two libraries?** `astro-icon` renders static inline SVGs at build time with zero JavaScript overhead—ideal for the hundreds of icons across directory listings. `lucide-svelte` works inside hydrated Svelte islands where icons need to respond to state changes. The Lucide set is consistent across both, maintaining visual coherence.

## Turborepo enables efficient multi-site scaling

For **3+ similar sites**, a monorepo with Turborepo delivers significant efficiency gains through shared components, content-aware caching, and single dependency management. Structure your monorepo with apps for each site and packages for shared UI, Astro components, and utilities.

```
my-directories/
├── apps/
│   ├── city-a-directory/
│   └── city-b-directory/
├── packages/
│   ├── ui/                # Shared Svelte components
│   ├── astro-components/  # Shared .astro files
│   └── config/            # ESLint, TS, Tailwind configs
├── turbo.json
└── pnpm-workspace.yaml
```

**Environment variables for multi-site deployment** use Astro's type-safe schema (Astro 4.10+):

```javascript
export default defineConfig({
  env: {
    schema: {
      SITE_NAME: envField.string({ context: "client", access: "public" }),
      SITE_URL: envField.string({ context: "client", access: "public" }),
      CITY_NAME: envField.string({ context: "client", access: "public" }),
      DATABASE_URL: envField.string({ context: "server", access: "secret" }),
    }
  }
});
```

Each Netlify deployment points to the same repo with different environment variables. Selective builds use `turbo run build --filter=city-a-directory`.

## The ui-ux-pro-max skill accelerates UI development

The **ui-ux-pro-max-skill** (27.5k GitHub stars) is a design intelligence skill for Claude Code that provides searchable databases of **67 UI styles**, **96 color palettes**, **56 font pairings**, and **98 UX guidelines**. Critically, it includes **53 Astro-specific guidelines** covering Islands Architecture, Content Collections, and View Transitions.

**Installation for Claude Code:**
```bash
npm install -g uipro-cli
cd your-project
uipro init --ai claude
```

The skill activates automatically for UI/UX prompts. It supports multiple stacks including `html-tailwind`, `astro`, `svelte`, and `shadcn`. When you request "build a landing page for a local restaurant directory," it automatically generates a design system with matched styles, colors, and typography, then implements with proper spacing and accessibility patterns.

Supported workflow: You describe the project → Design System generated with reasoning → Smart recommendations based on product type → Code generation with validated patterns → Pre-delivery checks against UX anti-patterns.

## Complete stack configuration

**astro.config.mjs for production directories:**

```javascript
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compress from 'astro-compress';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: import.meta.env.SITE_URL,
  output: 'hybrid',
  adapter: netlify({ imageCDN: true }),
  
  integrations: [
    svelte(),
    mdx(),
    icon({
      include: {
        lucide: ['map-pin', 'phone', 'clock', 'star', 'navigation', 'search', 'filter', 'x', 'menu', 'chevron-down'],
        mdi: ['instagram', 'facebook', 'yelp', 'google-maps'],
      }
    }),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      serialize: (item) => {
        if (item.url.includes('/business/')) {
          item.priority = 0.9;
          item.changefreq = 'daily';
        }
        return item;
      },
    }),
    robotsTxt({
      sitemap: true,
      policy: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    }),
    compress({ CSS: true, HTML: true, Image: { sharp: { quality: 80 } }, JavaScript: true }),
  ],
  
  vite: { plugins: [tailwindcss()] },
  
  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public' }),
      SITE_NAME: envField.string({ context: 'client', access: 'public' }),
    }
  }
});
```

**Package installation sequence:**
```bash
# Core framework
npm create astro@latest my-directory -- --template minimal
npx astro add netlify svelte mdx sitemap

# Tailwind 4 + DaisyUI
npm install tailwindcss @tailwindcss/vite daisyui@latest

# SEO packages  
npm install astro-seo astro-robots-txt astro-seo-schema schema-dts astro-compress

# Icons
npx astro add astro-icon
npm install lucide-svelte

# Sveltia CMS (manual setup or integration)
npm install astro-sveltia-cms  # For SSR OAuth

# shadcn-svelte for interactive components
npx shadcn-svelte@next init
npx shadcn-svelte@next add button dialog command
```

## Conclusion

This infrastructure delivers a **vibe-coding workflow** where natural language prompts produce production-ready code with proper SEO, accessibility, and performance optimization. The combination of MCP servers for AI context, Sveltia CMS for content management, DaisyUI for static UI, shadcn-svelte for interactive islands, astro-icon for static SVGs, lucide-svelte for reactive icons, and Turborepo for multi-site scaling creates a system where a solo developer can realistically launch **multiple optimized local business directories per week**.

Key architectural decisions: Choose Svelte over React for islands (25x smaller runtime), DaisyUI over full component libraries for static content, Turborepo over separate repos at 3+ sites, GitHub API commits over webhooks for external data integration, and dual icon libraries (astro-icon + lucide-svelte) for zero-JS static icons with reactive island support. The ui-ux-pro-max skill with its Astro-specific guidelines accelerates the design-to-code phase significantly.
