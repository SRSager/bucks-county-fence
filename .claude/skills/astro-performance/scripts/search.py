#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Astro Performance Search - Find optimization guidelines
Usage: python search.py "<query>" [--category <category>] [--priority <priority>]

Categories: Images, Islands, Fonts, View Transitions, Prefetching, Build, Content Collections, Directory, SEO, Multi-Site
Priorities: Critical, High, Medium, Low
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

def load_rules(filepath):
    """Load CSV rules file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def search_rules(query, category=None, priority=None, max_results=5):
    """Search performance rules"""
    filepath = DATA_DIR / "performance-rules.csv"
    rules = load_rules(filepath)
    
    query_lower = query.lower()
    results = []
    
    for rule in rules:
        # Category filter
        if category and rule.get('Category', '').lower() != category.lower():
            continue
        
        # Priority filter
        if priority and rule.get('Priority', '').lower() != priority.lower():
            continue
        
        # Search in all fields
        searchable = ' '.join([
            rule.get('Rule', ''),
            rule.get('Description', ''),
            rule.get('Category', ''),
            rule.get('Implementation', '')
        ]).lower()
        
        if query_lower in searchable:
            results.append(rule)
    
    return results[:max_results]

def format_output(results):
    """Format results for display"""
    if not results:
        return "No results found."
    
    lines = []
    lines.append(f"## Astro Performance Guidelines")
    lines.append(f"**Found:** {len(results)} results\n")
    
    for i, rule in enumerate(results, 1):
        lines.append(f"### {i}. {rule.get('Rule', 'N/A')}")
        lines.append(f"**Category:** {rule.get('Category', 'N/A')}")
        lines.append(f"**Priority:** {rule.get('Priority', 'N/A')}")
        lines.append(f"**Description:** {rule.get('Description', 'N/A')}")
        lines.append(f"**Implementation:** `{rule.get('Implementation', 'N/A')}`")
        lines.append(f"**Impact:** {rule.get('Impact', 'N/A')}")
        lines.append(f"**Testing:** {rule.get('Testing', 'N/A')}")
        lines.append("")
    
    return "\n".join(lines)

def show_cwv_targets():
    """Display Core Web Vitals targets"""
    filepath = DATA_DIR / "cwv-targets.csv"
    targets = load_rules(filepath)
    
    lines = []
    lines.append("# Core Web Vitals Targets")
    lines.append("")
    lines.append("| Metric | Target | Good | Poor | Priority |")
    lines.append("|--------|--------|------|------|----------|")
    
    for t in targets:
        lines.append(f"| {t.get('Metric', '')} | {t.get('Target', '')} | {t.get('Good', '')} | {t.get('Poor', '')} | {t.get('Priority', '')} |")
    
    return "\n".join(lines)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Astro Performance Search")
    parser.add_argument("query", nargs='?', default="", help="Search query")
    parser.add_argument("--category", "-c", help="Filter by category")
    parser.add_argument("--priority", "-p", choices=["Critical", "High", "Medium", "Low"], help="Filter by priority")
    parser.add_argument("--max-results", "-n", type=int, default=5, help="Max results (default: 5)")
    parser.add_argument("--cwv", action="store_true", help="Show Core Web Vitals targets")
    
    args = parser.parse_args()
    
    if args.cwv:
        print(show_cwv_targets())
    else:
        results = search_rules(args.query, args.category, args.priority, args.max_results)
        print(format_output(results))
