#!/bin/bash
# Build-time date validation script
# Runs before Hugo build to catch invalid dates

echo "🔍 Validating all content dates before build..."

INVALID_DATES=0
TOTAL_FILES=0

# Find all markdown files in content
for file in $(find content -name "*.md" -type f); do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Extract date from front matter
    DATE=$(grep "^date:" "$file" | head -1 | sed 's/date: *//;s/"//g;s/'"'"'//g')
    
    if [ -z "$DATE" ]; then
        # Some pages legitimately don't need dates (admin, home)
        LAYOUT=$(grep "^layout:" "$file" | sed 's/layout: *//;s/"//g')
        if [[ "$LAYOUT" =~ ^(admin|search)$ ]]; then
            continue
        fi
        
        # Check if it's a top-level content file
        if [[ "$file" == "content/_index.md" ]]; then
            continue
        fi
        
        # All other content should have dates
        echo "⚠️  WARNING: $file is missing a date field"
        continue
    fi
    
    # Check for invalid year (0001, 1970, etc.)
    YEAR=$(echo "$DATE" | cut -d'-' -f1)
    
    if [ "$YEAR" = "0001" ] || [ "$YEAR" = "1970" ]; then
        echo "❌ ERROR: Invalid date found in $file"
        echo "   Date: $DATE (Year: $YEAR)"
        INVALID_DATES=$((INVALID_DATES + 1))
    fi
    
    # Warn about future dates (more than 1 year ahead)
    CURRENT_YEAR=$(date +%Y)
    if [ "$YEAR" -gt $((CURRENT_YEAR + 1)) ]; then
        echo "⚠️  WARNING: Future date in $file: $DATE"
    fi
done

echo ""
echo "📊 Validation Complete:"
echo "   Total files checked: $TOTAL_FILES"
echo "   Invalid dates found: $INVALID_DATES"

if [ $INVALID_DATES -gt 0 ]; then
    echo ""
    echo "❌ BUILD FAILED: Invalid dates must be fixed before publishing"
    echo ""
    echo "How to fix:"
    echo "  1. Edit the markdown file"
    echo "  2. Add or correct the date field in ISO 8601 format:"
    echo "     date: YYYY-MM-DDTHH:MM:SSZ"
    echo "     Example: date: 2025-12-14T00:00:00Z"
    exit 1
fi

echo "✅ All dates are valid!"
exit 0
