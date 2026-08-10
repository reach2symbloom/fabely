import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, SectionHeading, PendingNotice, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/Semantic',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// shadcn colors / general
const general: ColorToken[] = [
  { name: 'background', cssVar: '--background', reference: 'Light: --tw-raw-neutral-200 / Dark: --tw-raw-neutral-900' },
  { name: 'foreground', cssVar: '--foreground', reference: 'Light: --tw-raw-black / Dark: --tw-raw-white' },
  { name: 'primary', cssVar: '--primary', reference: 'Light: --theme-neutrals-600 (main) / Dark: --theme-neutrals-500' },
  { name: 'primary hover', cssVar: '--primary-hover', reference: 'Light: --theme-neutrals-700 / Dark: --theme-alpha-black-switch-333' },
  { name: 'primary foreground', cssVar: '--primary-foreground', reference: 'Light: --tw-raw-white / Dark: --theme-neutrals-950' },
  { name: 'secondary', cssVar: '--secondary', reference: 'Light: --theme-neutrals-200 / Dark: --theme-neutrals-800' },
  { name: 'secondary hover', cssVar: '--secondary-hover', reference: 'Light: --theme-neutrals-300 / Dark: --theme-neutrals-700' },
  { name: 'secondary foreground', cssVar: '--secondary-foreground', reference: 'Light: --theme-neutrals-900 / Dark: --theme-neutrals-100' },
  { name: 'accent', cssVar: '--accent', reference: '--tw-raw-secondary-ghost (Light & Dark)' },
  { name: 'accent foreground', cssVar: '--accent-foreground', reference: 'Light: --tw-raw-white / Dark: --theme-neutrals-100' },
  { name: 'muted', cssVar: '--muted', reference: 'Light: --theme-neutrals-100 / Dark: --theme-neutrals-900' },
  {
    name: 'muted foreground',
    cssVar: '--muted-foreground',
    reference: '--theme-alpha-black-switch-50 (switch token — flips automatically)',
  },
  { name: 'text', cssVar: '--text', reference: 'Light: --theme-alpha-black-no-switch-75 / Dark: --theme-alpha-white-no-switch-75' },
  { name: 'destructive', cssVar: '--destructive', reference: 'Light: --tw-raw-error-500 / Dark: --tw-raw-error-300' },
  { name: 'border', cssVar: '--border', reference: 'Light: --theme-neutrals-300 / Dark: --theme-neutrals-700' },
  { name: 'input', cssVar: '--input', reference: 'Light: --theme-neutrals-200 / Dark: --theme-neutrals-800' },
  { name: 'card', cssVar: '--card', reference: 'Light: --theme-alpha-white-switch-100 / Dark: --theme-neutrals-900' },
  { name: 'card foreground', cssVar: '--card-foreground', reference: 'Light: --theme-neutrals-950 / Dark: --theme-alpha-white-switch-100' },
  { name: 'popover', cssVar: '--popover', reference: 'Light: --tw-raw-white / Dark: --tw-raw-neutral-950' },
  { name: 'popover foreground', cssVar: '--popover-foreground', reference: 'Light: --tw-raw-neutral-950 / Dark: --tw-raw-white' },
  {
    name: 'overlay',
    cssVar: '--overlay',
    reference: '--theme-alpha-black-no-switch-30 (Light & Dark — non-switching scrim)',
    note: 'Modal / sheet backdrop. Alert Dialog now; Dialog, Sheet, Drawer when built.',
  },
];

// shadcn colors / focus
const focus: ColorToken[] = [
  { name: 'ring', cssVar: '--ring', reference: 'Light: --theme-neutrals-300 / Dark: --theme-neutrals-700' },
  { name: 'ring primary', cssVar: '--ring-primary', reference: 'Light: --tw-raw-neutral-400 / Dark: --theme-neutrals-700' },
  { name: 'ring error', cssVar: '--ring-error', reference: 'Light: --tw-raw-error-100 / Dark: --tw-raw-error-ghost' },
  { name: 'ring success', cssVar: '--ring-success', reference: 'Light: --tw-raw-success-ghost / Dark: --tw-raw-success-700' },
  { name: 'ring alert', cssVar: '--ring-alert', reference: 'Light: --tw-raw-alert-100 / Dark: --tw-raw-alert-700' },
];

// shadcn colors / sidebar
const sidebar: ColorToken[] = [
  { name: 'sidebar', cssVar: '--sidebar', reference: 'Light: --theme-neutrals-50 / Dark: --theme-neutrals-950' },
  { name: 'sidebar foreground', cssVar: '--sidebar-foreground', reference: 'Light: --theme-neutrals-700 / Dark: --theme-neutrals-300' },
  {
    name: 'sidebar accent',
    cssVar: '--sidebar-accent',
    reference: '--theme-alpha-black-switch-333 (switch token — flips automatically)',
  },
  { name: 'sidebar accent foreground', cssVar: '--sidebar-accent-foreground', reference: 'Light: --theme-neutrals-900 / Dark: --theme-neutrals-100' },
  { name: 'sidebar primary', cssVar: '--sidebar-primary', reference: 'Light: --neutrals-new-400 / Dark: --neutrals-new-300' },
  {
    name: 'sidebar primary foreground',
    cssVar: '--sidebar-primary-foreground',
    reference: 'Light: --tw-raw-white / Dark: NOT IMPLEMENTED',
    note: 'BLOCKED: Figma shadcn-dark value is a broken reference ("shadcn/neutral/1") — does not resolve to any tw-raw, theme-neutrals, Neutrals (New), or theme-alpha token. No .dark override was declared, so in Dark mode this currently just inherits the Light value shown here (not a verified Dark value). Needs a Figma fix.',
  },
  {
    name: 'sidebar border',
    cssVar: '--sidebar-border',
    reference: 'Light: --theme-neutrals-200 / Dark: --theme-neutrals-800',
    note: 'Figma shows a possible detach/override marker on the Light cell — verify against Figma',
  },
  { name: 'sidebar ring', cssVar: '--sidebar-ring', reference: 'Light: --theme-neutrals-300 / Dark: --theme-neutrals-700' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Semantic layer. Source: Figma "shadcn colors" collection (general / focus / sidebar
        groups). Aliases only — every token resolves to an existing Raw, Neutrals theme, Neutrals
        (Migration Layer), or Alpha theme value via <code>var()</code>; no new literal color
        values are introduced at this layer.
        <br />
        <br />
        Use the <strong>Theme</strong> toolbar toggle above to switch Light/Dark and see the
        Resolved Value column update.
        <br />
        <br />
        <strong>Unresolved:</strong> <code>sidebar primary foreground</code>'s Dark value in
        Figma points to <code>shadcn/neutral/1</code>, a broken reference — see the flagged row
        below.
      </PendingNotice>

      <SectionHeading>shadcn colors / general</SectionHeading>
      <ColorSwatchTable tokens={general} referenceLabel="Aliases (source token)" />

      <SectionHeading>shadcn colors / focus</SectionHeading>
      <ColorSwatchTable tokens={focus} referenceLabel="Aliases (source token)" />

      <SectionHeading>shadcn colors / sidebar</SectionHeading>
      <ColorSwatchTable tokens={sidebar} referenceLabel="Aliases (source token)" />
    </div>
  ),
};
