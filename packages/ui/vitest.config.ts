import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        resolve: {
          // Mirrors .storybook/main.ts's own viteFinal alias — "pure,
          // dependency-free" (see below) means no browser/story
          // dependency, not that a unit-tested module can't import a
          // shared `@/`-aliased type/util module the rest of the
          // codebase already uses that way (e.g. promptbar-presentation.ts
          // importing status-badge-content.ts's formatters). Without
          // this, any such import fails at resolve time, not just for
          // vendor components under src/components/ui like the
          // Storybook project's own comment calls out.
          alias: {
            '@': path.resolve(dirname, 'src'),
          },
        },
        test: {
          // Plain unit tests for pure, dependency-free logic (e.g. the
          // outline drag-and-drop reducer) — no browser, no Storybook
          // story discovery, just node + the file(s) under test.
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
    ],
  },
});
