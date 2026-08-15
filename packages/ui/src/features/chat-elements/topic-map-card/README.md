# Topic Map Card

Compact chat/assistant row summarizing one topic-map item with a bold numbered
title and supporting description.

## Placement

Chat/assistant-specific chrome. Stays in
`src/features/chat-elements/topic-map-card/`.

## Authoritative Figma

[Topic map card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16338-2709)
set (`16338:2709`). Axis: Hover False / True.

## Tokens

| Role | Token |
| --- | --- |
| Title | Paragraph Regular / Bold; `--theme-alpha-black-switch-75` |
| Description | Paragraph Regular / Regular; `--theme-alpha-black-switch-50` |
| Hover fill | `--primary-hover` |
| Hover border | `--border` |
| Padding | `--spacing-xs` (8px) |
| Radius | `--rounded-md` (8px) |

## API

| Prop | Notes |
| --- | --- |
| `index` | Numbered prefix (`1. …`). Omit to hide. |
| `title` / `description` | Required visible copy. |
| `href` | Renders the whole card as a native anchor. |
| `forceHover` | Storybook/demo control for the hover state. |
