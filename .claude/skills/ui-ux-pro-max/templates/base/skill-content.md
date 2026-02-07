## UI/UX Pro Max Skill

AI-powered design intelligence for building better interfaces.

### Quick Search

```bash
# Find UI styles
python .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism"

# Get color palette
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech" --domain color

# Font pairings
python .claude/skills/ui-ux-pro-max/scripts/search.py "professional" --domain typography

# Astro-specific guidelines
python .claude/skills/ui-ux-pro-max/scripts/search.py "islands" --stack astro
```

### Generate Design System

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system -p "Project Name"
```

### Domains

- `style` - UI styles, effects, animations
- `color` - Color palettes by product type  
- `typography` - Font pairings
- `landing` - Landing page patterns
- `chart` - Chart recommendations
- `ux` - UX guidelines
- `product` - Product-specific guidance
- `icons` - Icon libraries

### Stacks

- `astro` - Astro framework guidelines
- `react` - React patterns
- `nextjs` - Next.js guidelines
- `svelte` - Svelte/SvelteKit
- `vue` - Vue.js
- `html-tailwind` - HTML + Tailwind
