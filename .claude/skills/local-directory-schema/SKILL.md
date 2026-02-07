# Local Directory Schema Skill

Complete structured data markup for local business directories with multi-county scaling support.

## Overview

This skill provides Schema.org JSON-LD templates and guidelines for fence contractor directories, optimized for:
- Local SEO in Bucks County, PA (and cloneable to other counties)
- Multiple page types (home, location, service, contractor profiles)
- Rich snippets in Google Search
- Google Business Profile integration

## Quick Commands

```bash
# Get schema for page type
python .claude/skills/local-directory-schema/scripts/generate.py --page home

# Generate contractor listing schema
python .claude/skills/local-directory-schema/scripts/generate.py --page contractor --name "ABC Fence Co"

# Generate location page schema
python .claude/skills/local-directory-schema/scripts/generate.py --page location --city "Doylestown"

# Generate service page schema
python .claude/skills/local-directory-schema/scripts/generate.py --page service --service "vinyl-fences"

# Validate schema
python .claude/skills/local-directory-schema/scripts/generate.py --validate schema.json
```

## Schema Types by Page

### Home Page (`/`)
- **WebSite** - Site search capability
- **Organization** - Parent directory entity
- **LocalBusiness** - Directory business info
- **BreadcrumbList** - Navigation structure

### Location Page (`/locations/[city]/`)
- **LocalBusiness** - Featured contractor
- **Service** - Fence installation service
- **Place** - Geographic location
- **BreadcrumbList** - Page hierarchy
- **FAQPage** - City-specific questions

### Service Page (`/services/[type]/`)
- **Service** - Fence type service
- **LocalBusiness** - Contractors offering service
- **HowTo** - Installation guides
- **BreadcrumbList** - Navigation

### Contractor Profile (`/contractors/[slug]/`)
- **LocalBusiness** - Full business details
- **Person** - Owner/operator
- **Service** - Services offered
- **Review** - Customer reviews
- **AggregateRating** - Overall rating
- **ImageObject** - Gallery photos
- **BreadcrumbList** - Page position

### Zoning/Content Page (`/zoning/[township]/`)
- **Article** - Zoning information
- **FAQPage** - Common questions
- **HowTo** - Permit process
- **GovernmentService** - Township contact

## Schema Properties Reference

### LocalBusiness (Contractor)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Contractor Name",
  "description": "Fence installation in Bucks County",
  "url": "https://buckscountyfence.net/contractors/slug",
  "telephone": "+1-215-555-1234",
  "email": "contact@example.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Doylestown",
    "addressRegion": "PA",
    "postalCode": "18901",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3101",
    "longitude": "-75.1299"
  },
  "serviceArea": {
    "@type": "City",
    "name": "Bucks County",
    "containedInPlace": {
      "@type": "State",
      "name": "Pennsylvania"
    }
  },
  "openingHours": ["Mo-Fr 08:00-17:00", "Sa 09:00-14:00"],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Check"],
  "currenciesAccepted": "USD",
  "hasOfferCatalog": {...},
  "aggregateRating": {...},
  "review": [...],
  "image": [...],
  "areaServed": [...]
}
```

### Service (Fence Types)
```json
{
  "@type": "Service",
  "serviceType": "Vinyl Fence Installation",
  "provider": {...},
  "areaServed": {...},
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Vinyl Fence Options",
    "itemListElement": [...]
  }
}
```

### OfferCatalog (Services Menu)
```json
{
  "@type": "OfferCatalog",
  "name": "Fence Services",
  "itemListElement": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Vinyl Fence Installation"
      },
      "price": "25.00",
      "priceUnit": "per linear foot"
    }
  ]
}
```

## Multi-County Scaling

When cloning to other counties (Montgomery, Chester, etc.):

1. **Update Organization** - Change county name in all schema
2. **Service Area** - Update geographic boundaries
3. **LocalBusiness** - Update contractor service areas
4. **Breadcrumbs** - Update county in URL paths
5. **Place** - Update all Place entities

### Environment-Based Schema
```javascript
const COUNTY = import.meta.env.COUNTY_NAME || 'Bucks';
const STATE = import.meta.env.STATE_CODE || 'PA';
// Use in schema generation
```

## Rich Snippets Expected

| Page Type | Rich Snippet | Trigger |
|-----------|--------------|---------|
| Home | Sitelinks | WebSite + Organization |
| Location | Local Pack | LocalBusiness + Geo |
| Service | Service Rich Result | Service markup |
| Contractor | Business Profile | Complete LocalBusiness |
| Zoning | FAQ Rich Result | FAQPage markup |
| All | Breadcrumbs | BreadcrumbList |
| All | Reviews Stars | AggregateRating |

## Google Business Profile Integration

Sync schema with GBP:
- **Name** → Business name
- **Address** → Physical location
- **Telephone** → Primary phone
- **Opening Hours** → Hours of operation
- **Service Area** → Service area settings
- **Price Range** → Price indication

## Validation Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Markup Validator**: https://validator.schema.org/
3. **Google Search Console**: Schema enhancement reports

## Data Files

- `schema-types.csv` - All schema types by page
- `properties-reference.csv` - Schema properties reference
- `templates/` - JSON-LD templates for each page type

## License

Created for Bucks County Fence directory project.
