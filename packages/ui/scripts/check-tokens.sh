#!/usr/bin/env bash
# Token guard — fail CI when hardcoded colors bypass design tokens.
#
# Scans src/atoms and src/components/ui for:
#   - Hex color literals (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
#     (skips HTML entities like &#123; via a non-& prefix check)
#   - Arbitrary Tailwind values that embed hex/rgb/hsl/oklch/hwb/lab/lch
#     (e.g. bg-[#fff], text-[rgb(...)], border-[hsl(...)], -[#...])
#
# Excludes:
#   - *.stories.tsx (story layout scaffolding, not shipped)
#   - Comment-only lines (^\s*//, ^\s*\*, ^\s*/\*) so DESIGN.md /
#     README prose quoted in comments does not fail the check
#
# Exit 0 if clean, non-zero if any hit.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SEARCH_DIRS=(src/atoms src/components/ui)

# Hex (#RGB/#RGBA/#RRGGBB/#RRGGBBAA), not HTML entities (&#123;).
# Arbitrary Tailwind color brackets and color-function literals.
PATTERN='([^&]|^)(#[0-9a-fA-F]{3}([0-9a-fA-F]{1}|[0-9a-fA-F]{3}|[0-9a-fA-F]{5})?\b)|(-\[#|\[#)|(bg|text|border|fill|stroke|from|to|via|ring|outline|decoration|shadow|accent|caret|divide|placeholder)-\[#|(rgb|hsl|oklch|hwb|lab|lch)\('

is_comment_line() {
  local content="$1"
  # Comment-only: optional whitespace, then // or block-comment markers
  [[ "$content" =~ ^[[:space:]]*(//|\*|/\*) ]]
}

collect_hits() {
  local raw=""

  if command -v rg >/dev/null 2>&1; then
    # Quote every glob (zsh expands unquoted --include/--glob patterns).
    # Use separate include globs — brace globs break !*.stories.tsx negation.
    raw="$(
      rg -n --no-heading \
        --glob '*.ts' \
        --glob '*.tsx' \
        --glob '*.css' \
        --glob '!*.stories.tsx' \
        -e "$PATTERN" \
        "${SEARCH_DIRS[@]}" 2>/dev/null || true
    )"
  else
    # Quote --include/--exclude so shells do not expand globs
    raw="$(
      grep -RIn \
        --include='*.ts' \
        --include='*.tsx' \
        --include='*.css' \
        --exclude='*.stories.tsx' \
        -E "$PATTERN" \
        "${SEARCH_DIRS[@]}" 2>/dev/null || true
    )"
  fi

  if [[ -z "$raw" ]]; then
    return 0
  fi

  local hit=0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" ]] && continue
    # rg/grep format: path:lineno:content — strip path and line number
    local content="$line"
    if [[ "$line" =~ ^[^:]+:[0-9]+:(.*)$ ]]; then
      content="${BASH_REMATCH[1]}"
    fi
    if is_comment_line "$content"; then
      continue
    fi
    printf '%s\n' "$line"
    hit=1
  done <<< "$raw"

  return "$hit"
}

echo "Checking design tokens in ${SEARCH_DIRS[*]} ..."

hits=""
if hits="$(collect_hits)"; then
  :
fi

if [[ -n "${hits}" ]]; then
  printf '\nToken guard failed — hardcoded colors / arbitrary color values:\n\n'
  printf '%s\n' "$hits"
  printf '\nUse design tokens (CSS variables / Tailwind theme) instead.\n' >&2
  exit 1
fi

printf 'Token guard passed: no hardcoded hex or arbitrary color values in scanned sources.\n'
exit 0
