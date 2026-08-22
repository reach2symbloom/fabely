/**
 * @fabely/ui package entry point.
 *
 * Barrel export following the layering documented in `docs/DESIGN.md`:
 * Foundations -> Primitives -> Atoms -> Molecules -> Organisms -> Templates.
 * Re-exports will be added here as each layer gains real content.
 *
 * Foundations are CSS custom properties (see `foundations/index.css`),
 * consumed directly by Storybook's preview today; how a future JS/CSS
 * consumer of this package should import them is an open question for
 * whenever a consumer other than Storybook actually needs it.
 */

// export * from './primitives';
export * from './atoms';
export * from './molecules';
// export * from './organisms';
// export * from './templates';
