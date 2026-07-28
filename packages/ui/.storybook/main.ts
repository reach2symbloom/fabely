import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
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
  "framework": "@storybook/react-vite"
};
export default config;