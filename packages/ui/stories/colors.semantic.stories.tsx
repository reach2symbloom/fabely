import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, SectionHeading, PendingNotice, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/Semantic Colors',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// shadcn colors / general
const generalLight: ColorToken[] = [
  { name: 'background', cssVar: '--background', reference: '--tw-raw-neutral-200' },
  { name: 'foreground', cssVar: '--foreground', reference: '--tw-raw-black' },
  { name: 'primary', cssVar: '--primary', reference: '--theme-neutrals-600', note: 'main' },
  { name: 'primary hover', cssVar: '--primary-hover', reference: '--theme-neutrals-700' },
  { name: 'primary foreground', cssVar: '--primary-foreground', reference: '--tw-raw-white' },
  { name: 'secondary', cssVar: '--secondary', reference: '--theme-neutrals-200' },
  { name: 'secondary hover', cssVar: '--secondary-hover', reference: '--theme-neutrals-300' },
  { name: 'secondary foreground', cssVar: '--secondary-foreground', reference: '--theme-neutrals-900' },
  { name: 'accent', cssVar: '--accent', reference: '--tw-raw-secondary-ghost', note: 'same in Light and Dark' },
  { name: 'accent foreground', cssVar: '--accent-foreground', reference: '--tw-raw-white' },
  { name: 'muted', cssVar: '--muted', reference: '--theme-neutrals-100' },
  {
    name: 'muted foreground',
    cssVar: '--muted-foreground',
    reference: '--theme-alpha-black-switch-50',
    note: 'switch token — flips base color automatically in Dark',
  },
  { name: 'text', cssVar: '--text', reference: '--theme-alpha-black-no-switch-75' },
  { name: 'destructive', cssVar: '--destructive', reference: '--tw-raw-error-500' },
  { name: 'border', cssVar: '--border', reference: '--theme-neutrals-300' },
  { name: 'input', cssVar: '--input', reference: '--theme-neutrals-200' },
  { name: 'card', cssVar: '--card', reference: '--theme-alpha-white-switch-100' },
  { name: 'card foreground', cssVar: '--card-foreground', reference: '--theme-neutrals-950' },
  { name: 'popover', cssVar: '--popover', reference: '--tw-raw-white' },
  { name: 'popover foreground', cssVar: '--popover-foreground', reference: '--tw-raw-neutral-950' },
];

const generalDark: ColorToken[] = [
  { name: 'background', cssVar: '--background', reference: '--tw-raw-neutral-900' },
  { name: 'foreground', cssVar: '--foreground', reference: '--tw-raw-white' },
  { name: 'primary', cssVar: '--primary', reference: '--theme-neutrals-500' },
  { name: 'primary hover', cssVar: '--primary-hover', reference: '--theme-alpha-black-switch-333' },
  { name: 'primary foreground', cssVar: '--primary-foreground', reference: '--theme-neutrals-950' },
  { name: 'secondary', cssVar: '--secondary', reference: '--theme-neutrals-800' },
  { name: 'secondary hover', cssVar: '--secondary-hover', reference: '--theme-neutrals-700' },
  { name: 'secondary foreground', cssVar: '--secondary-foreground', reference: '--theme-neutrals-100' },
  { name: 'accent', cssVar: '--accent', reference: '--tw-raw-secondary-ghost', note: 'same in Light and Dark' },
  { name: 'accent foreground', cssVar: '--accent-foreground', reference: '--theme-neutrals-100' },
  { name: 'muted', cssVar: '--muted', reference: '--theme-neutrals-900' },
  {
    name: 'muted foreground',
    cssVar: '--muted-foreground',
    reference: '--theme-alpha-black-switch-50',
    note: 'switch token — flips base color automatically in Dark',
  },
  { name: 'text', cssVar: '--text', reference: '--theme-alpha-white-no-switch-75' },
  { name: 'destructive', cssVar: '--destructive', reference: '--tw-raw-error-300' },
  { name: 'border', cssVar: '--border', reference: '--theme-neutrals-700' },
  { name: 'input', cssVar: '--input', reference: '--theme-neutrals-800' },
  { name: 'card', cssVar: '--card', reference: '--theme-neutrals-900' },
  { name: 'card foreground', cssVar: '--card-foreground', reference: '--theme-alpha-white-switch-100' },
  { name: 'popover', cssVar: '--popover', reference: '--tw-raw-neutral-950' },
  { name: 'popover foreground', cssVar: '--popover-foreground', reference: '--tw-raw-white' },
];

