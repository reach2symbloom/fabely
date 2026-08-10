import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/styles/globals.css'
import './theme.css'

// globals.css pulls in Tailwind (`@import 'tailwindcss'`) and Foundations
// (`@import '../foundations/index.css'`) together, so shadcn/Tailwind-based
// components under src/components/ui render styled the same way they will
// in the app, not just Foundations' plain CSS custom properties.
//
// Fabely's real theme mechanism is the `.dark` class toggled on the document
// root (see src/styles/globals.css: `@custom-variant dark (&:is(.dark *))`).
// This decorator drives that same class from a Storybook global (flipped by
// the single-click toolbar button in .storybook/manager.tsx), instead of any
// Storybook-only theming (backgrounds addon, manager theme, etc).
const THEME_STORAGE_KEY = 'fabely-storybook-theme'
type ThemeName = 'light' | 'dark'

function getStoredTheme(): ThemeName {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

const preview: Preview = {
  initialGlobals: {
    theme: getStoredTheme(),
  },
  decorators: [
    (Story, context) => {
      const theme: ThemeName = context.globals.theme === 'dark' ? 'dark' : 'light'

      // Applied synchronously during render, not in an effect: React fires
      // child effects before parent effects, so a child's mount-time
      // getComputedStyle() read (see ColorSwatchTable) would otherwise race
      // ahead of this and capture the pre-toggle value.
      document.documentElement.classList.toggle('dark', theme === 'dark')

      useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme)
      }, [theme])

      // Remounting on theme change re-runs every story's getComputedStyle()
      // reads (see ColorSwatchTable), so every foundation story — current and
      // future — picks up the toggle automatically with no per-story code.
      return <Story key={theme} />
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    options: {
      // Every Foundations category follows the same conceptual reading order:
      // Raw (primitives) -> Themes (theme-dependent layers, where applicable)
      // -> Semantic (what components actually consume). Add new categories'
      // sub-pages here in that order so the sidebar keeps teaching the same
      // mental model instead of falling back to alphabetical/discovery order.
      storySort: {
        order: [
          'Design System',
          [
            'Foundations',
            [
              'Colors',
              [
                'Raw',
                'Themes',
                ['Neutrals', 'Neutrals (Migration Layer)', 'Alpha'],
                'Semantic',
                'Gradients',
                ['Primary'],
              ],
              'Spacing',
              ['Raw', 'Semantic'],
              'Radius',
              ['Raw', 'Semantic'],
              'Stroke',
              'Shadows',
              ['Base', 'Semantic'],
              'Effects',
              ['Glows', 'Focus Rings'],
              'Typography',
              [
                'Font Definitions',
                'Typography Styles',
                ['Headings', 'Paragraph', 'Manuscript', 'Captions', 'Monospaced'],
                'All Fonts',
              ],
              'Iconography',
              [
                'Overview',
                'Size Tokens',
                'Stroke & Alignment',
                'Icon Library',
                ['Lucide', 'Solar', 'Fabely Icons'],
                'Best Practices',
              ],
            ],
            // Primitives: wrapped vendor components (flat, alphabetical).
            // Nested families (e.g. Button) must be listed explicitly — otherwise
            // Storybook appends the folder after every leaf. Page arrays keep
            // Overview first where we have customized that order.
            'Primitives',
            [
              'Accordion',
              [
                'Overview',
                'Basic',
                'Multiple',
                'Disabled',
                'Borders',
                'Card',
                'RTL',
              ],
              'Alert',
              ['Overview', 'One Line', 'Two Lines', 'Without Icon', 'Error', 'Warning', 'Success'],
              'Alert Dialog',
              'Aspect Ratio',
              'Attachment',
              'Avatar',
              [
                'Overview',
                'Default',
                'With Image',
                'Fallback',
                'Several Fallback Initials',
                'Sizes',
                'Shapes',
                'Status Badge',
                'Icon Badge',
                'Group',
                'Group With Badges',
                'Group With Count',
                'Group With Count Icon',
                'Gradient',
              ],
              'Badge',
              [
                'Overview',
                'Default',
                'Variants',
                'Sizes',
                'Roundness',
                'Figma Matrix',
                'With Icon',
                'With Spinner',
                'Link',
                'Custom Colors',
                'RTL',
              ],
              'Breadcrumb',
              'Bubble',
              'Button',
              [
                'Icon Button',
                [
                  'Overview',
                  'Default',
                  'Variants',
                  'Sizes',
                  'Shape',
                  'Matrix',
                  'Disabled',
                  'Pressed',
                ],
                'Text Button',
                [
                  'Overview',
                  'Default',
                  'Variants',
                  'Sizes',
                  'Shape',
                  'Figma Matrix',
                  'With Icon',
                  'Spinner',
                  'Disabled',
                  'Pressed',
                  'As Link',
                  'RTL',
                ],
              ],
              'Button Group',
              'Calendar',
              'Card',
              'Carousel',
              'Chart',
              'Checkbox',
              'Collapsible',
              'Combobox',
              'Command',
              'Context Menu',
              'Dialog',
              'Drawer',
              'Dropdown Menu',
              'Empty',
              'Field',
              'Hover Card',
              'Input',
              'Input Group',
              'Input Otp',
              'Item',
              'Kbd',
              'Label',
              'Marker',
              'Menubar',
              'Message',
              'Message Scroller',
              'Native Select',
              'Navigation Menu',
              'Pagination',
              'Popover',
              'Progress',
              'Radio Group',
              'Resizable',
              'Scroll Area',
              'Select',
              'Separator',
              'Sheet',
              'Sidebar',
              'Skeleton',
              'Slider',
              'Spinner',
              'Switch',
              'Table',
              'Tabs',
              'Textarea',
              'Toast',
              'Toggle',
              'Toggle Group',
              'Tooltip',
            ],
            'Atoms',
            'Molecules',
            'Organisms',
            'Templates',
          ],
        ],
      },
    },
  },
};

export default preview;
