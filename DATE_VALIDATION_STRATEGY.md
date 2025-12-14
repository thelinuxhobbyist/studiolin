# Date Validation Strategy

## Overview

This document explains how StudioLinux prevents invalid dates (like January 1, 0001) from appearing on the site. The strategy uses three layers of validation:

1. **Pre-commit Hook** — Validates dates before commits
2. **Build-time Validation** — Validates dates before Hugo build
3. **Front Matter Standards** — Enforces ISO 8601 date format

## The Problem

Hugo pages without an explicit `date` field in front matter default to January 1, 0001 (Unix epoch year 1). This causes incorrect dates to display on article pages and in search results.

## Solution

### Layer 1: Pre-commit Hook

**File:** `.git/hooks/pre-commit`

Automatically runs before each commit to validate:
- ✅ All dates are in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- ✅ No invalid years (0001, 1970)
- ✅ Detects missing date fields in content files

**Usage:** Automatic (runs before every commit)

**Example output:**
```
🔍 Validating article front matter dates...
❌ ERROR: content/posts/my-article.md has invalid date: 0001-01-01
```

If validation fails, the commit is blocked until dates are corrected.

### Layer 2: Build-time Validation

**File:** `scripts/validate-dates.sh`

Comprehensive validation that runs before Hugo build:
- 📊 Checks all content files
- 🔍 Detects invalid years and missing dates
- ⚠️ Warns about future dates

**Usage:**
```bash
# Run manually before building
./scripts/validate-dates.sh

# Or integrate into build pipeline:
# ./scripts/validate-dates.sh && hugo --minify
```

### Layer 3: Front Matter Standards

**Required format for all content pages:**

```markdown
---
title: "Article Title"
date: 2025-12-14T00:00:00Z
description: "Brief description"
---

Content here...
```

**Format breakdown:**
- `2025` — Year (4 digits)
- `12` — Month (01-12)
- `14` — Day (01-31)
- `T` — Time separator (required)
- `00:00:00` — Time in UTC (HH:MM:SS)
- `Z` — UTC timezone indicator

**Examples of valid dates:**
- `2025-12-14T00:00:00Z` ✅ (December 14, 2025 midnight UTC)
- `2025-01-01T14:30:00Z` ✅ (January 1, 2025 at 2:30 PM UTC)

**Examples of invalid dates:**
- `2025-12-14` ❌ (missing time component)
- `12-14-2025` ❌ (wrong format order)
- `0001-01-01` ❌ (invalid year)

## Special Cases

### Pages that don't need dates:
- `content/_index.md` — Homepage
- `content/admin/login.md` — Admin panel
- Any page with `layout: admin` or similar special layouts

### How to fix missing dates:

1. **Identify the file** — Check validation output
2. **Add date field** — Insert `date: YYYY-MM-DDTHH:MM:SSZ` in front matter
3. **Use current date** — If unsure, use today's date in ISO 8601 format
4. **Commit and push** — Pre-commit hook will validate

**Example fix:**

```markdown
---
title: "My Article"
date: 2025-12-14T00:00:00Z
description: "..."
---
```

## Automation in CI/CD

For Cloudflare Pages deployment, add to build command:

**wrangler.toml:**
```toml
build = "scripts/validate-dates.sh && hugo --minify"
```

This ensures no pages with invalid dates are ever deployed.

## Testing the Validation

```bash
# Test pre-commit hook
git commit -m "test"

# Test build-time validation
./scripts/validate-dates.sh

# Both should output validation results and exit with code 0 (success)
```

## Summary

This three-layer approach ensures:

✅ No invalid dates slip into commits  
✅ Build fails if invalid dates are present  
✅ Clear error messages guide fixing issues  
✅ Automatic enforcement with no extra work  

The result: **January 1, 0001 can never appear on StudioLinux again.**
