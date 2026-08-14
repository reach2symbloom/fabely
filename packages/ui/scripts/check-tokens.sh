#!/usr/bin/env bash
# Token guard — detect hardcoded colors, easing, or rhythm values that bypass design tokens.
#
# src/components/ui is shadcn CLI output that we regenerate rather than
# hand-edit. Layers we author and own — Primitives (wrapped vendor
# components), the atomic composition tiers, and Features — come under
# the CI gate. As each vendor component gets wrapped into a Primitive,
# that wrapper is scanned here.
#
# Modes:
#   owned  (default) — scan src/primitives + composition tiers; exit
#                      non-zero on hits (CI gate). `atoms` is accepted
#                      as a deprecated alias for the same scan.
#   vendor           — scan src/components/ui; report hits, always exit 0
#
# Scans for:
#   - Hex color literals (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
#     (skips HTML entities like &#123; via a non-& prefix check)
#   - Arbitrary Tailwind values that embed hex/rgb/hsl/oklch/hwb/lab/lch
#   - Literal rgb()/rgba()/hsl()/hsla() (and oklch/hwb/lab/lch without from var)
#   - Raw cubic-bezier(...)
#   - Arbitrary px/rem on rhythm axes Foundations defines: padding, gap,
#     margin, border-radius (e.g. p-[4px], gap-[0.5rem], rounded-[5px])
#   - Arbitrary icon sizing (size/h/w/min-*/max-* with px/rem) when tied to
#     icon context selectors ([&>svg], [&_svg], svg:, data-[icon…])
#
# Does not flag height/width sizing (h-[…], w-[…], size-[…] without icon
# context, min/max-h/w, etc.). Height and width are frequently consequences
# of content, padding, and line-height rather than designed values. Figma
# does not define them as tokens, so we do not invent tokens for them.
#
# Allows (stripped before matching):
#   - Hex inside attribute selectors used to match third-party SVG output
#     (e.g. [stroke='#ccc'], [fill="#fff"]) — overrides, not color declarations
#   - oklch(from var(--token) ...) / oklch(from_var(--token)_...) relative color
#     syntax that derives from tokens. Bare oklch(0.5 ...) still fails.
#
# Excludes:
#   - *.stories.tsx (story layout scaffolding, not shipped)
#   - Comment-only lines (^\s*//, ^\s*\*, ^\s*/\*) so DESIGN.md /
#     README prose quoted in comments does not fail the check
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODE="${1:-owned}"

case "$MODE" in
  owned|atoms)
    SEARCH_DIRS=(src/primitives src/atoms src/molecules src/organisms src/templates src/features)
    FAIL_ON_HITS=1
    ;;
  vendor)
    SEARCH_DIRS=(src/components/ui)
    FAIL_ON_HITS=0
    ;;
  *)
    echo "Usage: $0 [owned|vendor]" >&2
    exit 2
    ;;
esac

# Broad candidate scan (colors, easing, any px/rem). Precise filtering below.
SCAN_PATTERN='([^&]|^)(#[0-9a-fA-F]{3}([0-9a-fA-F]{1}|[0-9a-fA-F]{3}|[0-9a-fA-F]{5})?\b)|(-\[#|\[#)|(bg|text|border|fill|stroke|from|to|via|ring|outline|decoration|shadow|accent|caret|divide|placeholder)-\[#|(rgba?|hsla?|oklch|hwb|lab|lch)\(|cubic-bezier\(|[0-9]+(\.[0-9]+)?(px|rem)\b'

# Colors / easing — always violations (after false-positive sanitize).
COLOR_EASING_PATTERN='([^&]|^)(#[0-9a-fA-F]{3}([0-9a-fA-F]{1}|[0-9a-fA-F]{3}|[0-9a-fA-F]{5})?\b)|(-\[#|\[#)|(bg|text|border|fill|stroke|from|to|via|ring|outline|decoration|shadow|accent|caret|divide|placeholder)-\[#|(rgba?|hsla?|oklch|hwb|lab|lch)\(|cubic-bezier\('

