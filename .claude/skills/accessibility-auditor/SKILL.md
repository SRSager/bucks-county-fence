# Accessibility Auditor Skill

Comprehensive WCAG 2.1 AA/AAA compliance checking for Astro-based local directory sites.

## Overview

This skill provides accessibility guidelines, checklists, and automated checks for building inclusive local business directories that work for all users including those using screen readers, keyboard navigation, and assistive technologies.

## Quick Commands

```bash
# Check WCAG guidelines
python .claude/skills/accessibility-auditor/scripts/audit.py "keyboard navigation"

# Get component-specific checks
python .claude/skills/accessibility-auditor/scripts/audit.py --component form

# Full page audit checklist
python .claude/skills/accessibility-auditor/scripts/audit.py --checklist page

# Show all WCAG criteria
python .claude/skills/accessibility-auditor/scripts/audit.py --criteria
```

## Core Areas

### 1. Perceivable (WCAG 1.x)
- **1.1 Text Alternatives** - Alt text for images
- **1.2 Time-based Media** - Captions, transcripts
- **1.3 Adaptable** - Semantic structure, ARIA labels
- **1.4 Distinguishable** - Color contrast, text resize

### 2. Operable (WCAG 2.x)
- **2.1 Keyboard Accessible** - Tab navigation, focus visible
- **2.2 Enough Time** - No auto-timeout without warning
- **2.3 Seizures** - No flashing content
- **2.4 Navigable** - Skip links, page titles
- **2.5 Input Modalities** - Touch targets, gestures

### 3. Understandable (WCAG 3.x)
- **3.1 Readable** - Language declaration
- **3.2 Predictable** - Consistent navigation
- **3.3 Input Assistance** - Error messages, labels

### 4. Robust (WCAG 4.x)
- **4.1 Compatible** - Valid HTML, ARIA support

## Directory-Specific Accessibility

### Contractor Listings
- **Company logos**: Meaningful alt text
- **Phone numbers**: Clickable tel: links with labels
- **Addresses**: Structured address data
- **Service areas**: Clear list with proper semantics

### Location Pages
- **Maps**: Keyboard-accessible alternatives
- **Service lists**: Proper heading hierarchy
- **Related locations**: Descriptive link text

### Zoning Content (Blog)
- **Tables**: Proper headers and captions
- **PDFs**: Offer HTML alternatives
- **Complex data**: Simplified summaries

## WCAG Levels

| Level | Description | Priority for Directory |
|-------|-------------|----------------------|
| A | Essential, blocking | Critical |
| AA | Ideal accessibility | Required (legal) |
| AAA | Enhanced accessibility | Recommended |

## Automated Testing

### Tools
- **axe-core**: Browser extension and CLI
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: WebAIM's evaluation tool
- **Pa11y**: Command-line runner

### Astro-Specific
- Check `aria-current` for active navigation
- Ensure View Transitions announce page changes
- Test Islands Architecture components with screen readers

## Testing Checklist

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus indicator is visible
- [ ] Skip to main content link
- [ ] No keyboard traps
- [ ] All interactive elements reachable

### Screen Reader
- [ ] Page title is descriptive
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Links have descriptive text (no "click here")
- [ ] Form labels are associated
- [ ] ARIA landmarks present

### Visual
- [ ] Color contrast 4.5:1 minimum (text)
- [ ] Color contrast 3:1 minimum (UI components)
- [ ] Information not conveyed by color alone
- [ ] Text can resize to 200%
- [ ] No horizontal scroll at 400% zoom

### Forms
- [ ] All inputs have labels
- [ ] Error messages are associated
- [ ] Required fields are indicated
- [ ] Input types are correct (email, tel, etc.)

## Legal Requirements

### ADA Compliance (US)
- Title III applies to websites
- WCAG 2.1 Level AA is standard
- Lawsuits increasing against local business sites

### State Laws
- Pennsylvania: Accessibility requirements for state sites
- Future: Potential county-level requirements

## Data Files

- `wcag-criteria.csv` - All WCAG 2.1 success criteria
- `component-checklists.csv` - Component-specific checks
- `aria-patterns.csv` - Common ARIA implementations
- `testing-tools.csv` - Testing tool configurations

## License

Created for Bucks County Fence directory project.
