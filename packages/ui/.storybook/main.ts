import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Foundations docs + empty-tier placeholders live under ../stories;
    // component stories (primitives, atoms, molecules, organisms, templates)
    // are colocated with their component under src/ instead — see
    // src/primitives/avatar/avatar.stories.tsx.
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "staticDirs": ["./public"],
  "core": {
    // Hides the default "What's new in Storybook" sidebar/update panel so the
    // Fabely-branded chrome isn't sharing space with Storybook's own promo UI.
    "disableWhatsNewNotifications": true
  },
  "features": {
    // Hides the default "Get started" onboarding checklist card above the
    // sidebar (Add stories / Controls / Share feedback) — same reasoning as
    // disableWhatsNewNotifications above.
    "sidebarOnboardingChecklist": false
  },
  "framework": "@storybook/react-vite",
  // 'vite' itself isn't a direct dependency of this package (it's transitive
  // via @storybook/react-vite, and pnpm's strict linking won't resolve it as
  // a bare import here) — so this extends the config Storybook hands back
  // directly, rather than importing vite's own mergeConfig helper.
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        // Mirrors components.json's "@/*" alias (shadcn's own convention) so
        // vendor components under src/components/ui resolve at runtime, not
        // just during type-checking (tsconfig's "paths" alone doesn't affect
        // Vite's module resolution).
        alias: {
          ...viteConfig.resolve?.alias,
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
      // Tailwind v4's CSS-first setup — processes the `@import 'tailwindcss'`
      // in src/styles/globals.css (see preview.tsx) so vendor components'
      // utility classes actually render, not just resolve as inert strings.
      plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    };
  },
};
export default config;