# Rhythm axes with raw px/rem inside Tailwind arbitrary brackets.
# Use [^]] (not [^\]]) — BSD grep character classes treat \] differently.
# Longer utilities first so p/m/gap do not starve px/gap-x/etc.
RHYTHM_PATTERN='(^|[^a-zA-Z0-9_-])(px|py|pt|pb|pl|pr|ps|pe|p|mx|my|mt|mb|ml|mr|ms|me|m|gap-x|gap-y|gap)-\[[^]]*(px|rem)[^]]*\]|(^|[^a-zA-Z0-9_-])rounded(-[a-z]+)?-\[[^]]*(px|rem)[^]]*\]'

# Icon-context arbitrary size: svg / data-icon variant immediately preceding
# a size/h/w utility with raw px/rem. Whitespace breaks the match so a
# co-located non-icon h-[…] on the same line is not pulled in.
ICON_SIZE_PATTERN='(svg|data-\[icon)[^[:space:]]{0,120}:(size|h|w|min-h|max-h|min-w|max-w)-\[[^]]*(px|rem)[^]]*\]'

is_comment_line() {
  local content="$1"
  # Comment-only: optional whitespace, then // or block-comment markers
  [[ "$content" =~ ^[[:space:]]*(//|\*|/\*) ]]
}

# Strip allowed constructs so they do not trigger the guard.
sanitize_false_positives() {
  local s="$1"

  # Attribute selectors containing hex — match third-party SVG attrs to override.
  # e.g. [stroke='#ccc'], [fill="#fff"], [stroke=#abc]
  # (no backrefs — BSD sed is unreliable with optional capture groups)
  s="$(printf '%s' "$s" | sed -E "s/\[[[:alnum:]_-]+=['\"]?#[0-9a-fA-F]{3,8}['\"]?\]//g")"

  # oklch(from var(--token) ...) and Tailwind form oklch(from_var(--token)_...)
  # Strip balanced oklch(...) only when it uses relative color from a CSS variable.
  local out=""
  local i=0
  local len=${#s}
  while (( i < len )); do
    local rest="${s:i}"
    if [[ "$rest" =~ ^oklch\(from[_[:space:]]*var\( ]]; then
      local j=$i
      # Advance to the '(' after oklch
      while (( j < len )) && [[ "${s:j:1}" != "(" ]]; do
        ((j++)) || true
      done
      local depth=0
      while (( j < len )); do
        local c="${s:j:1}"
        if [[ "$c" == "(" ]]; then
          ((depth++)) || true
        elif [[ "$c" == ")" ]]; then
          ((depth--)) || true
          ((j++)) || true
          if (( depth == 0 )); then
            break
          fi
          continue
        fi
        ((j++)) || true
      done
      i=$j
    else
      out+="${s:i:1}"
      ((i++)) || true
    fi
  done
  printf '%s' "$out"
}

content_still_hits() {
  local content="$1"
  printf '%s' "$content" | grep -qE "$COLOR_EASING_PATTERN" && return 0
  printf '%s' "$content" | grep -qE "$RHYTHM_PATTERN" && return 0
  printf '%s' "$content" | grep -qE "$ICON_SIZE_PATTERN" && return 0
  return 1
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
        -e "$SCAN_PATTERN" \
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
        -E "$SCAN_PATTERN" \
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
    local sanitized
    sanitized="$(sanitize_false_positives "$content")"
    if ! content_still_hits "$sanitized"; then
      continue
    fi
    printf '%s\n' "$line"
    hit=1
  done <<< "$raw"

  return "$hit"
}

echo "Checking design tokens in ${SEARCH_DIRS[*]} (mode: $MODE) ..."

hits=""
if hits="$(collect_hits)"; then
  :
fi

if [[ -n "${hits}" ]]; then
  if (( FAIL_ON_HITS )); then
    printf '\nToken guard failed — hardcoded colors / easing / rhythm / icon size:\n\n'
    printf '%s\n' "$hits"
    printf '\nUse design tokens (CSS variables / Tailwind theme) instead.\n' >&2
    exit 1
  else
    printf '\nToken guard (informational) — hardcoded colors / easing / rhythm / icon size in vendor output:\n\n'
    printf '%s\n' "$hits"
    printf '\nVendor files are not hand-edited; regenerate rather than patching. Exit 0.\n'
    exit 0
  fi
fi

printf 'Token guard passed: no hardcoded hex, easing, rhythm, or icon-size bypasses in scanned sources.\n'
exit 0
