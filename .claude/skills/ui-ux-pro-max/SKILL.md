# UI/UX Pro Max Skill

AI-powered design intelligence toolkit providing searchable databases of UI styles, color palettes, font pairings, chart types, and UX guidelines.

## Quick Start

### Search Commands

```bash
# Search for styles
python .claude/skills/ui-ux-pro-max/scripts/search.py "minimal dashboard"

# Search for colors
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech" --domain color

# Search for typography
python .claude/skills/ui-ux-pro-max/scripts/search.py "professional" --domain typography

# Search stack-specific (Astro guidelines)
python .claude/skills/ui-ux-pro-max/scripts/search.py "islands" --stack astro

# Generate design system
python .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system -p "My Project"

# Persist design system with page overrides
python .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "My Project" --page "dashboard"
```

### Available Domains

- `style` - UI styles (glassmorphism, minimalism, brutalism) + AI prompts
- `color` - Color palettes by product type
- `typography` - Font pairings with Google Fonts imports
- `landing` - Page structure and CTA strategies
- `chart` - Chart types and library recommendations
- `ux` - Best practices and anti-patterns
- `product` - Product type recommendations
- `icons` - Icon libraries and usage

### Available Stacks

- `astro` - Astro framework (Islands Architecture, Content Collections)
- `html-tailwind` - HTML + Tailwind CSS
- `react` - React patterns
- `nextjs` - Next.js App Router
- `svelte` - Svelte/SvelteKit
- `vue` - Vue 3 Composition API
- `nuxtjs` - Nuxt.js
- `shadcn` - shadcn/ui components
- And more...

## Design System Generation

Generate complete design system recommendations:

```bash
# ASCII output (default)
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech app" --design-system -p "FinanceApp"

# Markdown output
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech app" --design-system -p "FinanceApp" --format markdown

# Persist to files (Master + Overrides pattern)
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech app" --design-system --persist -p "FinanceApp"

# With page-specific overrides
python .claude/skills/ui-ux-pro-max/scripts/search.py "fintech app" --design-system --persist -p "FinanceApp" --page "dashboard"
```

## Data Structure

All data is stored in CSV format for easy editing:

```
.claude/skills/ui-ux-pro-max/
├── data/
│   ├── styles.csv          # 68 UI style records
│   ├── colors.csv          # 96 color palettes
│   ├── typography.csv      # 57 font pairings
│   ├── charts.csv          # 25 chart types
│   ├── landing.csv         # 30 landing patterns
│   ├── products.csv        # 96 product types
│   ├── ux-guidelines.csv   # 99 UX guidelines
│   ├── icons.csv           # 100 icons
│   └── stacks/
│       ├── astro.csv       # Astro-specific guidelines
│       ├── react.csv
│       ├── nextjs.csv
│       └── ...
└── scripts/
    ├── search.py           # CLI entry point
    ├── core.py             # BM25 search engine
    └── design_system.py    # Design system generator
```

## Search Algorithm

Uses BM25 ranking combined with regex matching for optimal results. Domain auto-detection is available when `--domain` is omitted.

## Stack-Specific for Astro Projects

For this Astro project, use `--stack astro` to get guidelines for:
- Islands Architecture
- Client directives (`client:load`, `client:visible`, etc.)
- Content Collections
- Server Islands (Astro 5.0+)
- View Transitions API
- Image optimization with `<Image />`
- Script handling with `is:inline`, `define:vars`

## License

Adapted from [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) by NextLevelBuilder.
