#!/bin/bash

# SEO Fixes - Pre-Deployment Verification Script
# This script verifies all SEO changes are in place before deployment

set -e

echo "🔍 SEO Fixes - Verification Script"
echo "===================================="
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 MISSING"
        ((CHECKS_FAILED++))
        return 1
    fi
}

check_file_contains() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contains '$2'"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing '$2'"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo "📄 Checking Modified Files..."
echo ""

check_file_exists "layouts/_default/baseof.html"
check_file_contains "layouts/_default/baseof.html" 'canonical'
check_file_contains "layouts/_default/baseof.html" 'noindex'

echo ""
check_file_exists "hugo.yaml"
check_file_contains "hugo.yaml" "- SITEMAP"
check_file_contains "hugo.yaml" "sitemap:"

echo ""
check_file_exists "content/admin/login.md"
check_file_contains "content/admin/login.md" "noindex: true"

echo ""
echo "📄 Checking New Files..."
echo ""

check_file_exists "static/robots.txt"
check_file_contains "static/robots.txt" "Disallow: /admin/"
check_file_contains "static/robots.txt" "Sitemap:"

echo ""
check_file_exists "static/_redirects"
check_file_contains "static/_redirects" "www.studiolinux.com"
check_file_contains "static/_redirects" "301"

echo ""
check_file_exists "static/_headers"
check_file_contains "static/_headers" "Cache-Control"
check_file_contains "static/_headers" "X-Content-Type-Options"

echo ""
check_file_exists "layouts/sitemap.xml"
check_file_contains "layouts/sitemap.xml" "urlset"
check_file_contains "layouts/sitemap.xml" "noindex"

echo ""
check_file_exists "layouts/partials/noindex.html"
check_file_contains "layouts/partials/noindex.html" "robots"

echo ""
echo "📚 Checking Documentation..."
echo ""

check_file_exists "SEO_FIXES_IMPLEMENTATION.md"
check_file_exists "SEO_DEPLOYMENT_CHECKLIST.md"
check_file_exists "SEO_SUMMARY.md"
check_file_exists "SEO_QUICK_REFERENCE.md"
check_file_exists "CHANGES_SUMMARY.md"
check_file_exists "SEO_DOCUMENTATION_INDEX.md"

echo ""
echo "===================================="
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: hugo --minify"
    echo "2. Verify public/robots.txt exists"
    echo "3. Verify public/sitemap.xml exists"
    echo "4. Run: git add -A"
    echo "5. Run: git commit -m 'fix(seo): Add canonical tags, robots.txt, redirects'"
    echo "6. Run: git push origin main"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    echo ""
    echo "Summary:"
    echo -e "  Passed: ${GREEN}$CHECKS_PASSED${NC}"
    echo -e "  Failed: ${RED}$CHECKS_FAILED${NC}"
    echo ""
    exit 1
fi