// shadcn colors / focus
const focusLight: ColorToken[] = [
  { name: 'ring', cssVar: '--ring', reference: '--theme-neutrals-300' },
  { name: 'ring primary', cssVar: '--ring-primary', reference: '--tw-raw-neutral-400' },
  { name: 'ring error', cssVar: '--ring-error', reference: '--tw-raw-error-100' },
  { name: 'ring success', cssVar: '--ring-success', reference: '--tw-raw-success-ghost' },
  { name: 'ring alert', cssVar: '--ring-alert', reference: '--tw-raw-alert-100' },
];

const focusDark: ColorToken[] = [
  { name: 'ring', cssVar: '--ring', reference: '--theme-neutrals-700' },
  { name: 'ring primary', cssVar: '--ring-primary', reference: '--theme-neutrals-700' },
  { name: 'ring error', cssVar: '--ring-error', reference: '--tw-raw-error-ghost' },
  { name: 'ring success', cssVar: '--ring-success', reference: '--tw-raw-success-700' },
  { name: 'ring alert', cssVar: '--ring-alert', reference: '--tw-raw-alert-700' },
];

// shadcn colors / sidebar
const sidebarLight: ColorToken[] = [
  { name: 'sidebar', cssVar: '--sidebar', reference: '--theme-neutrals-50' },
  { name: 'sidebar foreground', cssVar: '--sidebar-foreground', reference: '--theme-neutrals-700' },
  {
    name: 'sidebar accent',
    cssVar: '--sidebar-accent',
    reference: '--theme-alpha-black-switch-333',
    note: 'switch token — flips base color automatically in Dark',
  },
  { name: 'sidebar accent foreground', cssVar: '--sidebar-accent-foreground', reference: '--theme-neutrals-900' },
  { name: 'sidebar primary', cssVar: '--sidebar-primary', reference: '--neutrals-new-400' },
  { name: 'sidebar primary foreground', cssVar: '--sidebar-primary-foreground', reference: '--tw-raw-white' },
  {
    name: 'sidebar border',
    cssVar: '--sidebar-border',
    reference: '--theme-neutrals-200',
    note: 'Figma shows a possible detach/override marker on this cell — verify against Figma',
  },
  { name: 'sidebar ring', cssVar: '--sidebar-ring', reference: '--theme-neutrals-300' },
];

const sidebarDark: ColorToken[] = [
  { name: 'sidebar', cssVar: '--sidebar', reference: '--theme-neutrals-950' },
  { name: 'sidebar foreground', cssVar: '--sidebar-foreground', reference: '--theme-neutrals-300' },
  {
    name: 'sidebar accent',
    cssVar: '--sidebar-accent',
    reference: '--theme-alpha-black-switch-333',
    note: 'switch token — flips base color automatically in Dark',
  },
  { name: 'sidebar accent foreground', cssVar: '--sidebar-accent-foreground', reference: '--theme-neutrals-100' },
  { name: 'sidebar primary', cssVar: '--sidebar-primary', reference: '--neutrals-new-300' },
  {
    name: 'sidebar primary foreground',
    cssVar: '--sidebar-primary-foreground',
    pending: true,
    note: 'BLOCKED: Figma shadcn-dark value is a broken reference ("shadcn/neutral/1") — does not resolve to any tw-raw, theme-neutrals, Neutrals (New), or theme-alpha token. Not implemented; needs a Figma fix.',
  },
  { name: 'sidebar border', cssVar: '--sidebar-border', reference: '--theme-neutrals-800' },
  { name: 'sidebar ring', cssVar: '--sidebar-ring', reference: '--theme-neutrals-700' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Source: Figma "shadcn colors" collection (general / focus / sidebar groups). Aliases
        only — every token resolves to an existing <code>tw-raw</code>, <code>theme-neutrals</code>,{' '}
        <code>Neutrals (New)</code>, or <code>theme-alpha</code> value via <code>var()</code>; no
        new literal color values are introduced at this layer.
        <br />
        <br />
        <strong>Unresolved:</strong> <code>sidebar primary foreground</code>'s Dark value in
        Figma points to <code>shadcn/neutral/1</code>, which is a broken reference — it does not
        match any declared token. It has been left <strong>not implemented</strong> in Dark mode
        rather than guessed (see the flagged row below). Needs a fix in Figma before it can be
        completed.
      </PendingNotice>

      <SectionHeading>shadcn colors / general</SectionHeading>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={generalLight} referenceLabel="Aliases (source token)" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={generalDark} referenceLabel="Aliases (source token)" dark />

      <SectionHeading>shadcn colors / focus</SectionHeading>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={focusLight} referenceLabel="Aliases (source token)" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={focusDark} referenceLabel="Aliases (source token)" dark />

      <SectionHeading>shadcn colors / sidebar</SectionHeading>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={sidebarLight} referenceLabel="Aliases (source token)" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={sidebarDark} referenceLabel="Aliases (source token)" dark />
    </div>
  ),
};
