# Astro Performance Optimization Skill

Comprehensive performance optimization for Astro-based local directory sites.

## Overview

This skill provides Astro-specific performance guidelines for multi-page local business directories, with focus on Core Web Vitals, image optimization, and scaling across multiple counties.

## Quick Commands

```bash
# Check performance rules for images
python .claude/skills/astro-performance/scripts/search.py "image optimization"

# Get Islands Architecture guidance
python .claude/skills/astro-performance/scripts/search.py "client directives"

# View Transitions best practices
python .claude/skills/astro-performance/scripts/search.py "view transitions"

# Prefetching strategies
python .claude/skills/astro-performance/scripts/search.py "prefetch"
```

## Core Areas

### 1. Images (`<Image />` Component)
- Auto-optimization with Sharp
- WebP/AVIF format conversion
- Responsive srcset generation
- Lazy loading for below-fold images
- Placeholder strategies

### 2. Islands Architecture
- `client:load` - High priority interactivity
- `client:visible` - Scroll-triggered hydration
- `client:media` - Responsive hydration
- `client:idle` - Low priority hydration
- `client:only` - Framework-specific components

### 3. View Transitions API
- Smooth page transitions
- `transition:name` for persistent elements
- `transition:animate` directives
- Fallback handling

### 4. Font Loading
- Font display: swap
- Preload critical fonts
- Subsetting
- Variable fonts

### 5. Prefetching
- `data-astro-prefetch` attribute
- Hover intent prefetching
- Viewport-based prefetching
- Strategic prefetching for directory navigation

### 6. Build Optimization
- Static generation (output: 'static')
- Asset bundling
- Tree shaking
- Code splitting by route

## Multi-Site Scaling (County Cloning)

When cloning for other counties:
1. Maintain shared components in package
2. County-specific content in `/src/content/[county]/`
3. Environment-based configuration
4. Shared performance budget across all counties

## Core Web Vitals Targets

| Metric | Target | Current Astro Baseline |
|--------|--------|----------------------|
| LCP | < 2.5s | Excellent |
| FID/INP | < 200ms | Excellent |
| CLS | < 0.1 | Excellent |
| TTFB | < 600ms | Excellent |
| FCP | < 1.8s | Excellent |

## Directory-Specific Optimizations

### Listing Pages
- Pagination with `getStaticPaths()`
- Image placeholders for contractor photos
- Lazy-loaded maps
- Virtual scrolling for long lists

### Location Pages
- Pre-generate all city pages at build
- Shared layout components
- Cached contractor data
- Related content suggestions

### Service Pages
- Dynamic routes for fence types
- Schema markup for each service
- Cross-linking to relevant locations

## Testing Performance

```bash
# Build and analyze
npm run build
npm run preview

# Lighthouse CI
npx lighthouse-ci

# Web Vitals check
npm install web-vitals
```

## Data Files

- `performance-rules.csv` - Optimization guidelines by category
- `cwv-targets.csv` - Core Web Vitals benchmarks
- `image-optimization.csv` - Image best practices
- `client-directives.csv` - Islands architecture patterns

## License

Created for Bucks County Fence directory project.
