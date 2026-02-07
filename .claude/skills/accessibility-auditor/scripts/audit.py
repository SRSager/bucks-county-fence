#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Accessibility Auditor - WCAG compliance checking for local directories
Usage: python audit.py "<query>" [--component <component>] [--level <level>]

Components: Navigation, Header, Footer, Listing Card, Form, Image, Map, Table, Modal, Accordion, Tabs, Carousel
Levels: A, AA, AAA
"""

import argparse
import csv
import sys
import io
from pathlib import Path

# Force UTF-8 for stdout on Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATA_DIR = Path(__file__).parent.parent / "data"

def load_csv(filepath):
    """Load CSV file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def search_wcag(query, level=None, max_results=10):
    """Search WCAG criteria"""
    filepath = DATA_DIR / "wcag-criteria.csv"
    criteria = load_csv(filepath)
    
    query_lower = query.lower()
    results = []
    
    for c in criteria:
        if level and c.get('Level', '') != level:
            continue
        
        searchable = ' '.join([
            c.get('Success Criterion', ''),
            c.get('Description', ''),
            c.get('Guideline', ''),
            c.get('Common Issues', '')
        ]).lower()
        
        if query_lower in searchable:
            results.append(c)
    
    return results[:max_results]

def get_component_checklist(component, level=None):
    """Get checklist for specific component"""
    filepath = DATA_DIR / "component-checklists.csv"
    checks = load_csv(filepath)
    
    results = []
    for check in checks:
        if check.get('Component', '').lower() == component.lower():
            if level and check.get('Level', '') != level:
                continue
            results.append(check)
    
    return results

def format_wcag_results(results):
    """Format WCAG criteria results"""
    if not results:
        return "No WCAG criteria found."
    
    lines = []
    lines.append("## WCAG 2.1 Success Criteria")
    lines.append(f"**Found:** {len(results)} results\n")
    
    for r in results:
        lines.append(f"### {r.get('Success Criterion', 'N/A')} ({r.get('Level', 'N/A')})")
        lines.append(f"**Principle:** {r.get('Principle', 'N/A')}")
        lines.append(f"**Guideline:** {r.get('Guideline', 'N/A')}")
        lines.append(f"**Description:** {r.get('Description', 'N/A')}")
        lines.append(f"**Test Method:** {r.get('Test Method', 'N/A')}")
        lines.append(f"**Priority:** {r.get('Priority', 'N/A')}")
        if r.get('Common Issues'):
            lines.append(f"**Common Issues:** {r.get('Common Issues')}")
        lines.append("")
    
    return "\n".join(lines)

def format_checklist(results):
    """Format component checklist"""
    if not results:
        return "No checklist items found."
    
    lines = []
    lines.append("## Component Accessibility Checklist")
    lines.append(f"**Found:** {len(results)} checks\n")
    
    for r in results:
        level = r.get('Level', 'N/A')
        lines.append(f"### [{level}] {r.get('Check', 'N/A')}")
        lines.append(f"**Description:** {r.get('Description', 'N/A')}")
        lines.append(f"**How to Test:** {r.get('How to Test', 'N/A')}")
        lines.append(f"**Auto Fix:** {r.get('Auto Fix', 'N/A')}")
        lines.append("")
    
    return "\n".join(lines)

def show_all_criteria():
    """Display all WCAG criteria"""
    filepath = DATA_DIR / "wcag-criteria.csv"
    criteria = load_csv(filepath)
    
    lines = []
    lines.append("# WCAG 2.1 Success Criteria Reference")
    lines.append("")
    lines.append("| Criterion | Level | Description |")
    lines.append("|-----------|-------|-------------|")
    
    for c in criteria:
        sc = c.get('Success Criterion', '')
        level = c.get('Level', '')
        desc = c.get('Description', '')[:50] + "..." if len(c.get('Description', '')) > 50 else c.get('Description', '')
        lines.append(f"| {sc} | {level} | {desc} |")
    
    return "\n".join(lines)

def generate_page_checklist():
    """Generate full page audit checklist"""
    filepath = DATA_DIR / "component-checklists.csv"
    checks = load_csv(filepath)
    
    lines = []
    lines.append("# Full Page Accessibility Audit Checklist")
    lines.append("")
    lines.append("## Pre-Audit Setup")
    lines.append("- [ ] Open browser DevTools")
    lines.append("- [ ] Enable screen reader (NVDA/VoiceOver)")
    lines.append("- [ ] Test at 400% zoom")
    lines.append("- [ ] Enable grayscale mode")
    lines.append("")
    
    # Group by component
    components = {}
    for check in checks:
        comp = check.get('Component', 'Other')
        if comp not in components:
            components[comp] = []
        components[comp].append(check)
    
    for comp, checks in sorted(components.items()):
        lines.append(f"## {comp}")
        for check in checks:
            level = check.get('Level', '')
            lines.append(f"- [ ] [{level}] {check.get('Check', '')} - {check.get('Description', '')}")
        lines.append("")
    
    return "\n".join(lines)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Accessibility Auditor")
    parser.add_argument("query", nargs='?', default="", help="Search query")
    parser.add_argument("--component", "-c", help="Get checklist for component")
    parser.add_argument("--level", "-l", choices=["A", "AA", "AAA"], help="Filter by WCAG level")
    parser.add_argument("--max-results", "-n", type=int, default=10, help="Max results")
    parser.add_argument("--criteria", action="store_true", help="Show all WCAG criteria")
    parser.add_argument("--checklist", action="store_true", help="Generate full page checklist")
    
    args = parser.parse_args()
    
    if args.criteria:
        print(show_all_criteria())
    elif args.checklist:
        print(generate_page_checklist())
    elif args.component:
        results = get_component_checklist(args.component, args.level)
        print(format_checklist(results))
    else:
        results = search_wcag(args.query, args.level, args.max_results)
        print(format_wcag_results(results))
