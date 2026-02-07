#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Local Directory Schema Generator - Generate Schema.org JSON-LD
Usage: python generate.py --page <type> [options]

Page Types: home, location, service, contractor, zoning, about, contact
"""

import argparse
import csv
import json
import sys
import io
from pathlib import Path

# Force UTF-8 for stdout on Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATA_DIR = Path(__file__).parent.parent / "data"
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

def load_csv(filepath):
    """Load CSV file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def get_schema_types(page_type):
    """Get schema types for a page type"""
    filepath = DATA_DIR / "schema-types.csv"
    types = load_csv(filepath)
    
    results = []
    for t in types:
        if t.get('Page Type', '').lower() == page_type.lower():
            results.append(t)
    
    return results

def get_template(page_type):
    """Get template file for page type"""
    template_file = TEMPLATES_DIR / f"{page_type}.json"
    if template_file.exists():
        with open(template_file, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def show_page_requirements(page_type):
    """Show schema requirements for page type"""
    types = get_schema_types(page_type)
    
    lines = []
    lines.append(f"# Schema Requirements for {page_type.title()} Page")
    lines.append("")
    lines.append("| Schema Type | Required | Priority | Rich Snippet |")
    lines.append("|-------------|----------|----------|--------------|")
    
    for t in types:
        req = "✓" if t.get('Required') == 'Yes' else "○"
        lines.append(f"| {t.get('Schema Type', 'N/A')} | {req} | {t.get('Priority', 'N/A')} | {t.get('Rich Snippet', 'None')} |")
    
    return "\n".join(lines)

def generate_home_schema():
    """Generate home page schema"""
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "url": "https://buckscountyfence.net",
                "name": "Bucks County Fence",
                "description": "Directory of fence contractors serving Bucks County, PA",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://buckscountyfence.net/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "name": "Bucks County Fence",
                "url": "https://buckscountyfence.net",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://buckscountyfence.net/logo.png",
                    "width": 512,
                    "height": 512
                }
            },
            {
                "@type": "LocalBusiness",
                "name": "Bucks County Fence Directory",
                "description": "Directory of fence contractors serving Bucks County, Pennsylvania",
                "url": "https://buckscountyfence.net",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Doylestown",
                    "addressRegion": "PA",
                    "addressCountry": "US"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "40.3101",
                    "longitude": "-75.1299"
                },
                "serviceArea": {
                    "@type": "AdministrativeArea",
                    "name": "Bucks County",
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Pennsylvania"
                    }
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://buckscountyfence.net/"
                    }
                ]
            }
        ]
    }

def generate_contractor_schema(name):
    """Generate contractor schema"""
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "name": name,
                "description": f"Professional fence installation services in Bucks County",
                "url": f"https://buckscountyfence.net/contractors/{name.lower().replace(' ', '-')}",
                "telephone": "+1-215-555-0100",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "123 Main Street",
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
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": "40.3101",
                        "longitude": "-75.1299"
                    },
                    "geoRadius": "25 mi"
                },
                "openingHours": ["Mo-Fr 08:00-17:00", "Sa 09:00-14:00"],
                "priceRange": "$$",
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "127"
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://buckscountyfence.net/"},
                    {"@type": "ListItem", "position": 2, "name": "Contractors", "item": "https://buckscountyfence.net/contractors/"},
                    {"@type": "ListItem", "position": 3, "name": name}
                ]
            }
        ]
    }

def generate_location_schema(city):
    """Generate location page schema"""
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Place",
                "name": f"{city}, Bucks County",
                "containedInPlace": {
                    "@type": "County",
                    "name": "Bucks County",
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Pennsylvania"
                    }
                }
            },
            {
                "@type": "Service",
                "serviceType": "Fence Installation",
                "areaServed": {
                    "@type": "City",
                    "name": city
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://buckscountyfence.net/"},
                    {"@type": "ListItem", "position": 2, "name": "Locations", "item": "https://buckscountyfence.net/locations/"},
                    {"@type": "ListItem", "position": 3, "name": city}
                ]
            }
        ]
    }

def generate_service_schema(service):
    """Generate service page schema"""
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "serviceType": service.replace('-', ' ').title(),
                "description": f"Professional {service.replace('-', ' ')} installation in Bucks County, PA",
                "areaServed": {
                    "@type": "County",
                    "name": "Bucks County",
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Pennsylvania"
                    }
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://buckscountyfence.net/"},
                    {"@type": "ListItem", "position": 2, "name": "Services", "item": "https://buckscountyfence.net/services/"},
                    {"@type": "ListItem", "position": 3, "name": service.replace('-', ' ').title()}
                ]
            }
        ]
    }

def format_json_ld(data):
    """Format as JSON-LD script tag"""
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    return f"<script type=\"application/ld+json\">\n{json_str}\n</script>"

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Local Directory Schema Generator")
    parser.add_argument("--page", "-p", required=True, 
                       choices=['home', 'location', 'service', 'contractor', 'zoning', 'about', 'contact'],
                       help="Page type")
    parser.add_argument("--name", "-n", help="Name (for contractor)")
    parser.add_argument("--city", "-c", help="City name (for location)")
    parser.add_argument("--service", "-s", help="Service type (for service page)")
    parser.add_argument("--requirements", "-r", action="store_true", help="Show schema requirements for page type")
    parser.add_argument("--raw", action="store_true", help="Output raw JSON instead of script tag")
    
    args = parser.parse_args()
    
    if args.requirements:
        print(show_page_requirements(args.page))
        sys.exit(0)
    
    # Generate schema based on page type
    if args.page == 'home':
        schema = generate_home_schema()
    elif args.page == 'contractor':
        if not args.name:
            print("Error: --name required for contractor page")
            sys.exit(1)
        schema = generate_contractor_schema(args.name)
    elif args.page == 'location':
        if not args.city:
            print("Error: --city required for location page")
            sys.exit(1)
        schema = generate_location_schema(args.city)
    elif args.page == 'service':
        if not args.service:
            print("Error: --service required for service page")
            sys.exit(1)
        schema = generate_service_schema(args.service)
    else:
        # Get template for other pages
        template = get_template(args.page)
        if template:
            print(f"# Template for {args.page} page:")
            print(template)
            sys.exit(0)
        else:
            print(f"Template for {args.page} not yet implemented")
            sys.exit(1)
    
    # Output
    if args.raw:
        print(json.dumps(schema, indent=2, ensure_ascii=False))
    else:
        print(format_json_ld(schema))
